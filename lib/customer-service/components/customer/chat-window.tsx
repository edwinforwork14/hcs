'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useLanguage } from '@/context/language-context'
import { useCustomerChat } from '../../hooks'
import { useAuth } from '../../hooks'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { ChatHeader } from './chat-header'
import { ChatAuth } from './chat-auth'
import { MessageInput } from './message-input'
import { MessageList } from './message-list'

interface ChatWindowProps {
  onClose: () => void
  online: boolean
  presenceReady: boolean
}

export function ChatWindow({ onClose, online, presenceReady }: ChatWindowProps) {
  const { language, t } = useLanguage()
  const chat = useCustomerChat()
  const auth = useAuth()
  // Stable reference: `useCustomerChat` wraps this in `useCallback([])`.
  const { startConversation: startChatConversation } = chat
  const [startFailed, setStartFailed] = useState(false)
  const startedRef = useRef(false)

  const startConversation = useCallback(async () => {
    if (!auth.user) return
    setStartFailed(false)
    try {
      await startChatConversation(
        {
          customerName: auth.user.name || 'Customer',
          customerEmail: auth.user.email,
          customerPhone: auth.user.phone,
        },
        language,
      )
    } catch {
      setStartFailed(true)
      toast.error(t('chat.startError'))
    }
  }, [auth.user, startChatConversation, language, t])

  // Once authenticated, start the conversation automatically using the
  // account's data (the old separate data-entry panel was removed).
  useEffect(() => {
    if (!auth.user) {
      startedRef.current = false
      return
    }
    if (chat.session) return
    if (startedRef.current) return
    startedRef.current = true
    void startConversation()
  }, [auth.user, chat.session, startConversation])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      chat.resetConversation()
    } catch {
      // Ignore sign-out failures.
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      <ChatHeader
        online={online}
        presenceReady={presenceReady}
        isClosed={chat.isClosed}
        onClose={onClose}
        onReset={chat.resetConversation}
        onSignOut={auth.user ? handleSignOut : undefined}
      />

      {auth.status === 'loading' ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : !auth.user ? (
        <ChatAuth
          signIn={auth.signIn}
          signUp={auth.signUp}
          resendConfirmation={auth.resendConfirmation}
        />
      ) : !chat.session ? (
        startFailed ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
            <p className="text-center text-sm text-muted-foreground">
              {t('chat.startError')}
            </p>
            <Button
              type="button"
              onClick={startConversation}
              className="w-full cursor-pointer bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429]"
            >
              {t('chat.retry')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        )
      ) : chat.loadingHistory ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <MessageList messages={chat.messages} />
          {chat.isClosed && (
            <p className="border-t bg-muted/50 px-4 py-2 text-center text-xs text-muted-foreground">
              {t('chat.closedNote')}
            </p>
          )}
          <MessageInput
            onSend={chat.sendMessage}
            onSendAttachment={chat.sendAttachment}
            disabled={chat.isClosed || chat.sending}
          />
        </>
      )}
    </div>
  )
}
