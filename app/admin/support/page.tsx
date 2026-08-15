import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { AdminSupport } from '@/components/admin-chat/admin-support'
import { LoginForm } from '@/components/admin-chat/login-form'
import { SignOutButton } from '@/components/admin-chat/sign-out-button'
import { Button } from '@/components/ui/button'
import {
  createServerSupabaseClient,
  createServiceRoleClient,
  isServerSupabaseConfigured,
} from '@/lib/supabase/server'
import {
  getMessageAttachment,
  getMessageText,
  type ConversationWithMeta,
  type Message,
} from '@/types/chat'

export const dynamic = 'force-dynamic'

function ConfigNotice() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-lg font-semibold">Support Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Supabase is not configured. Set{' '}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment, then run
          the migration in <code>supabase/schema.sql</code>.
        </p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </Button>
      </div>
    </div>
  )
}

function AccessDenied({ email }: { email: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-lg font-semibold">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Your account (<strong>{email}</strong>) is not authorized to use the
          support dashboard. Ask a project admin to add your email to the{' '}
          <code>admins</code> table.
        </p>
        <div className="flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to site
            </Link>
          </Button>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

export default async function AdminSupportPage() {
  if (!isServerSupabaseConfigured) return <ConfigNotice />

  const supabase = await createServerSupabaseClient()
  if (!supabase) return <ConfigNotice />

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return <LoginForm />

  const service = createServiceRoleClient()
  if (!service) return <ConfigNotice />

  // Only users whose email exists in the admins table can access the dashboard.
  const { data: admin } = await service
    .from('admins')
    .select('id, name')
    .eq('email', user.email.toLowerCase())
    .maybeSingle()

  if (!admin) return <AccessDenied email={user.email} />

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
    <AdminSupport
      initialConversations={enriched}
      initialMessages={allMessages}
      adminEmail={user.email}
    />
  )
}
