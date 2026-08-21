import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { ConversationRepository, CreateConversationInput } from '../../../core/interfaces'
import type { Conversation, ConversationStatus } from '../../../core/domain'

export class SupabaseConversationRepository implements ConversationRepository {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async findById(id: string): Promise<Conversation | null> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async findByCustomerEmail(email: string): Promise<Conversation[]> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  async findOpenByEmail(email: string): Promise<Conversation | null> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*')
      .eq('customer_email', email)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async findRecentByEmail(email: string): Promise<Conversation | null> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*')
      .eq('customer_email', email)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async findAll(): Promise<Conversation[]> {
    const { data, error } = await this.getClient()
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data ?? []
  }

  async create(data: CreateConversationInput): Promise<Conversation> {
    const { data: created, error } = await this.getClient()
      .from('conversations')
      .insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone ?? null,
        customer_location: data.customer_location ?? null,
        customer_language: data.customer_language ?? null,
        status: data.status ?? 'open',
        ...(data.created_at ? { created_at: data.created_at } : {}),
        ...(data.updated_at ? { updated_at: data.updated_at } : {}),
      })
      .select()
      .single()
    if (error) throw error
    return created
  }

  async updateStatus(id: string, status: ConversationStatus): Promise<Conversation> {
    const { data: updated, error } = await this.getClient()
      .from('conversations')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  }

  async markAsRead(id: string): Promise<Conversation> {
    const { data: updated, error } = await this.getClient()
      .from('conversations')
      .update({ admin_last_read_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('conversations')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  async updateDates(id: string, createdAt: string, updatedAt: string): Promise<Conversation> {
    const { data: updated, error } = await this.getClient()
      .from('conversations')
      .update({
        created_at: createdAt,
        updated_at: updatedAt,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  }
}
