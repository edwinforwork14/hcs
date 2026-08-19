'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@/context/language-context'
import { useChat } from '@/hooks/use-chat'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui/spinner'

import { ChatHeader } from './chat-header'
import { ChatStartForm } from './chat-start-form'
import { MessageInput } from './message-input'
import { MessageList } from './message-list'

interface ChatWindowProps {
  onClose: () => void
  online: boolean
  presenceReady: boolean
}

export function ChatWindow({ onClose, online, presenceReady }: ChatWindowProps) {
  const { language, t } = useLanguage()
  const chat = useChat()
  const { profile, logout, loading: authLoading } = useAuth()
  const [startError, setStartError] = useState<string | null>(null)

  // Clear stale chat session from localStorage when user is not logged in.
  // This prevents being stuck in an old conversation without auth.
  // Only run after auth has fully initialized (authLoading === false) to avoid
  // clearing a valid session during the initial mount race condition.
  useEffect(() => {
    if (authLoading) return
    if (!profile && chat.session) {
      chat.resetConversation()
    }
  }, [profile, chat.session, chat, authLoading])

  const handleStart = useCallback(
    async (input: {
      customerName: string
      customerEmail: string
      customerPhone?: string
    }) => {
      setStartError(null)
      try {
        await chat.startConversation(input, language)
      } catch (err) {
        setStartError(
          err instanceof Error ? err.message : 'Could not start the conversation',
        )
      }
    },
    [chat, language],
  )

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      <ChatHeader
        online={online}
        presenceReady={presenceReady}
        isClosed={chat.isClosed}
        onClose={onClose}
        onReset={chat.resetConversation}
        onLogout={
          profile
            ? () => {
                chat.resetConversation()
                logout()
                onClose()
              }
            : undefined
        }
      />

      {startError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
          <p className="text-sm text-destructive">{startError}</p>
          <button
            onClick={() => {
              setStartError(null)
              chat.resetConversation()
            }}
            className="text-sm text-primary underline"
          >
            Try again
          </button>
        </div>
      ) : !chat.session ? (
        <ChatStartForm onStart={handleStart} />
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
