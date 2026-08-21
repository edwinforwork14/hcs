import { createBrowserClient } from '@supabase/ssr'
import { createClient as createAnonClient } from '@supabase/supabase-js'
import type { Database } from './types'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null
let anonClient: ReturnType<typeof createAnonClient<Database>> | null = null

export function getSupabaseBrowserClient(url: string, anonKey: string) {
  if (typeof window === 'undefined') {
    return createBrowserClient<Database>(url, anonKey)
  }
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(url, anonKey)
  }
  return browserClient
}

export function getSupabaseAnonClient(url: string, anonKey: string) {
  if (typeof window === 'undefined') {
    return createAnonClient<Database>(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'sb-anon-no-persist',
      },
    })
  }
  if (!anonClient) {
    anonClient = createAnonClient<Database>(url, anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'sb-anon-no-persist',
      },
    })
  }
  return anonClient
}
