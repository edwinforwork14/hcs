import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '../adapters/supabase/server'
export type AdminAuthResult =
  | { status: 'not-configured' }
  | { status: 'not-authenticated' }
  | { status: 'not-admin'; email: string }
  | { status: 'ok'; email: string }

export async function getAdminAuth(): Promise<AdminAuthResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey || !serviceRoleKey) {
    return { status: 'not-configured' }
  }

  try {
    const supabase = await createSupabaseServerClient(url, anonKey)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return { status: 'not-authenticated' }
    }

    const service = createSupabaseServiceRoleClient(url, serviceRoleKey)
    const { data: admin } = await service
      .from('admins')
      .select('id')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()

    if (!admin) {
      return { status: 'not-admin', email: user.email }
    }

    return { status: 'ok', email: user.email }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return { status: 'not-authenticated' }
  }
}
