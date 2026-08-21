'use client'

import { useEffect, useState } from 'react'
import { useCustomerService } from '../context'

export function useSupportOnline() {
  const { services, config } = useCustomerService()
  const [online, setOnline] = useState(false)
  const [ready, setReady] = useState(false)

  const presenceChannel = config.presenceChannel || 'support-presence'

  useEffect(() => {
    const unsubscribe = services.presence.subscribe(presenceChannel, (isOnline) => {
      setOnline(isOnline)
      setReady(true)
    })

    return () => {
      unsubscribe()
    }
  }, [services.presence, presenceChannel])

  return { online, ready }
}

export function useAdminPresence(adminEmail: string) {
  const { services, config } = useCustomerService()
  const presenceChannel = config.presenceChannel || 'support-presence'

  useEffect(() => {
    if (!adminEmail) return

    let tracked = false
    services.presence.trackAgent(presenceChannel, adminEmail)
      .then(() => {
        tracked = true
      })
      .catch(() => {
        // Ignore
      })

    return () => {
      if (tracked) {
        services.presence.untrackAgent(presenceChannel).catch(() => {})
      }
    }
  }, [services.presence, presenceChannel, adminEmail])
}
