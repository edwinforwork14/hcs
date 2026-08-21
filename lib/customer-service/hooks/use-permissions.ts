'use client'

import { useCallback } from 'react'
import { useCustomerService } from '../context'

export function usePermissions() {
  const { config } = useCustomerService()

  const isAdmin = useCallback(
    async (email: string) => {
      return config.providers.permission.isAdmin(email)
    },
    [config.providers.permission]
  )

  const isAgent = useCallback(
    async (email: string) => {
      return config.providers.permission.isAgent(email)
    },
    [config.providers.permission]
  )

  const canViewConversation = useCallback(
    async (agentEmail: string, conversationId: string) => {
      return config.providers.permission.canViewConversation(agentEmail, conversationId)
    },
    [config.providers.permission]
  )

  const canSendMessage = useCallback(
    async (agentEmail: string, conversationId: string) => {
      return config.providers.permission.canSendMessage(agentEmail, conversationId)
    },
    [config.providers.permission]
  )

  const canCloseConversation = useCallback(
    async (agentEmail: string, conversationId: string) => {
      return config.providers.permission.canCloseConversation(agentEmail, conversationId)
    },
    [config.providers.permission]
  )

  return { isAdmin, isAgent, canViewConversation, canSendMessage, canCloseConversation }
}
