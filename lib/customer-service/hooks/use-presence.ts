'use client'

import { useEffect, useState } from 'react'

import {
  getAnonClient,
  getSupabaseClient,
  isSupabaseConfigured,
  SUPPORT_PRESENCE_CHANNEL,
} from '@/lib/supabase/client'

/**
 * Customer side: subscribes to the shared presence channel and reports
 * whether at least one admin is currently viewing the support dashboard.
 */
export function useSupportOnline() {
  const [online, setOnline] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    // Session-less client: presence must reflect admins, never the visitor.
    const supabase = getAnonClient()
    const channel = supabase.channel(SUPPORT_PRESENCE_CHANNEL)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnline(Object.keys(state).length > 0)
        setReady(true)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { online, ready }
}

/**
 * Admin side: tracks presence while the dashboard is mounted so customers see
 * the agent as online. Untracks on unmount.
 */
export function useAdminPresence(adminEmail: string) {
  useEffect(() => {
    if (!isSupabaseConfigured || !adminEmail) return

    const supabase = getSupabaseClient()
    const channel = supabase.channel(SUPPORT_PRESENCE_CHANNEL)

    let tracked = false
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && !tracked) {
        tracked = true
        await channel.track({ email: adminEmail })
      }
    })

    return () => {
      if (tracked) channel.untrack()
      supabase.removeChannel(channel)
    }
  }, [adminEmail])
}
