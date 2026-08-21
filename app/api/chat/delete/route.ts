import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getAdminAuth } from '@/lib/admin-auth'
import { createServiceRoleClient } from '@/lib/supabase/server'

const DeleteConversationSchema = z.object({
  conversationId: z.string().uuid(),
})

export async function DELETE(request: Request) {
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
    const parsed = DeleteConversationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid data' },
        { status: 400 },
      )
    }

    const { conversationId } = parsed.data

    // Delete messages first (foreign key), then the conversation.
    await service.from('messages').delete().eq('conversation_id', conversationId)
    await service.from('conversations').delete().eq('id', conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete conversation API error:', error)
    return NextResponse.json({ error: 'Could not delete conversation' }, { status: 500 })
  }
}
