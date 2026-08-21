import type { Message, MessageAttachment, SenderType } from '../../domain'

export interface CreateMessageInput {
  conversation_id: string
  sender_type: SenderType
  content: string
  attachment?: MessageAttachment
  created_at?: string
}

export interface MessageRepository {
  findByConversation(conversationId: string): Promise<Message[]>
  create(data: CreateMessageInput): Promise<Message>
  updateCreatedAt(id: string, createdAt: string): Promise<Message>
}
