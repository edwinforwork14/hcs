'use client'

import { MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-context'
import { cn } from '@/lib/utils'

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
  const { t } = useLanguage()
  return (
    <Button
      type="button"
      onClick={onToggle}
      aria-label={open ? t('chat.closeChat') : t('chat.openChat')}
      className="fixed bottom-6 right-6 z-50 size-14 cursor-pointer rounded-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] shadow-lg shadow-red-900/30 transition-all hover:scale-105 hover:from-[#B80324] hover:to-[#D90429] active:scale-95"
    >
      {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}

      {/* WhatsApp-style status dot */}
      <span
        className={cn(
          'absolute right-1.5 top-1.5 flex size-3 items-center justify-center rounded-full border-2 border-white dark:border-zinc-900',
          !presenceReady
            ? 'bg-gray-400'
            : online
              ? 'bg-green-500'
              : 'bg-red-500',
        )}
      />
    </Button>
  )
}
