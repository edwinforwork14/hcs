'use client'

import { Globe, MessageCircle, RotateCcw, X } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ChatHeaderProps {
  online: boolean
  presenceReady: boolean
  isClosed: boolean
  onClose: () => void
  onReset: () => void
}

export function ChatHeader({
  online,
  presenceReady,
  isClosed,
  onClose,
  onReset,
}: ChatHeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#D90429] to-[#FF4D6A] px-4 py-3 text-white">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
          <MessageCircle className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">
            {t('chat.title')}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/85">
            {/* WhatsApp-style status dot: pulsing green when online, red when offline */}
            <span className="relative flex size-2.5 shrink-0 items-center justify-center">
              {presenceReady && online && (
                <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-green-400 opacity-60" />
              )}
              <span
                className={cn(
                  'relative inline-flex size-2.5 rounded-full',
                  !presenceReady
                    ? 'bg-gray-300'
                    : online
                      ? 'bg-green-400'
                      : 'bg-red-500',
                )}
              />
            </span>
            {t(online ? 'chat.online' : 'chat.offline')}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          aria-label={language === 'en' ? 'Español' : 'English'}
          title={language === 'en' ? 'Español' : 'English'}
          className="cursor-pointer text-white hover:bg-white/20 hover:text-white"
        >
          <Globe className="size-4" />
        </Button>
        {isClosed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onReset}
            aria-label={t('chat.newConversation')}
            title={t('chat.newConversation')}
            className="cursor-pointer text-white hover:bg-white/20 hover:text-white"
          >
            <RotateCcw className="size-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer text-white hover:bg-white/20 hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
