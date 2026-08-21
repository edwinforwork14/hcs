'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Message } from '../core/domain'
import { useCustomerService } from '../context'

export function useMessages(conversationId: string | null) {
  const { services, config } = useCustomerService()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const loadMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setLoading(true)
    try {
      const data = await services.message.getMessages(conversationId)
      setMessages(data)
    } catch {
      // Ignore
    } finally {
      setLoading(false)
    }
  }, [conversationId, services.message])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

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

  return { messages, loading, reload: loadMessages }
}
