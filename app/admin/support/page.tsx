import {
  AgentDashboard,
  AdminAuthScreen,
  getAdminAuth,
  getMessageAttachment,
  getMessageText,
  type Conversation,
  type Message,
} from '@/lib/customer-service'
import { ConfigNotice } from '@/lib/customer-service/components/agent/auth-screens'
import { createSupabaseServiceRoleClient } from '@/lib/customer-service/adapters/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminSupportPage() {
  const auth = await getAdminAuth()
  if (auth.status !== 'ok') return <AdminAuthScreen auth={auth} />

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return <ConfigNotice />

  const service = createSupabaseServiceRoleClient(url, serviceRoleKey)

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

  const allMessages = (messagesRes.data ?? []) as Message[]
  const byConversation = new Map<string, Message[]>()
  for (const message of allMessages) {
    const list = byConversation.get(message.conversation_id) ?? []
    list.push(message)
    byConversation.set(message.conversation_id, list)
  }

  const enriched: Conversation[] = (conversationsRes.data ?? []).map(
    (conversation) => {
      const conversationMessages =
        byConversation.get(conversation.id) ?? []
      const last = conversationMessages[conversationMessages.length - 1]
      const lastAttachment = last ? getMessageAttachment(last) : null
      const lastMessage = last
        ? getMessageText(last) ||
          (lastAttachment ? `📎 ${lastAttachment.name}` : null)
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
    <AgentDashboard
      initialConversations={enriched}
      initialMessages={allMessages}
      adminEmail={auth.email}
    />
  )
}