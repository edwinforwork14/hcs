'use client'

import { createBrowserClient } from '@supabase/ssr'
import { createClient as createAnonClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/** Presence channel shared by the customer widget and the admin dashboard. */
export const SUPPORT_PRESENCE_CHANNEL = 'support-presence'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

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
  if (!client) {
    client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return client
}

let anonClient: ReturnType<typeof createAnonClient<Database>> | null = null

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
  if (!anonClient) {
    anonClient = createAnonClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return anonClient
}
