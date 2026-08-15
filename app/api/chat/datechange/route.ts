import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getAdminAuth } from '@/lib/admin-auth'
import { createServiceRoleClient } from '@/lib/supabase/server'
import type { Conversation } from '@/types/chat'

const DateChangeSchema = z.object({
  conversationId: z.string().uuid(),
  /** Full ISO datetime the conversation should appear to have started at. */
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
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      )
    }
    if (auth.status !== 'ok') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = createServiceRoleClient()
    if (!service) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = DateChangeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const target = new Date(parsed.data.targetDate)
    if (Number.isNaN(target.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const { data: conversation } = await service
      .from('conversations')
      .select('*')
      .eq('id', parsed.data.conversationId)
      .maybeSingle()
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 },
      )
    }

    const originalCreatedMs = new Date(conversation.created_at).getTime()
    const deltaMs = target.getTime() - originalCreatedMs
    if (deltaMs === 0) {
      return NextResponse.json({
        success: true,
        data: { conversation, messageCount: 0, unchanged: true },
      })
    }

    // Shift every message by the same delta so the internal chronology is kept.
    // Full rows are sent back in the upsert because PostgREST fills omitted
    // NOT NULL columns with NULL on insert-conflict upserts.
    const { data: messages } = await service
      .from('messages')
      .select('id, conversation_id, sender_type, content, created_at')
      .eq('conversation_id', conversation.id)
    const shiftedMessages = (messages ?? []).map((message) => ({
      ...message,
      created_at: new Date(
        new Date(message.created_at).getTime() + deltaMs,
      ).toISOString(),
    }))
    if (shiftedMessages.length > 0) {
      const { error: messagesError } = await service
        .from('messages')
        .upsert(shiftedMessages)
      if (messagesError) {
        console.error('Chat datechange messages error:', messagesError)
        return NextResponse.json(
          { error: 'Could not update messages' },
          { status: 500 },
        )
      }
    }

    // Move the conversation start date. `updated_at` is passed explicitly so
    // it shifts too; the default trigger resets it to now(), the optional
    // improved trigger in supabase/schema.sql keeps the shifted value.
    const shiftedUpdatedAt = new Date(
      new Date(conversation.updated_at).getTime() + deltaMs,
    ).toISOString()
    const { data: updated, error: conversationError } = await service
      .from('conversations')
      .update({
        created_at: target.toISOString(),
        updated_at: shiftedUpdatedAt,
      })
      .eq('id', conversation.id)
      .select()
      .single()
    if (conversationError || !updated) {
      console.error('Chat datechange conversation error:', conversationError)
      return NextResponse.json(
        { error: 'Could not update conversation' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        conversation: updated as Conversation,
        messageCount: shiftedMessages.length,
      },
    })
  } catch (error) {
    console.error('Chat datechange error:', error)
    return NextResponse.json(
      { error: 'Could not change conversation dates' },
      { status: 500 },
    )
  }
}
