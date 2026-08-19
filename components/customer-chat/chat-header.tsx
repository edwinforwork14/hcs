'use client'

import { Globe, LogOut, MessageCircle, RotateCcw, X } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  online: boolean
  presenceReady: boolean
  isClosed: boolean
  onClose: () => void
  onReset: () => void
  onLogout?: () => void
}

export function ChatHeader({
  online,
  presenceReady,
  isClosed,
  onClose,
  onReset,
  onLogout,
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
            <span
              className="relative flex shrink-0 items-center justify-center"
              style={{ width: 10, height: 10 }}
            >
              {presenceReady && online && (
                <span
                  className="absolute inline-flex animate-ping rounded-full opacity-60"
                  style={{ width: 10, height: 10, backgroundColor: '#4ade80' }}
                />
              )}
              <span
                className="relative inline-flex rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: !presenceReady
                    ? '#d1d5db'
                    : online
                      ? '#4ade80'
                      : '#ef4444',
                }}
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
        {onLogout && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            aria-label={t('auth.user.logout')}
            title={t('auth.user.logout')}
            className="cursor-pointer text-white hover:bg-white/20 hover:text-white"
          >
            <LogOut className="size-4" />
          </Button>
        )}
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
