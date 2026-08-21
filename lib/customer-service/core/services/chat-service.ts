import type {
  ConversationRepository,
  MessageRepository,
  CustomerRepository,
  AttachmentRepository,
} from '../interfaces'
import type { Conversation, Message, MessageAttachment } from '../domain'
import { CustomerServiceError } from '../errors'

export class ChatService {
  constructor(
    private repos: {
      conversation: ConversationRepository
      message: MessageRepository
      customer: CustomerRepository
      attachment: AttachmentRepository
    }
  ) {}

  async startConversation(input: {
    customerName: string
    customerEmail: string
    customerPhone?: string
    customerLocation?: string
    language?: string
  }): Promise<{ conversation: Conversation; welcomeMessage?: Message }> {
    const existing = await this.repos.conversation.findOpenByEmail(input.customerEmail)
    if (existing) {
      return { conversation: existing }
    }

    const conversation = await this.repos.conversation.create({
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone || null,
      customer_location: input.customerLocation || null,
      customer_language: input.language || null,
      status: 'open',
    })

    const welcomeText =
      input.language === 'es'
        ? '¡Hola! ¿En qué podemos ayudarte hoy? Un agente se unirá al chat en breve.'
        : 'Hello! How can we help you today? An agent will join the chat shortly.'

    const welcomeMessage = await this.repos.message.create({
      conversation_id: conversation.id,
      sender_type: 'admin',
      content: welcomeText,
    })

    return { conversation, welcomeMessage }
  }

  async sendCustomerMessage(conversationId: string, content: string): Promise<Message> {
    return this.repos.message.create({
      conversation_id: conversationId,
      sender_type: 'customer',
      content,
    })
  }

  async sendCustomerAttachment(
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
      sender_type: 'customer',
      content: content.trim(),
      attachment,
    })
  }
}
