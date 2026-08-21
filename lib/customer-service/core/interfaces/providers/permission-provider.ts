export interface PermissionProvider {
  isAdmin(email: string): Promise<boolean>
  isAgent(email: string): Promise<boolean>
  canViewConversation(agentEmail: string, conversationId: string): Promise<boolean>
  canSendMessage(agentEmail: string, conversationId: string): Promise<boolean>
  canCloseConversation(agentEmail: string, conversationId: string): Promise<boolean>
}
