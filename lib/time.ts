import { format, formatDistanceToNow } from 'date-fns'

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
