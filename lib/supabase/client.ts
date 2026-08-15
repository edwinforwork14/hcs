'use client'

import { createBrowserClient } from '@supabase/ssr'
import { createClient as createAnonClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/** Presence channel shared by the customer widget and the admin dashboard. */
export const SUPPORT_PRESENCE_CHANNEL = 'support-presence'

/**
 * The singleton lives on `globalThis` so that every copy of this module
 * (HMR, duplicate import paths) shares ONE GoTrueClient per storage key.
 * Otherwise Supabase logs "Multiple GoTrueClient instances detected" and
 * auth/realtime can misbehave.
 */
const GLOBAL_KEY = '__hcs_supabase_client__'
const GLOBAL_ANON_KEY = '__hcs_supabase_anon_client__'

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>
type AnonClient = ReturnType<typeof createAnonClient<Database>>

/**
 * Returns the singleton browser Supabase client (session-aware).
 * Used by the admin dashboard so it runs as the signed-in admin.
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }
  const g = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: BrowserClient
  }
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return g[GLOBAL_KEY]
}

/**
 * Returns a session-less browser client that always acts as the `anon` role.
 * Used by the customer widget so it never inherits an admin session (e.g. when
 * an admin is signed in on the same domain) — which RLS would otherwise reject.
 */
export function getAnonClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }
  const g = globalThis as typeof globalThis & {
    [GLOBAL_ANON_KEY]?: AnonClient
  }
  if (!g[GLOBAL_ANON_KEY]) {
    g[GLOBAL_ANON_KEY] = createAnonClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        // Distinct storage key so GoTrueClient does not flag this as a second
        // instance sharing the admin session's key (cosmetic warning only).
        storageKey: 'sb-anon-no-persist',
      },
    })
  }
  return g[GLOBAL_ANON_KEY]
}
