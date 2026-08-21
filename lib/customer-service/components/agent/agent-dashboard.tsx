'use client'

import { useConversations, useAdminPresence } from '../../hooks'
import type { Conversation, Message } from '../../core/domain'

import { ConversationsSidebar } from './conversations-sidebar'
import { ConversationView } from './conversation-view'
import { CustomerPanel } from './customer-panel'

interface AgentDashboardProps {
  initialConversations: Conversation[]
  initialMessages: Message[]
  adminEmail: string
}

export function AgentDashboard({
  initialConversations,
  initialMessages,
  adminEmail,
}: AgentDashboardProps) {
  const chat = useConversations(initialConversations, initialMessages)
  useAdminPresence(adminEmail)

  return (
    <div
      className="flex h-dvh overflow-hidden bg-background text-foreground"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <ConversationsSidebar chat={chat} />
      <ConversationView chat={chat} />
      <CustomerPanel chat={chat} />
    </div>
  )
}
