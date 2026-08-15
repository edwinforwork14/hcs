import {
  createServerSupabaseClient,
  createServiceRoleClient,
  isServerSupabaseConfigured,
} from './supabase/server'

export type AdminAuthResult =
  | { status: 'not-configured' }
  | { status: 'not-authenticated' }
  | { status: 'not-admin'; email: string }
  | { status: 'ok'; email: string }

/**
 * Shared server-side check used by admin pages and API routes: verifies that
 * Supabase is configured, that the request has an authenticated session and
 * that the signed-in email exists in the `admins` table.
 */
export async function getAdminAuth(): Promise<AdminAuthResult> {
  if (!isServerSupabaseConfigured) return { status: 'not-configured' }

  const supabase = await createServerSupabaseClient()
  if (!supabase) return { status: 'not-configured' }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { status: 'not-authenticated' }

  const service = createServiceRoleClient()
  if (!service) return { status: 'not-configured' }

  const { data: admin } = await service
    .from('admins')
    .select('id')
    .eq('email', user.email.toLowerCase())
    .maybeSingle()
  if (!admin) return { status: 'not-admin', email: user.email }

  return { status: 'ok', email: user.email }
}
