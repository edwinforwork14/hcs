import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/server'

const DeleteConversationSchema = z.object({
  conversationId: z.string().uuid(),
})

export async function DELETE(request: Request) {
  const service = createServiceRoleClient()
  if (!service) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 },
    )
  }

  const body = await request.json()
  const parsed = DeleteConversationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? 'Invalid data' },
      { status: 400 },
    )
  }

  const { conversationId } = parsed.data

  // First delete all messages in the conversation
  const { error: messagesError } = await service
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId)

  if (messagesError) {
    return NextResponse.json(
      { error: 'Failed to delete messages' },
      { status: 500 },
    )
  }

  // Then delete the conversation itself
  const { error: conversationError } = await service
    .from('conversations')
    .delete()
    .eq('id', conversationId)

  if (conversationError) {
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
