'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Conversation, ConversationFilter, ConversationStatus, ConversationWithMeta, Message } from '../core/domain'
import { getMessageAttachment, getMessageText } from '../core/domain'
import { useCustomerService } from '../context'

function upsertMessage(list: Message[], message: Message): Message[] {
  const index = list.findIndex((m) => m.id === message.id)
  if (index === -1) {
    return [...list, message].sort((a, b) => a.created_at.localeCompare(b.created_at))
  }
  const next = [...list]
  next[index] = message
  return next
}

function upsertConversation(list: Conversation[], conversation: Conversation): Conversation[] {
  const index = list.findIndex((c) => c.id === conversation.id)
  if (index === -1) return [conversation, ...list]
  const next = [...list]
  next[index] = conversation
  return next
}

export function useConversations(
  initialConversations: Conversation[],
  initialMessages: Message[]
) {
  const { config, services } = useCustomerService()
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id ?? null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ConversationFilter>('all')
  const [sending, setSending] = useState(false)

  const selectedIdRef = useRef(selectedId)
  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  const markRead = useCallback(async (conversationId: string) => {
    try {
      const data = await services.conversation.markAsRead(conversationId)
      setConversations((prev) => upsertConversation(prev, data))
    } catch {
      // Ignore
    }
  }, [services.conversation])

  useEffect(() => {
    if (selectedId) markRead(selectedId)
  }, [selectedId, markRead])

  useEffect(() => {
    const unsubscribe = config.providers.realtime.subscribe(
      'messages',
      undefined,
      (event) => {
        if (event.eventType === 'DELETE') return
        const message = event.new as unknown as Message
        if (!message?.id) return

        setMessages((prev) => upsertMessage(prev, message))

        if (
          message.sender_type === 'customer' &&
          message.conversation_id === selectedIdRef.current
        ) {
          markRead(message.conversation_id)
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [config.providers.realtime, markRead])

  useEffect(() => {
    const unsubscribe = config.providers.realtime.subscribe(
      'conversations',
      undefined,
      (event) => {
        if (event.eventType === 'DELETE') return
        const updated = event.new as unknown as Conversation
        if (!updated?.id) return
        setConversations((prev) => upsertConversation(prev, updated))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [config.providers.realtime])

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setSelectedId(conversationId)
      markRead(conversationId)

      try {
        const data = await services.message.getMessages(conversationId)
        if (data?.length) {
          setMessages((prev) => {
            const next = [...prev]
            for (const message of data) {
              if (!next.some((m) => m.id === message.id)) next.push(message)
            }
            return next.sort((a, b) => a.created_at.localeCompare(b.created_at))
          })
        }
      } catch {
        // Ignore
      }
    },
    [markRead, services.message]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const conversationId = selectedIdRef.current
      if (!conversationId) return
      setSending(true)
      try {
        const data = await services.message.sendAdminMessage(conversationId, content)
        setMessages((prev) => upsertMessage(prev, data))
      } finally {
        setSending(false)
      }
    },
    [services.message]
  )

  const sendAttachment = useCallback(
    async (file: File, content: string = '') => {
      const conversationId = selectedIdRef.current
      if (!conversationId) return
      setSending(true)
      try {
        const data = await services.message.sendAdminAttachment(
          conversationId,
          { name: file.name, size: file.size, type: file.type, data: file },
          content
        )
        setMessages((prev) => upsertMessage(prev, data))
      } finally {
        setSending(false)
      }
    },
    [services.message]
  )

  const setStatus = useCallback(
    async (conversationId: string, status: ConversationStatus) => {
      try {
        const data = await services.conversation.setStatus(conversationId, status)
        setConversations((prev) => upsertConversation(prev, data))
      } catch {
        // Ignore
      }
    },
    [services.conversation]
  )

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId]
  )

  const selectedMessages = useMemo(
    () =>
      messages
        .filter((m) => m.conversation_id === selectedId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [messages, selectedId]
  )

  const meta: ConversationWithMeta[] = useMemo(() => {
    const byConversation = new Map<string, Message[]>()
    for (const message of messages) {
      const list = byConversation.get(message.conversation_id) ?? []
      list.push(message)
      byConversation.set(message.conversation_id, list)
    }

    return conversations.map((conversation) => {
      const conversationMessages = byConversation.get(conversation.id) ?? []
      const last = conversationMessages[conversationMessages.length - 1]
      const lastAttachment = last ? getMessageAttachment(last) : null
      const lastMessage = last
        ? getMessageText(last) ||
          (lastAttachment ? `\u{1F4CE} ${lastAttachment.name}` : null)
        : null
      const lastReadAt = conversation.admin_last_read_at ?? conversation.created_at
      const unreadCount = conversationMessages.filter(
        (m) =>
          m.sender_type === 'customer' &&
          new Date(m.created_at).getTime() > new Date(lastReadAt).getTime()
      ).length

      return {
        ...conversation,
        lastMessage,
        lastMessageAt: last?.created_at ?? conversation.updated_at,
        unreadCount,
      }
    })
  }, [conversations, messages])

  const visibleConversations = useMemo(() => {
    let list = meta
    if (filter === 'open') list = list.filter((c) => c.status === 'open')
    if (filter === 'closed') list = list.filter((c) => c.status === 'closed')
    if (filter === 'unread') list = list.filter((c) => c.unreadCount > 0)

    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.customer_name.toLowerCase().includes(q) ||
          c.customer_email.toLowerCase().includes(q)
      )
    }
    return list
  }, [meta, filter, query])

  return {
    conversations: visibleConversations,
    allConversations: meta,
    selectedId,
    selectedConversation,
    selectedMessages,
    query,
    setQuery,
    filter,
    setFilter,
    sending,
    realtimeStatus: 'SUBSCRIBED',
    selectConversation,
    sendMessage,
    sendAttachment,
    setStatus,
  }
}

export type UseConversations = ReturnType<typeof useConversations>
