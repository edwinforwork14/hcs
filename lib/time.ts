import {
  differenceInCalendarMonths,
  format,
  formatDistanceToNow,
  isSameDay,
  isYesterday,
} from 'date-fns'

/** Short clock time for message bubbles, e.g. 14:32 */
export function formatMessageTime(iso: string): string {
  try {
    return format(new Date(iso), 'HH:mm')
  } catch {
    return ''
  }
}

/** Relative time for the conversation list, e.g. "5 minutes ago" */
export function formatConversationTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return ''
  }
}

/** Compact absolute date + time, e.g. "15/07/2025 09:00" (es) or "07/15/2025 09:00" (en) */
export function formatFullDateTime(
  iso: string,
  lang: 'en' | 'es' = 'en',
): string {
  try {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

/** Long date label for the WhatsApp-style divider chip, e.g. "15 de julio de 2025" */
export function formatFullDate(iso: string, lang: 'en' | 'es' = 'en'): string {
  try {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

/** WhatsApp-style short day label: Today / Yesterday / full date */
export function formatDividerLabel(
  iso: string,
  lang: 'en' | 'es',
  todayLabel: string,
  yesterdayLabel: string,
): string {
  const date = new Date(iso)
  if (isSameDay(date, new Date())) return todayLabel
  if (isYesterday(date)) return yesterdayLabel
  return formatFullDate(iso, lang)
}

export interface MessageDivider {
  /** Index of the message before which the divider must render. */
  messageIndex: number
  variant: 'day' | 'month-gap'
}

/**
 * Computes WhatsApp-style date dividers for a message list:
 * - a `day` divider whenever the day changes between two consecutive messages,
 * - a `month-gap` divider when more than a month passes between messages,
 *   signaling that the following messages belong to a different date.
 */
export function computeMessageDividers(
  messages: { created_at: string }[],
): MessageDivider[] {
  const dividers: MessageDivider[] = []
  messages.forEach((message, index) => {
    const previous = messages[index - 1]
    if (!previous) {
      dividers.push({ messageIndex: index, variant: 'day' })
      return
    }
    const previousDate = new Date(previous.created_at)
    const currentDate = new Date(message.created_at)
    if (differenceInCalendarMonths(currentDate, previousDate) >= 1) {
      dividers.push({ messageIndex: index, variant: 'month-gap' })
    } else if (!isSameDay(previousDate, currentDate)) {
      dividers.push({ messageIndex: index, variant: 'day' })
    }
  })
  return dividers
}
