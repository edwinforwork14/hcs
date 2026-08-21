import { DateChanger } from '@/components/admin-chat/date-changer'
import {
  AdminAuthScreen,
  ConfigNotice,
} from '@/components/admin-chat/auth-screens'
import { getAdminAuth } from '@/lib/admin-auth'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Conversation } from '@/types/chat'

export const dynamic = 'force-dynamic'

export default async function AdminDateChangePage() {
  const auth = await getAdminAuth()
  if (auth.status !== 'ok') return <AdminAuthScreen auth={auth} />

  const service = createServiceRoleClient()
  if (!service) return <ConfigNotice />

  const { data: conversations } = await service
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="admin-layout">
      <DateChanger initialConversations={(conversations ?? []) as Conversation[]} />
    </div>
  )
}
