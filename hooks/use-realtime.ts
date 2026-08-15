'use client'

import { useEffect, useState } from 'react'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/lib/supabase/client'

export type RealtimePayload = RealtimePostgresChangesPayload<Record<string, any>>

/**
 * Subscribes to `postgres_changes` on a table and returns the latest event
 * payload plus the channel connection status.
 *
 * @param table  Table to listen to (must be added to the `supabase_realtime` publication).
 * @param filter Optional Postgres filter, e.g. `conversation_id=eq.<uuid>`.
 * @param enabled Set to false to skip subscribing.
 */
export function useRealtime(
  table: 'conversations' | 'messages',
  filter?: string,
  enabled = true,
) {
  const [payload, setPayload] = useState<RealtimePayload | null>(null)
  const [status, setStatus] = useState<string>('CONNECTING')

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured) return

    const supabase = getSupabaseClient()
    // Unique channel per subscription to avoid collisions across mounts.
    const channelName = `realtime-${table}-${filter ?? 'all'}-${Math.random()
      .toString(36)
      .slice(2, 10)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        (event) => {
          setPayload(event as RealtimePayload)
        },
      )
      .subscribe((status) => setStatus(status))

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter, enabled])

  return { payload, status }
}
