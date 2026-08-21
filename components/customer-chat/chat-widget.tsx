'use client'

import { useState } from 'react'

import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useSupportOnline } from '@/hooks/use-support-presence'

import { ChatButton } from './chat-button'
import { ChatWindow } from './chat-window'

// Admin pages hide the widget via CSS (data-hide-chat attribute on body).
// This avoids importing next/navigation (usePathname), which triggers a
// layout-router casing bug on Windows + Next 16.
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const { online, ready } = useSupportOnline()

  if (!isSupabaseConfigured) return null

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
