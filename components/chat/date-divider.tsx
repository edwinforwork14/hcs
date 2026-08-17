'use client'

import { useLanguage } from '@/context/language-context'
import { formatDividerLabel } from '@/lib/time'

/**
 * WhatsApp-style centered divider chip shown between groups of messages of
 * different days (Today / Yesterday / full date).
 */
export function DateDivider({ date }: { date: string }) {
  const { t, language } = useLanguage()

  const label = formatDividerLabel(
    date,
    language,
    t('chat.divider.today'),
    t('chat.divider.yesterday'),
  )

  return (
    <div className="flex justify-center py-1">
      <span
        className="inline-flex max-w-full items-center rounded-full px-3 py-1 text-center text-[11px] font-medium"
        style={{
          backgroundColor: '#e5e7eb',
          color: '#374151',
        }}
      >
        <span className="truncate">{label}</span>
      </span>
    </div>
  )
}
