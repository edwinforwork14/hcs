'use client'

import { CalendarClock } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import { formatDividerLabel, formatFullDate } from '@/lib/time'

/**
 * WhatsApp-style centered divider chip shown between groups of messages.
 * - `day`: date chip (Today / Yesterday / full date).
 * - `month-gap`: highlighted banner when the following messages jump to a
 *   different date (more than a month later).
 */
export function DateDivider({
  date,
  variant = 'day',
}: {
  date: string
  variant?: 'day' | 'month-gap'
}) {
  const { t, language } = useLanguage()

  const isMonthGap = variant === 'month-gap'
  // The banner always shows the actual date of the following messages, so it
  // stays in sync when the conversation dates are changed.
  const label = isMonthGap
    ? `${t('chat.divider.newDate')} \u00b7 ${formatFullDate(date, language)}`
    : formatDividerLabel(
        date,
        language,
        t('chat.divider.today'),
        t('chat.divider.yesterday'),
      )

  return (
    <div className="flex justify-center py-1">
      <span
        className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-center text-[11px] font-medium"
        style={{
          backgroundColor: isMonthGap ? '#fef3c7' : '#e5e7eb',
          color: isMonthGap ? '#92400e' : '#374151',
        }}
      >
        {isMonthGap && (
          <CalendarClock className="shrink-0" style={{ width: 13, height: 13 }} />
        )}
        <span className="truncate">{label}</span>
      </span>
    </div>
  )
}
