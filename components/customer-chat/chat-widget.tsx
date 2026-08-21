'use client'

import { useState, useEffect } from 'react'

import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useSupportOnline } from '@/hooks/use-support-presence'

import { ChatButton } from './chat-button'
import { ChatWindow } from './chat-window'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { online, ready } = useSupportOnline()
  const [isClient, setIsClient] = useState(false)
  const [isOnAdmin, setIsOnAdmin] = useState(false)

  // Only mount on client side to avoid hydration issues with usePathname.
  // Check admin route via window.location (avoids import of next/navigation
  // which triggers a layout-router casing bug on Windows + Next 16).
  useEffect(() => {
    setIsClient(true)
    setIsOnAdmin(window.location.pathname.startsWith('/admin'))
  }, [])

  if (!isClient || !isSupabaseConfigured || isOnAdmin) return null

  return (
    <>
      <ChatButton
        open={open}
        onToggle={() => setOpen((v) => !v)}
        online={online}
        presenceReady={ready}
      />
      {open && (
        <ChatWindow
          onClose={() => setOpen(false)}
          online={online}
          presenceReady={ready}
        />
      )}
    </>
  )
}
