import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getAdminAuth } from '@/lib/admin-auth'
import { createServiceRoleClient } from '@/lib/supabase/server'

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

    const service = createServiceRoleClient()
    if (!service) {
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
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

    const { conversationId } = parsed.data

    const { data: conversation } = await service
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle()
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

    // Shift all messages by the same delta to keep chronology intact.
    const { data: messages } = await service
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    const messageList = messages ?? []
    for (const message of messageList) {
      const shiftedAt = new Date(
        new Date(message.created_at).getTime() + deltaMs,
      ).toISOString()
      await service
        .from('messages')
        .update({ created_at: shiftedAt })
        .eq('id', message.id)
    }

    const shiftedUpdatedAt = new Date(
      new Date(conversation.updated_at).getTime() + deltaMs,
    ).toISOString()

    const { data: updated } = await service
      .from('conversations')
      .update({
        created_at: target.toISOString(),
        updated_at: shiftedUpdatedAt,
      })
      .eq('id', conversationId)
      .select()
      .single()

    return NextResponse.json({
      success: true,
      data: { conversation: updated, messageCount: messageList.length },
    })
  } catch (error) {
    console.error('Chat datechange error:', error)
    return NextResponse.json({ error: 'Could not change conversation dates' }, { status: 500 })
  }
}
