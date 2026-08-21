'use client'

import { Search, Globe } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import type { UseConversations } from '../../hooks/use-conversations'

import { SignOutButton } from './sign-out-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ReadIcon } from '@/components/chat/read-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatConversationTime } from '@/lib/time'
import type { ConversationFilter } from '../../core/domain'

const FILTERS: { value: ConversationFilter; key: string }[] = [
  { value: 'all', key: 'admin.filter.all' },
  { value: 'open', key: 'admin.filter.open' },
  { value: 'closed', key: 'admin.filter.closed' },
  { value: 'unread', key: 'admin.filter.unread' },
]

export function ConversationsSidebar({ chat }: { chat: UseConversations }) {
  const { language, setLanguage, t } = useLanguage()
  const {
    conversations,
    selectedId,
    selectConversation,
    query,
    setQuery,
    filter,
    setFilter,
  } = chat

  const realtimeStatus = chat.realtimeStatus || 'SUBSCRIBED'

  return (
    <aside
      className="flex w-72 shrink-0 flex-col border-r bg-muted/30"
      style={{ flexShrink: 0, width: 288 }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">{t('admin.chats')}</h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              title={language === 'en' ? 'Español' : 'English'}
              className="cursor-pointer border-0"
            >
              <Globe className="size-4" />
            </Button>
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
            className="pl-8 bg-background"
          />
        </div>

        <div className="mt-2 flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex-1 cursor-pointer rounded-md px-2 py-1 text-xs font-medium transition-colors border-0',
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-muted',
              )}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div
        className="min-h-0 flex-1"
        style={{
          flex: '1 1 0%',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          className="flex flex-col p-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            maxWidth: '100%',
          }}
        >
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
                'flex w-full cursor-pointer flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted border-0 bg-transparent',
                selectedId === c.id && 'bg-muted',
              )}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
              }}
            >
              <div
                className="flex items-center justify-between gap-2"
                style={{ minWidth: 0, width: '100%' }}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="rounded-full"
                    title={
                      c.status === 'open'
                        ? t('admin.badge.open')
                        : t('admin.badge.closed')
                    }
                    style={{
                      width: 8,
                      height: 8,
                      flexShrink: 0,
                      backgroundColor:
                        c.status === 'open' ? '#22c55e' : '#9ca3af',
                    }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {c.customer_name}
                  </span>
                </span>
                {c.unreadCount > 0 ? (
                  <Badge
                    className="rounded-full px-1.5 text-[10px] border-0"
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      minWidth: 18,
                      height: 18,
                      flexShrink: 0,
                    }}
                  >
                    {c.unreadCount}
                  </Badge>
                ) : (
                  <ReadIcon read size={15} />
                )}
              </div>
              <div
                className="flex items-center justify-between gap-2"
                style={{ minWidth: 0, width: '100%' }}
              >
                <span className="truncate text-xs text-muted-foreground">
                  {c.lastMessage ?? t('admin.noMessagesYet')}
                </span>
                <span
                  className="text-[10px] text-muted-foreground"
                  style={{ flexShrink: 0 }}
                >
                  {formatConversationTime(c.lastMessageAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
