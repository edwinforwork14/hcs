'use client'

import { useLanguage } from '@/context/language-context'
import { useChat } from '@/hooks/use-chat'
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

  return (
    <div className="fixed bottom-24 right-6 z-50 flex h-[520px] max-h-[calc(100vh-8rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      <ChatHeader
        online={online}
        presenceReady={presenceReady}
        isClosed={chat.isClosed}
        onClose={onClose}
        onReset={chat.resetConversation}
      />

      {!chat.session ? (
        <ChatStartForm
          onStart={(input) => chat.startConversation(input, language)}
        />
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
            disabled={chat.isClosed || chat.sending}
          />
        </>
      )}
    </div>
  )
}
