import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { AgentRepository } from '../../../core/interfaces'
import type { Agent } from '../../../core/domain'

export class SupabaseAgentRepository implements AgentRepository {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async findByEmail(email: string): Promise<Agent | null> {
    const { data, error } = await this.getClient()
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()
    if (error) throw error
    return data
  }

  async findAll(): Promise<Agent[]> {
    const { data, error } = await this.getClient()
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  async create(data: { email: string; name: string }): Promise<Agent> {
    const { data: created, error } = await this.getClient()
      .from('admins')
      .insert({
        email: data.email.toLowerCase(),
        name: data.name,
      })
      .select()
      .single()
    if (error) throw error
    return created
  }
}
