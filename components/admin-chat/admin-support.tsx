'use client'

import { useConversations } from '@/hooks/use-conversations'
import { useAdminPresence } from '@/hooks/use-support-presence'
import type { ConversationWithMeta, Message } from '@/types/chat'

import { ConversationsSidebar } from './conversations-sidebar'
import { ConversationView } from './conversation-view'
import { CustomerPanel } from './customer-panel'

interface AdminSupportProps {
  initialConversations: ConversationWithMeta[]
  initialMessages: Message[]
  adminEmail: string
}

export function AdminSupport({
  initialConversations,
  initialMessages,
  adminEmail,
}: AdminSupportProps) {
  const chat = useConversations(initialConversations, initialMessages)
  useAdminPresence(adminEmail)

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <ConversationsSidebar chat={chat} />
      <ConversationView chat={chat} />
      <CustomerPanel chat={chat} />
    </div>
  )
}
