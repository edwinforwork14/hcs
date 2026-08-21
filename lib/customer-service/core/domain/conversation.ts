export type ConversationStatus = 'open' | 'closed'

export interface Conversation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_location: string | null
  customer_language: string | null
  status: ConversationStatus
  admin_last_read_at: string | null
  created_at: string
  updated_at: string
}

export interface ConversationWithMeta extends Conversation {
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
}

export type ConversationFilter = 'all' | 'open' | 'closed' | 'unread'
