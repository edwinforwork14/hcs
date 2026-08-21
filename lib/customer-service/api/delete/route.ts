import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseConfig } from '../../adapters/supabase'

const DeleteConversationSchema = z.object({
  conversationId: z.string().uuid(),
})

export async function DELETE(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !anonKey || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const config = createSupabaseConfig({
      supabaseUrl: url,
      supabaseAnonKey: anonKey,
      supabaseServiceRoleKey: serviceRoleKey,
    })

    const body = await request.json().catch(() => null)
    const parsed = DeleteConversationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }

    const { conversationId } = parsed.data

    await config.repositories.conversation.delete(conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete conversation API error:', error)
    return NextResponse.json({ error: 'Could not delete conversation' }, { status: 500 })
  }
}
