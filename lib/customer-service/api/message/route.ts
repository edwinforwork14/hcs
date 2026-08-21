import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseConfig } from '../../adapters/supabase'
import { createSupabaseServerClient } from '../../adapters/supabase/server'
import { AttachmentSchema } from '@/lib/validations/chat'

const MessageRequestSchema = z.object({
  conversationId: z.string().uuid(),
  senderType: z.enum(['customer', 'admin']),
  content: z.string().trim().max(2000).default(''),
  attachment: AttachmentSchema.optional(),
})

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anonKey || !serviceRoleKey) {
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
    }

    const config = createSupabaseConfig({
      supabaseUrl: url,
      supabaseAnonKey: anonKey,
      supabaseServiceRoleKey: serviceRoleKey,
    })

    const body = await request.json().catch(() => null)
    const parsed = MessageRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid message data' },
        { status: 400 }
      )
    }

    const { conversationId, senderType, content, attachment } = parsed.data

    if (!content && !attachment) {
      return NextResponse.json({ error: 'Message is empty' }, { status: 400 })
    }

    if (attachment) {
      if (!attachment.path.startsWith(`conversations/${conversationId}/`)) {
        return NextResponse.json({ error: 'Invalid attachment path' }, { status: 400 })
      }
    }

    if (senderType === 'admin') {
      const supabase = await createSupabaseServerClient(url, anonKey)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
      }
      const isAgent = await config.providers.permission.isAgent(user.email)
      if (!isAgent) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
      }
    } else {
      const conversation = await config.repositories.conversation.findById(conversationId)
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
      }
    }

    const message = await config.repositories.message.create({
      conversation_id: conversationId,
      sender_type: senderType,
      content,
      attachment,
    })

    return NextResponse.json({ success: true, data: { message } })
  } catch (error) {
    console.error('Chat message API error:', error)
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 })
  }
}
