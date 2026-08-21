import type { MessageRepository, AttachmentRepository } from '../interfaces'
import type { Message, MessageAttachment } from '../domain'
import { CustomerServiceError } from '../errors'

export class MessageService {
  constructor(
    private repos: {
      message: MessageRepository
      attachment: AttachmentRepository
    }
  ) {}

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.repos.message.findByConversation(conversationId)
  }

  async sendAdminMessage(conversationId: string, content: string): Promise<Message> {
    return this.repos.message.create({
      conversation_id: conversationId,
      sender_type: 'admin',
      content,
    })
  }

  async sendAdminAttachment(
    conversationId: string,
    file: { name: string; size: number; type: string; data: File },
    content: string = ''
  ): Promise<Message> {
    const { uploadUrl, path } = await this.repos.attachment.getUploadUrl(
      conversationId,
      file.name,
      file.type,
      file.size
    )

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file.data,
    })
    if (!putRes.ok) {
      throw new CustomerServiceError('UPLOAD_FAILED', 'Could not upload attachment')
    }

    const attachment: MessageAttachment = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      path,
    }

    return this.repos.message.create({
      conversation_id: conversationId,
      sender_type: 'admin',
      content: content.trim(),
      attachment,
    })
  }
}
