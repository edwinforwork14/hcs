import type { NotificationProvider } from '../interfaces'

export class NotificationService {
  constructor(private provider?: NotificationProvider) {}

  async onNewMessage(conversationId: string, messageText: string): Promise<void> {
    if (this.provider) {
      await this.provider.notifyNewMessage(conversationId, messageText)
    }
  }

  async onNewConversation(conversationId: string, customerName: string): Promise<void> {
    if (this.provider) {
      await this.provider.notifyNewConversation(conversationId, customerName)
    }
  }
}
