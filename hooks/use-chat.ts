'use client'

import { useCallback, useEffect, useState } from 'react'

import { apiPost } from '@/lib/api'
import {
  getAnonClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client'
import { MessageSchema, type StartConversationInput } from '@/lib/validations/chat'
import type {
  ChatSession,
  Conversation,
  Message,
  StartChatPayload,
  StartChatResult,
} from '@/types/chat'

import { useRealtime } from './use-realtime'

const STORAGE_KEY = 'hcs-chat-session'

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

/** Best-effort location derived from the visitor's IANA timezone. */
function getCustomerLocation(): string | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timeZone || null
  } catch {
    return null
  }
}

export function useChat() {
  const [session, setSession] = useState<ChatSession | null>(() => loadSession())
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [sending, setSending] = useState(false)

  const conversationId = session?.conversationId

  // Load conversation + message history when a session exists.
  useEffect(() => {
    if (!conversationId || !isSupabaseConfigured) {
      setConversation(null)
      setMessages([])
      return
    }

    let cancelled = false
    const supabase = getAnonClient()
    setLoadingHistory(true)

    Promise.all([
      supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .maybeSingle(),
      supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true }),
    ])
      .then(([convRes, msgRes]) => {
        if (cancelled) return
        if (!convRes.data) {
          // Conversation no longer exists — start fresh.
          window.localStorage.removeItem(STORAGE_KEY)
          setSession(null)
          return
        }
        setConversation(convRes.data)
        setMessages(msgRes.data ?? [])
      })
      .catch(() => {
        // Keep the session; the widget can still retry on next open.
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false)
      })

    return () => {
      cancelled = true
    }
  }, [conversationId])

  // Realtime: new messages for this conversation.
  const messagePayload = useRealtime(
    'messages',
    conversationId ? `conversation_id=eq.${conversationId}` : undefined,
    Boolean(conversationId),
  )
  useEffect(() => {
    const payload = messagePayload.payload
    if (!payload || payload.eventType === 'DELETE') return
    const message = payload.new as unknown as Message | undefined
    if (!message?.id) return
    setMessages((prev) => upsertMessage(prev, message))
  }, [messagePayload.payload])

  // Realtime: conversation updates (e.g. status -> closed).
  const conversationPayload = useRealtime(
    'conversations',
    conversationId ? `id=eq.${conversationId}` : undefined,
    Boolean(conversationId),
  )
  useEffect(() => {
    const payload = conversationPayload.payload
    if (!payload || payload.eventType === 'DELETE') return
    const updated = payload.new as unknown as Conversation | undefined
    if (!updated?.id) return
    setConversation((prev) => (prev && prev.id === updated.id ? updated : prev))
  }, [conversationPayload.payload])

  const startConversation = useCallback(
    async (input: StartConversationInput, language?: string) => {
      if (!isSupabaseConfigured) throw new Error('Chat is not configured')

      // The server creates the conversation and inserts the automatic
      // welcome message from the administration (anon clients cannot write
      // messages as `admin` due to RLS).
      const payload: StartChatPayload = {
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone || undefined,
        customerLocation: getCustomerLocation() ?? undefined,
        language: language === 'es' ? 'es' : 'en',
      }
      const response = await apiPost<StartChatResult, StartChatPayload>(
        '/api/chat/start',
        payload,
      )
      const { conversation, welcomeMessage } = response.data ?? {}
      if (!conversation) {
        throw new Error('Could not start the conversation')
      }

      const nextSession: ChatSession = {
        conversationId: conversation.id,
        customerName: conversation.customer_name,
        customerEmail: conversation.customer_email,
        customerPhone: conversation.customer_phone ?? undefined,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
      setSession(nextSession)
      setConversation(conversation)
      if (welcomeMessage) {
        setMessages([welcomeMessage])
      }
    },
    [],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const parsed = MessageSchema.safeParse({ content })
      if (!parsed.success || !session) return
      setSending(true)
      try {
        const supabase = getAnonClient()
        const { data, error } = await supabase
          .from('messages')
          .insert({
            conversation_id: session.conversationId,
            sender_type: 'customer',
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
    [session],
  )

  const resetConversation = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    setSession(null)
    setConversation(null)
    setMessages([])
  }, [])

  return {
    session,
    conversation,
    messages,
    loadingHistory,
    sending,
    isClosed: conversation?.status === 'closed',
    startConversation,
    sendMessage,
    resetConversation,
  }
}
