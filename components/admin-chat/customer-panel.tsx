'use client'

import { Clock, Globe, Mail, MapPin, Phone, User } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import type { UseConversations } from '@/hooks/use-conversations'
import { formatConversationTime } from '@/lib/time'

export function CustomerPanel({ chat }: { chat: UseConversations }) {
  const { t } = useLanguage()
  const { selectedConversation } = chat

  if (!selectedConversation) {
    return <aside className="hidden w-72 shrink-0 border-l lg:block" />
  }

  const c = selectedConversation
  const rows = [
    { icon: User, label: t('admin.field.name'), value: c.customer_name },
    { icon: Mail, label: t('admin.field.email'), value: c.customer_email },
    { icon: Phone, label: t('admin.field.phone'), value: c.customer_phone ?? '—' },
    { icon: MapPin, label: t('admin.field.location'), value: c.customer_location ?? '—' },
    { icon: Globe, label: t('admin.field.language'), value: c.customer_language ?? '—' },
  ]

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l bg-muted/30 lg:flex">
      <div className="p-4">
        <h3 className="text-sm font-semibold">{t('admin.customer')}</h3>
        <div className="mt-4 space-y-3.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-2.5">
              <row.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </p>
                <p className="truncate text-sm">{row.value}</p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {t('admin.field.status')}
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: c.status === 'open' ? '#22c55e' : '#9ca3af',
                  }}
                />
                <span className="text-sm capitalize">{c.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t p-4 text-[11px] text-muted-foreground">
        {t('admin.conversationStarted')} {formatConversationTime(c.created_at)}
      </div>
    </aside>
  )
}
