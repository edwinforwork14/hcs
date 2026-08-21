import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { PermissionProvider } from '../../../core/interfaces'

export class SupabasePermissionProvider implements PermissionProvider {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  private async isAuthorized(email: string): Promise<boolean> {
    const { data, error } = await this.getClient()
      .from('admins')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()
    if (error || !data) return false
    return true
  }

  async isAdmin(email: string): Promise<boolean> {
    return this.isAuthorized(email)
  }

  async isAgent(email: string): Promise<boolean> {
    return this.isAuthorized(email)
  }

  async canViewConversation(agentEmail: string, _conversationId: string): Promise<boolean> {
    return this.isAuthorized(agentEmail)
  }

  async canSendMessage(agentEmail: string, _conversationId: string): Promise<boolean> {
    return this.isAuthorized(agentEmail)
  }

  async canCloseConversation(agentEmail: string, _conversationId: string): Promise<boolean> {
    return this.isAuthorized(agentEmail)
  }
}
