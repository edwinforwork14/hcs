'use client'

import { Lock, LockOpen, MessageSquareText } from 'lucide-react'

import type { UseConversations } from '@/hooks/use-conversations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-context'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

import { MessageInput } from './message-input'
import { MessageList } from './message-list'

export function ConversationView({ chat }: { chat: UseConversations }) {
  const { t } = useLanguage()
  const { selectedConversation, selectedMessages, sendMessage, setStatus, sending } =
    chat

  if (!selectedConversation) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareText />
            </EmptyMedia>
            <EmptyTitle>{t('admin.noSelection')}</EmptyTitle>
            <EmptyDescription>
              {t('admin.chooseConversation')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    )
  }

  const isOpen = selectedConversation.status === 'open'

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {selectedConversation.customer_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              {selectedConversation.customer_name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {selectedConversation.customer_email}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={isOpen ? 'default' : 'secondary'}>
            {isOpen ? t('admin.badge.open') : t('admin.badge.closed')}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStatus(
                selectedConversation.id,
                isOpen ? 'closed' : 'open',
              )
            }
          >
            {isOpen ? (
              <>
                <Lock /> {t('admin.close')}
              </>
            ) : (
              <>
                <LockOpen /> {t('admin.reopen')}
              </>
            )}
          </Button>
        </div>
      </header>

      <MessageList messages={selectedMessages} />

      <MessageInput onSend={sendMessage} disabled={sending} />
    </main>
  )
}
