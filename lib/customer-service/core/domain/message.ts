export type SenderType = 'customer' | 'admin'

export interface MessageAttachment {
  name: string
  size: number
  type: string
  path: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_type: SenderType
  content: string
  created_at: string
}

/**
 * Attachment metadata is stored inside the message content as JSON
 * ({"attachment": {...}, "text": "..."}) so no schema migration is needed.
 * Returns the attachment of a message, or null when the message has none.
 */
export function getMessageAttachment(message: Message): MessageAttachment | null {
  if (!message.content) return null
  try {
    const parsed = JSON.parse(message.content) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      'attachment' in parsed &&
      typeof (parsed as { attachment?: unknown }).attachment === 'object' &&
      (parsed as { attachment?: MessageAttachment }).attachment
    ) {
      const att = (parsed as { attachment: MessageAttachment }).attachment
      if (
        typeof att.name === 'string' &&
        typeof att.path === 'string' &&
        typeof att.type === 'string' &&
        typeof att.size === 'number'
      ) {
        return att
      }
    }
  } catch {
    // Plain-text message.
  }
  return null
}

/** The visible text of a message (extracts it from attachment-JSON messages). */
export function getMessageText(message: Message): string {
  if (!message.content) return ''
  try {
    const parsed = JSON.parse(message.content) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      'attachment' in parsed
    ) {
      const text = (parsed as { text?: string }).text
      return typeof text === 'string' ? text : ''
    }
  } catch {
    // Plain-text message.
  }
  return message.content
}
