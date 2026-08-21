import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { AttachmentRepository } from '../../../core/interfaces'

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
  return base || 'file'
}

export class SupabaseAttachmentRepository implements AttachmentRepository {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async getUploadUrl(
    conversationId: string,
    fileName: string,
    _fileType: string,
    _fileSize: number
  ): Promise<{ uploadUrl: string; path: string }> {
    const path = `conversations/${conversationId}/${crypto.randomUUID()}/${sanitizeFileName(fileName)}`
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
