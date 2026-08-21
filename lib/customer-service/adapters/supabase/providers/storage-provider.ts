import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { StorageProvider } from '../../../core/interfaces'

export class SupabaseStorageProvider implements StorageProvider {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async getUploadUrl(
    path: string,
    _contentType: string
  ): Promise<{ uploadUrl: string; path: string }> {
    const { data, error } = await this.getClient().storage
      .from('chat-attachments')
      .createSignedUploadUrl(path)
    if (error || !data) {
      throw error || new Error('Could not prepare upload')
    }
    return {
      uploadUrl: data.signedUrl,
      path: data.path || path,
    }
  }

  async getDownloadUrl(path: string): Promise<string> {
    const { data, error } = await this.getClient().storage
      .from('chat-attachments')
      .createSignedUrl(path, 3600)
    if (error || !data) {
      throw error || new Error('Could not generate download link')
    }
    return data.signedUrl
  }

  async delete(path: string): Promise<void> {
    const { error } = await this.getClient().storage
      .from('chat-attachments')
      .remove([path])
    if (error) throw error
  }
}
