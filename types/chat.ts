import type { Database } from '@/lib/supabase/database.types'

export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type SenderType = Message['sender_type']
export type ConversationStatus = Conversation['status']

export interface ConversationWithMeta extends Conversation {
  /** Content of the most recent message, used in the admin sidebar. */
  lastMessage: string | null
  /** Timestamp of the most recent message (or conversation update). */
  lastMessageAt: string
  /** Number of customer messages the admin has not read yet. */
  unreadCount: number
}

/** Session persisted in localStorage so a returning visitor resumes their chat. */
export interface ChatSession {
  conversationId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
}

export type ConversationFilter = 'all' | 'open' | 'closed' | 'unread'

/** Payload sent by the customer widget to `/api/chat/start`. */
export interface StartChatPayload {
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerLocation?: string
  language?: string
}

/** Response of `/api/chat/start`: the conversation plus the automatic welcome message. */
export interface StartChatResult {
  conversation: Conversation
  welcomeMessage: Message
}

/** Attachment metadata attached to a message (stored in columns on `messages`). */
export interface MessageAttachment {
  name: string
  size: number
  type: string
  path: string
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

/** Payload for `POST /api/chat/upload` (request a signed upload URL). */
export interface UploadPayload {
  conversationId: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface UploadResult {
  uploadUrl: string
  path: string
}

/** Payload for `POST /api/chat/message` (create a message, optionally with an attachment). */
export interface CreateMessagePayload {
  conversationId: string
  senderType: SenderType
  content: string
  attachment?: MessageAttachment
}

export interface CreateMessageResult {
  message: Message
}

export interface AttachmentUrlResult {
  url: string
}
