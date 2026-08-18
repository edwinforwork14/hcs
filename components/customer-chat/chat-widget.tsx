'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useSupportOnline } from '@/hooks/use-support-presence'

import { ChatButton } from './chat-button'
import { ChatWindow } from './chat-window'

export function ChatWidget() {
  // Hidden temporarily for server deploy
  return null

  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { online, ready } = useSupportOnline()

  // Not configured yet, or we are on an admin route.
  if (!isSupabaseConfigured) return null
  if (pathname?.startsWith('/admin')) return null

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
