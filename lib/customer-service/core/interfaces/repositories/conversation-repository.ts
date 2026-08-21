import type { Conversation, ConversationStatus } from '../../domain'

export interface CreateConversationInput {
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  customer_location?: string | null
  customer_language?: string | null
  status?: ConversationStatus
  updated_at?: string
  created_at?: string
}

export interface ConversationRepository {
  findById(id: string): Promise<Conversation | null>
  findByCustomerEmail(email: string): Promise<Conversation[]>
  findOpenByEmail(email: string): Promise<Conversation | null>
  findRecentByEmail(email: string): Promise<Conversation | null>
  findAll(): Promise<Conversation[]>
  create(data: CreateConversationInput): Promise<Conversation>
  updateStatus(id: string, status: ConversationStatus): Promise<Conversation>
  markAsRead(id: string): Promise<Conversation>
  delete(id: string): Promise<void>
  updateDates(id: string, createdAt: string, updatedAt: string): Promise<Conversation>
}
