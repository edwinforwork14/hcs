export interface NotificationProvider {
  notifyNewMessage(conversationId: string, messageText: string): Promise<void>
  notifyNewConversation(conversationId: string, customerName: string): Promise<void>
}
