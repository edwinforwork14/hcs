import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { MessageRepository, CreateMessageInput } from '../../../core/interfaces'
import type { Message } from '../../../core/domain'

export class SupabaseMessageRepository implements MessageRepository {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async findByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.getClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data ?? []
  }

  async create(data: CreateMessageInput): Promise<Message> {
    const storedContent = data.attachment
      ? JSON.stringify({ attachment: data.attachment, text: data.content })
      : data.content

    const { data: created, error } = await this.getClient()
      .from('messages')
      .insert({
        conversation_id: data.conversation_id,
        sender_type: data.sender_type,
        content: storedContent,
        ...(data.created_at ? { created_at: data.created_at } : {}),
      })
      .select()
      .single()

    if (error) throw error
    return created
  }

  async updateCreatedAt(id: string, createdAt: string): Promise<Message> {
    const { data: updated, error } = await this.getClient()
      .from('messages')
      .update({ created_at: createdAt })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  }
}
