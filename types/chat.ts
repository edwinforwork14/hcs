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
