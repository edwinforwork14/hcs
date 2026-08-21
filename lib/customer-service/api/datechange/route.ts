import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '../../middleware/admin-auth'
import { createSupabaseConfig } from '../../adapters/supabase'

const DateChangeSchema = z.object({
  conversationId: z.string().uuid(),
  targetDate: z.string().min(1),
})

/**
 * Simulation helper (admin only): moves a conversation — and all of its
 * messages — to an arbitrary past (or future) date, keeping the relative
 * spacing between messages intact. Used to demo/train with "old" chats.
 */
export async function POST(request: Request) {
  try {
    const auth = await getAdminAuth()
    if (auth.status === 'not-configured') {
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
    }
    if (auth.status !== 'ok') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const parsed = DateChangeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const target = new Date(parsed.data.targetDate)
    if (Number.isNaN(target.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const conversation = await config.repositories.conversation.findById(parsed.data.conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const originalCreatedMs = new Date(conversation.created_at).getTime()
    const deltaMs = target.getTime() - originalCreatedMs
    if (deltaMs === 0) {
      return NextResponse.json({
        success: true,
        data: { conversation, messageCount: 0, unchanged: true },
      })
    }

    // Shift all messages by the same delta to keep chronology intact
    const messages = await config.repositories.message.findByConversation(conversation.id)
    for (const message of messages) {
      const shiftedAt = new Date(new Date(message.created_at).getTime() + deltaMs).toISOString()
      await config.repositories.message.updateCreatedAt(message.id, shiftedAt)
    }

    const shiftedUpdatedAt = new Date(
      new Date(conversation.updated_at).getTime() + deltaMs,
    ).toISOString()

    const updated = await config.repositories.conversation.updateDates(
      conversation.id,
      target.toISOString(),
      shiftedUpdatedAt,
    )

    return NextResponse.json({
      success: true,
      data: { conversation: updated, messageCount: messages.length },
    })
  } catch (error) {
    console.error('Chat datechange error:', error)
    return NextResponse.json({ error: 'Could not change conversation dates' }, { status: 500 })
  }
}
