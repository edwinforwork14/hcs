import type { ConversationRepository, MessageRepository } from '../interfaces'
import type { Conversation, ConversationStatus } from '../domain'

export class ConversationService {
  constructor(
    private repos: {
      conversation: ConversationRepository
      message: MessageRepository
    }
  ) {}

  async getConversation(id: string): Promise<Conversation | null> {
    return this.repos.conversation.findById(id)
  }

  async listAllConversations(): Promise<Conversation[]> {
    return this.repos.conversation.findAll()
  }

  async setStatus(id: string, status: ConversationStatus): Promise<Conversation> {
    return this.repos.conversation.updateStatus(id, status)
  }

  async markAsRead(id: string): Promise<Conversation> {
    return this.repos.conversation.markAsRead(id)
  }

  async deleteConversation(id: string): Promise<void> {
    return this.repos.conversation.delete(id)
  }
}
