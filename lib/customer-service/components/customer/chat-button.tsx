'use client'

import { MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCustomerService } from '../../context'

interface ChatButtonProps {
  open: boolean
  onToggle: () => void
  online: boolean
  presenceReady: boolean
}

export function ChatButton({
  open,
  onToggle,
  online,
  presenceReady,
}: ChatButtonProps) {
  const { t } = useCustomerService()
  return (
    <Button
      type="button"
      onClick={onToggle}
      aria-label={open ? t('chat.closeChat') : t('chat.openChat')}
      style={{
        background: 'linear-gradient(to right, var(--cs-primary, #D90429), var(--cs-secondary, #FF4D6A))',
      }}
      className="fixed bottom-6 right-6 z-50 size-14 cursor-pointer rounded-full shadow-lg shadow-red-900/30 transition-all hover:scale-105 hover:opacity-90 active:scale-95 border-0"
    >
      {open ? <X className="size-6 text-white" /> : <MessageCircle className="size-6 text-white" />}

      {/* WhatsApp-style status dot */}
      <span
        className="absolute right-1.5 top-1.5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900"
        style={{
          width: 12,
          height: 12,
          backgroundColor: !presenceReady
            ? '#9ca3af'
            : online
              ? '#22c55e'
              : '#dc2626',
        }}
      />
    </Button>
  )
}
