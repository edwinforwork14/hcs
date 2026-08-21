'use client'

import { useCallback } from 'react'
import { useCustomerService } from '../context'

export function useNotifications() {
  const { config } = useCustomerService()

  const notifyNewMessage = useCallback(
    async (conversationId: string, messageText: string) => {
      if (config.providers.notification) {
        await config.providers.notification.notifyNewMessage(conversationId, messageText)
      }
    },
    [config.providers.notification]
  )

  const notifyNewConversation = useCallback(
    async (conversationId: string, customerName: string) => {
      if (config.providers.notification) {
        await config.providers.notification.notifyNewConversation(conversationId, customerName)
      }
    },
    [config.providers.notification]
  )

  return { notifyNewMessage, notifyNewConversation }
}
