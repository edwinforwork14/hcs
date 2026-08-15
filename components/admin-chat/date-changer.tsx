'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, CalendarClock, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/context/language-context'
import { apiPost } from '@/lib/api'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { formatConversationTime } from '@/lib/time'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/chat'

interface DateChangePayload {
  conversationId: string
  targetDate: string
}

interface DateChangeResult {
  conversation: Conversation
  messageCount: number
}

export function DateChanger({
  initialConversations,
}: {
  initialConversations: Conversation[]
}) {
  const { t } = useLanguage()
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  )
  const [date, setDate] = useState('2025-07-15')
  const [time, setTime] = useState('09:00')
  const [applying, setApplying] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const selected = conversations.find((c) => c.id === selectedId) ?? null

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabaseClient()
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setConversations(data as Conversation[])
  }, [])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const apply = async () => {
    if (!selectedId) return
    const target = new Date(`${date}T${time}`)
    if (Number.isNaN(target.getTime())) {
      toast.error(t('datechange.invalidDate'))
      return
    }
    setApplying(true)
    setResult(null)
    try {
      const res = await apiPost<DateChangeResult, DateChangePayload>(
        '/api/chat/datechange',
        {
          conversationId: selectedId,
          targetDate: target.toISOString(),
        },
      )
      if (!res.data) throw new Error('No data')
      const data = res.data
      toast.success(
        `${t('datechange.success')} ${format(target, 'dd/MM/yyyy HH:mm')} · ${
          data.messageCount
        } ${t('datechange.messages')}`,
      )
      setResult(
        `${t('datechange.result')} ${format(
          target,
          'dd/MM/yyyy HH:mm',
        )} · ${data.messageCount} ${t('datechange.messages')}`,
      )
      await refresh()
    } catch {
      toast.error(t('datechange.error'))
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Conversation list */}
      <aside className="flex w-80 shrink-0 flex-col border-r bg-muted/30">
        <div className="flex items-center justify-between gap-2 p-3">
          <h2 className="text-sm font-semibold">{t('datechange.title')}</h2>
          <div className="flex items-center gap-1.5">
            <LanguageToggle variant="panel" />
            <Link
              href="/admin/support"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t('datechange.backToDashboard')}
            </Link>
          </div>
        </div>
        <p className="px-3 pb-2 text-[11px] text-muted-foreground">
          {t('datechange.subtitle')}
        </p>

        <div className="min-h-0 flex-1 overflow-y-auto border-t">
          {conversations.length === 0 && (
            <p className="p-4 text-center text-xs text-muted-foreground">
              {t('admin.noConversations')}
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedId(c.id)
                setResult(null)
              }}
              className={cn(
                'flex w-full cursor-pointer flex-col gap-0.5 border-b px-3 py-2.5 text-left transition-colors hover:bg-muted',
                selectedId === c.id && 'bg-muted',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {c.customer_name}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatConversationTime(c.created_at)}
                </span>
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {c.customer_email}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t('datechange.started')}: {format(new Date(c.created_at), 'dd/MM/yyyy HH:mm')}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Form */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            {t('admin.noSelection')}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CalendarClock className="size-5 text-primary" />
              </span>
              <div>
                <h1 className="text-lg font-semibold">{t('datechange.title')}</h1>
                <p className="text-xs text-muted-foreground">
                  {selected.customer_name} · {selected.customer_email}
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border p-5">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t('datechange.started')}
                  </span>
                  <span className="font-medium">
                    {format(new Date(selected.created_at), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t('datechange.lastActivity')}
                  </span>
                  <span className="font-medium">
                    {format(new Date(selected.updated_at), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t('datechange.status')}
                  </span>
                  <span className="font-medium capitalize">{selected.status}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t('datechange.targetDate')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={date}
                    max="2100-12-31"
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {t('datechange.note')}
                </p>
              </div>

              <button
                type="button"
                onClick={apply}
                disabled={applying}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {applying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t('datechange.applying')}
                  </>
                ) : (
                  <>
                    <CalendarClock className="size-4" />
                    {t('datechange.apply')}
                  </>
                )}
              </button>

              {result && (
                <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <span>{result}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
