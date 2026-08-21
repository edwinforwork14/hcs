'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { apiPost } from '@/lib/api'
import {
  isAllowedAttachmentType,
  MAX_ATTACHMENT_SIZE,
} from '@/lib/attachments'
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client'
import { MessageSchema } from '@/lib/validations/chat'
import { getMessageAttachment, getMessageText } from '@/types/chat'
import type {
  Conversation,
  ConversationFilter,
  ConversationStatus,
  ConversationWithMeta,
  CreateMessagePayload,
  CreateMessageResult,
  Message,
  UploadPayload,
  UploadResult,
} from '@/types/chat'
import { useRealtime } from '@/hooks/use-realtime'

function upsertMessage(list: Message[], message: Message): Message[] {
  const index = list.findIndex((m) => m.id === message.id)
  if (index === -1) {
    return [...list, message].sort((a, b) =>
      a.created_at.localeCompare(b.created_at),
    )
  }
  const next = [...list]
  next[index] = message
  return next
}

function upsertConversation(
  list: Conversation[],
  conversation: Conversation,
): Conversation[] {
  const index = list.findIndex((c) => c.id === conversation.id)
  if (index === -1) return [conversation, ...list]
  const next = [...list]
  next[index] = conversation
  return next
}

export function useConversations(
  initialConversations: Conversation[],
  initialMessages: Message[],
) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ConversationFilter>('all')
  const [sending, setSending] = useState(false)

  const selectedIdRef = useRef(selectedId)
  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  // The conversation open on first load is already being read by the admin:
  // persist that in the database so the read state survives a reload.
  const markRead = useCallback(async (conversationId: string) => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('conversations')
      .update({ admin_last_read_at: new Date().toISOString() })
      .eq('id', conversationId)
      .select()
      .single()
    if (!error && data) {
      setConversations((prev) => upsertConversation(prev, data))
    }
  }, [])

  useEffect(() => {
    if (selectedId) markRead(selectedId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Realtime: new/updated messages.
  const messagePayload = useRealtime('messages', undefined, true)
  useEffect(() => {
    const payload = messagePayload.payload
    if (!payload || payload.eventType === 'DELETE') return
    const message = payload.new as unknown as Message | undefined
    if (!message?.id) return

    setMessages((prev) => upsertMessage(prev, message))

    // Mark as read when a customer message arrives in the open conversation.
    if (
      message.sender_type === 'customer' &&
      message.conversation_id === selectedIdRef.current
    ) {
      markRead(message.conversation_id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagePayload.payload])

  // Realtime: new/updated conversations (status changes, read markers).
  const conversationPayload = useRealtime('conversations', undefined, true)
  useEffect(() => {
    const payload = conversationPayload.payload
    if (!payload || payload.eventType === 'DELETE') return
    const updated = payload.new as unknown as Conversation | undefined
    if (!updated?.id) return
    setConversations((prev) => upsertConversation(prev, updated))
  }, [conversationPayload.payload])

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setSelectedId(conversationId)
      markRead(conversationId)

      // Load messages if this conversation arrived after the initial fetch.
      if (isSupabaseConfigured) {
        const supabase = getSupabaseClient()
        const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
        if (data?.length) {
          setMessages((prev) => {
            const next = [...prev]
            for (const message of data) {
              if (!next.some((m) => m.id === message.id)) next.push(message)
            }
            return next.sort((a, b) =>
              a.created_at.localeCompare(b.created_at),
            )
          })
        }
      }
    },
    [markRead],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const parsed = MessageSchema.safeParse({ content })
      const conversationId = selectedIdRef.current
      if (!parsed.success || !conversationId) return
      setSending(true)
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_type: 'admin',
            content: parsed.data.content,
          })
          .select()
          .single()
        if (error) throw error
        setMessages((prev) => upsertMessage(prev, data))
      } finally {
        setSending(false)
      }
    },
    [],
  )

  /** Upload a file and send it (optionally with text) as an admin message. */
  const sendAttachment = useCallback(
    async (file: File, content = '') => {
      const conversationId = selectedIdRef.current
      if (!conversationId) return
      if (file.size > MAX_ATTACHMENT_SIZE) {
        throw new Error('File too large')
      }
      if (!isAllowedAttachmentType(file.type)) {
        throw new Error('File type not allowed')
      }
      setSending(true)
      try {
        const uploadRes = await apiPost<UploadResult, UploadPayload>(
          '/api/chat/upload',
          {
            conversationId,
            fileName: file.name,
            fileType: file.type || 'application/octet-stream',
            fileSize: file.size,
          },
        )
        const upload = uploadRes.data
        if (!upload?.uploadUrl) throw new Error('Could not prepare upload')

        const put = await fetch(upload.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file,
        })
        if (!put.ok) throw new Error('Upload failed')

        const messageRes = await apiPost<
          CreateMessageResult,
          CreateMessagePayload
        >('/api/chat/message', {
          conversationId,
          senderType: 'admin',
          content: content.trim(),
          attachment: {
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            path: upload.path,
          },
        })
        const message = messageRes.data?.message
        if (!message) throw new Error('Could not send message')
        setMessages((prev) => upsertMessage(prev, message))
      } finally {
        setSending(false)
      }
    },
    [],
  )

  const setStatus = useCallback(
    async (conversationId: string, status: ConversationStatus) => {
      if (!isSupabaseConfigured) return
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId)
        .select()
        .single()
      if (!error && data) {
        setConversations((prev) => upsertConversation(prev, data))
      }
    },
    [],
  )

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) ?? null,
    [conversations, selectedId],
  )

  const selectedMessages = useMemo(
    () =>
      messages
        .filter((m) => m.conversation_id === selectedId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [messages, selectedId],
  )

  // Enrich conversations with last message + unread count for the sidebar.
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
      // Attachment-only messages show a paperclip preview instead of an empty cell.
      const lastAttachment = last ? getMessageAttachment(last) : null
      const lastMessage = last
        ? getMessageText(last) ||
          (lastAttachment ? `\u{1F4CE} ${lastAttachment.name}` : null)
        : null
      const lastReadAt = conversation.admin_last_read_at ?? conversation.created_at
      const unreadCount = conversationMessages.filter(
        (m) =>
          m.sender_type === 'customer' &&
          new Date(m.created_at).getTime() > new Date(lastReadAt).getTime(),
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
          c.customer_email.toLowerCase().includes(q),
      )
    }
    return list
  }, [meta, filter, query])

  const realtimeStatus = conversationPayload.status

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
    realtimeStatus,
    selectConversation,
    sendMessage,
    sendAttachment,
    setStatus,
  }
}

export type UseConversations = ReturnType<typeof useConversations>
