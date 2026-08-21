import { AdminSupport } from '@/components/admin-chat/admin-support'
import { AdminAuthScreen, ConfigNotice } from '@/components/admin-chat/auth-screens'
import { getAdminAuth } from '@/lib/admin-auth'
import { createServiceRoleClient } from '@/lib/supabase/server'
import {
  getMessageAttachment,
  getMessageText,
  type ConversationWithMeta,
  type Message,
} from '@/types/chat'

export const dynamic = 'force-dynamic'

export default async function AdminSupportPage() {
  const auth = await getAdminAuth()
  if (auth.status !== 'ok') return <AdminAuthScreen auth={auth} />

  const service = createServiceRoleClient()
  if (!service) return <ConfigNotice />

  const [conversationsRes, messagesRes] = await Promise.all([
    service
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false }),
    service
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true }),
  ])

  // Enrich conversations server-side so unread badges, last-message previews
  // and timestamps are part of the initial HTML (visible even before or
  // without client-side JavaScript, e.g. with a stale cached bundle).
  const allMessages = (messagesRes.data ?? []) as Message[]
  const byConversation = new Map<string, Message[]>()
  for (const message of allMessages) {
    const list = byConversation.get(message.conversation_id) ?? []
    list.push(message)
    byConversation.set(message.conversation_id, list)
  }

  const enriched: ConversationWithMeta[] = (conversationsRes.data ?? []).map(
    (conversation) => {
      const conversationMessages =
        byConversation.get(conversation.id) ?? []
      const last = conversationMessages[conversationMessages.length - 1]
      const lastAttachment = last ? getMessageAttachment(last) : null
      const lastMessage = last
        ? getMessageText(last) ||
          (lastAttachment ? `\u{1F4CE} ${lastAttachment.name}` : null)
        : null
      const lastReadAt =
        conversation.admin_last_read_at ?? conversation.created_at
      const unreadCount = conversationMessages.filter(
        (message) =>
          message.sender_type === 'customer' &&
          new Date(message.created_at).getTime() >
            new Date(lastReadAt).getTime(),
      ).length

      return {
        ...conversation,
        lastMessage,
        lastMessageAt: last?.created_at ?? conversation.updated_at,
        unreadCount,
      }
    },
  )

  return (
    <div className="admin-layout">
      <AdminSupport
        initialConversations={enriched}
        initialMessages={allMessages}
        adminEmail={auth.email}
      />
    </div>
  )
}
