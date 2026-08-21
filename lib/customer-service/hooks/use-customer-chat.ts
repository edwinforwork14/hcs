'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ChatSession, Conversation, Message } from '../core/domain'
import { useCustomerService } from '../context'

export function useCustomerChat() {
  const { config, anonServices } = useCustomerService()
  const STORAGE_KEY = config.storageKey || 'hcs-chat-session'

  function loadSession(): ChatSession | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as ChatSession
      if (!parsed.conversationId || !parsed.customerName || !parsed.customerEmail) {
        return null
      }
      return parsed
    } catch {
      return null
    }
  }

  const [session, setSession] = useState<ChatSession | null>(() => loadSession())
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)

  const conversationId = session?.conversationId

  useEffect(() => {
    if (!conversationId) {
      setConversation(null)
      setMessages([])
      return
    }

    let cancelled = false
    setLoadingHistory(true)

    Promise.all([
      anonServices.conversation.getConversation(conversationId),
      anonServices.message.getMessages(conversationId),
    ])
      .then(([conv, msgs]) => {
        if (cancelled) return
        if (!conv) {
          window.localStorage.removeItem(STORAGE_KEY)
          setSession(null)
          return
        }
        setConversation(conv)
        setMessages(msgs)
      })
      .catch(() => {
        // Keep session
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false)
      })

    return () => {
      cancelled = true
    }
  }, [conversationId, anonServices.conversation, anonServices.message, STORAGE_KEY])

  useEffect(() => {
    if (!conversationId) return

    const unsubscribe = config.providers.realtime.subscribe(
      'messages',
      `conversation_id=eq.${conversationId}`,
      (event) => {
        if (event.eventType === 'DELETE') return
        const message = event.new as unknown as Message
        if (!message?.id) return
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === message.id)
          if (index === -1) {
            return [...prev, message].sort((a, b) => a.created_at.localeCompare(b.created_at))
          }
          const next = [...prev]
          next[index] = message
          return next
        })
      }
    )

    return () => {
      unsubscribe()
    }
  }, [conversationId, config.providers.realtime])

  useEffect(() => {
    if (!conversationId) return

    const unsubscribe = config.providers.realtime.subscribe(
      'conversations',
      `id=eq.${conversationId}`,
      (event) => {
        if (event.eventType === 'DELETE') return
        const updated = event.new as unknown as Conversation
        if (!updated?.id) return
        setConversation((prev) => (prev && prev.id === updated.id ? updated : prev))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [conversationId, config.providers.realtime])

  const startConversation = useCallback(
    async (input: { customerName: string; customerEmail: string; customerPhone?: string }, language?: string) => {
      const { conversation: conv, welcomeMessage } = await anonServices.chat.startConversation({
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        language,
      })

      const nextSession: ChatSession = {
        conversationId: conv.id,
        customerName: conv.customer_name,
        customerEmail: conv.customer_email,
        customerPhone: conv.customer_phone || undefined,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
      setSession(nextSession)
      setConversation(conv)

      const msgs = await anonServices.message.getMessages(conv.id)
      setMessages(msgs)
    },
    [anonServices.chat, anonServices.message, STORAGE_KEY]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!session) return
      setSending(true)
      try {
        const msg = await anonServices.chat.sendCustomerMessage(session.conversationId, content)
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === msg.id)
          if (index === -1) {
            return [...prev, msg].sort((a, b) => a.created_at.localeCompare(b.created_at))
          }
          const next = [...prev]
          next[index] = msg
          return next
        })
      } finally {
        setSending(false)
      }
    },
    [session, anonServices.chat]
  )

  const sendAttachment = useCallback(
    async (file: File, content: string = '') => {
      if (!session) return
      setSending(true)
      try {
        const msg = await anonServices.chat.sendCustomerAttachment(
          session.conversationId,
          { name: file.name, size: file.size, type: file.type, data: file },
          content
        )
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === msg.id)
          if (index === -1) {
            return [...prev, msg].sort((a, b) => a.created_at.localeCompare(b.created_at))
          }
          const next = [...prev]
          next[index] = msg
          return next
        })
      } finally {
        setSending(false)
      }
    },
    [session, anonServices.chat]
  )

  const resetConversation = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setSession(null)
    setConversation(null)
    setMessages([])
  }, [STORAGE_KEY])

  return {
    session,
    conversation,
    messages,
    loadingHistory,
    sending,
    isClosed: conversation?.status === 'closed',
    startConversation,
    sendMessage,
    sendAttachment,
    resetConversation,
  }
}
