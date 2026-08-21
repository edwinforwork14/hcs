'use client'

import { Lock, LockOpen, MessageSquareText } from 'lucide-react'

import type { UseConversations } from '../../hooks/use-conversations'
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
  const {
    selectedConversation,
    selectedMessages,
    sendMessage,
    sendAttachment,
    setStatus,
    sending,
  } = chat

  if (!selectedConversation) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center">
        <Empty className="border-0 bg-transparent">
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
    <main
      className="flex min-w-0 flex-1 flex-col"
      style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', minWidth: 0 }}
    >
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3 bg-background">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {selectedConversation.customer_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {selectedConversation.customer_name}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: isOpen ? '#22c55e' : '#f3f4f6',
              color: isOpen ? '#ffffff' : '#374151',
              borderColor: isOpen ? '#16a34a' : '#d1d5db',
            }}
          >
            {isOpen ? t('admin.badge.open') : t('admin.badge.closed')}
          </span>
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
            className="cursor-pointer"
          >
            {isOpen ? (
              <>
                <Lock className="size-4 mr-1" /> {t('admin.close')}
              </>
            ) : (
              <>
                <LockOpen className="size-4 mr-1" /> {t('admin.reopen')}
              </>
            )}
          </Button>
        </div>
      </header>

      <MessageList
        messages={selectedMessages}
        lastReadAt={selectedConversation.admin_last_read_at ?? null}
      />

      <MessageInput
        onSend={sendMessage}
        onSendAttachment={sendAttachment}
        disabled={sending}
      />
    </main>
  )
}
