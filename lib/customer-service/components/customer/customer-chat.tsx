'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

import { useCustomerService } from '../../context'
import { useSupportOnline } from '../../hooks'

import { ChatButton } from './chat-button'
import { ChatWindow } from './chat-window'

export function CustomerChat() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { config } = useCustomerService()
  const { online, ready } = useSupportOnline()

  if (!config) return null
  if (pathname?.startsWith(config.adminRoute || '/admin')) return null

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
