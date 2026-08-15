'use client'

import { Search } from 'lucide-react'

import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/context/language-context'
import type { UseConversations } from '@/hooks/use-conversations'

import { SignOutButton } from './sign-out-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatConversationTime } from '@/lib/time'
import type { ConversationFilter } from '@/types/chat'

const FILTERS: { value: ConversationFilter; key: string }[] = [
  { value: 'all', key: 'admin.filter.all' },
  { value: 'open', key: 'admin.filter.open' },
  { value: 'closed', key: 'admin.filter.closed' },
  { value: 'unread', key: 'admin.filter.unread' },
]

export function ConversationsSidebar({ chat }: { chat: UseConversations }) {
  const { t } = useLanguage()
  const {
    conversations,
    selectedId,
    selectConversation,
    query,
    setQuery,
    filter,
    setFilter,
    realtimeStatus,
  } = chat

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r bg-muted/30">
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">{t('admin.chats')}</h2>
          <div className="flex items-center gap-2">
            <LanguageToggle variant="panel" />
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor:
                    realtimeStatus === 'SUBSCRIBED' ? '#22c55e' : '#f59e0b',
                }}
              />
              {realtimeStatus === 'SUBSCRIBED'
                ? t('admin.live')
                : realtimeStatus === 'CONNECTING'
                  ? t('admin.connecting')
                  : t('admin.offline')}
            </span>
            <SignOutButton iconOnly />
          </div>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('admin.searchCustomer')}
            className="pl-8"
          />
        </div>

        <div className="mt-2 flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex-1 cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col p-2">
          {conversations.length === 0 && (
            <p className="p-4 text-center text-xs text-muted-foreground">
              {t('admin.noConversations')}
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectConversation(c.id)}
              className={cn(
                'flex w-full cursor-pointer flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted',
                selectedId === c.id && 'bg-muted',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {c.customer_name}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatConversationTime(c.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-muted-foreground">
                  {c.lastMessage ?? t('admin.noMessagesYet')}
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {c.unreadCount > 0 && (
                    <Badge
                      className="rounded-full px-1.5 text-[10px]"
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        minWidth: 18,
                        height: 18,
                      }}
                    >
                      {c.unreadCount}
                    </Badge>
                  )}
                  <span
                    className="rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: c.status === 'open' ? '#22c55e' : '#9ca3af',
                    }}
                  />
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}
