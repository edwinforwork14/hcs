import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  isAllowedAttachmentType,
  MAX_ATTACHMENT_SIZE,
} from '@/lib/attachments'
import {
  createServerSupabaseClient,
  createServiceRoleClient,
  isServerSupabaseConfigured,
} from '@/lib/supabase/server'
import { AttachmentSchema } from '@/lib/validations/chat'

const MessageRequestSchema = z.object({
  conversationId: z.string().uuid(),
  senderType: z.enum(['customer', 'admin']),
  content: z.string().trim().max(2000).default(''),
  attachment: AttachmentSchema.optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = MessageRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid message data' },
        { status: 400 },
      )
    }

    const { conversationId, senderType, content, attachment } = parsed.data

    // A message needs text and/or a file.
    if (!content && !attachment) {
      return NextResponse.json({ error: 'Message is empty' }, { status: 400 })
    }

    if (attachment) {
      if (!isAllowedAttachmentType(attachment.type)) {
        return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
      }
      if (attachment.size > MAX_ATTACHMENT_SIZE) {
        return NextResponse.json({ error: 'File too large' }, { status: 413 })
      }
      // The attachment must have been uploaded under this conversation's folder.
      if (!attachment.path.startsWith(`conversations/${conversationId}/`)) {
        return NextResponse.json({ error: 'Invalid attachment path' }, { status: 400 })
      }
    }

    if (!isServerSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      )
    }

    const service = createServiceRoleClient()
    if (!service) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      )
    }

    if (senderType === 'admin') {
      // Admins must be signed in and present in the admins table.
      const supabase = await createServerSupabaseClient()
      if (!supabase) {
        return NextResponse.json(
          { error: 'Chat service not configured' },
          { status: 500 },
        )
      }
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
      }
      const { data: admin } = await service
        .from('admins')
        .select('id')
        .eq('email', user.email.toLowerCase())
        .maybeSingle()
      if (!admin) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
      }
    } else {
      // Customers: verify the conversation exists.
      const { data: conversation } = await service
        .from('conversations')
        .select('id')
        .eq('id', conversationId)
        .maybeSingle()
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }
    }

    // Attachment metadata travels inside the message content as JSON so no
    // schema migration is required (content is free text).
    const storedContent = attachment
      ? JSON.stringify({ attachment, text: content })
      : content

    const { data: message, error } = await service
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        content: storedContent,
      })
      .select()
      .single()
    if (error || !message) {
      console.error('Chat message insert error:', error)
      return NextResponse.json(
        { error: 'Could not send message' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: { message } })
  } catch (error) {
    console.error('Chat message error:', error)
    return NextResponse.json(
      { error: 'Could not send message' },
      { status: 500 },
    )
  }
}
