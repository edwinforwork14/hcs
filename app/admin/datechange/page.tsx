import {
  DateChanger,
  AdminAuthScreen,
  getAdminAuth,
  type Conversation,
} from '@/lib/customer-service'
import { ConfigNotice } from '@/lib/customer-service/components/agent/auth-screens'
import { createSupabaseServiceRoleClient } from '@/lib/customer-service/adapters/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDateChangePage() {
  const auth = await getAdminAuth()
  if (auth.status !== 'ok') return <AdminAuthScreen auth={auth} />

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return <ConfigNotice />

  const service = createSupabaseServiceRoleClient(url, serviceRoleKey)

  const { data: conversations } = await service
    .from('conversations')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <DateChanger initialConversations={(conversations ?? []) as Conversation[]} />
  )
}
