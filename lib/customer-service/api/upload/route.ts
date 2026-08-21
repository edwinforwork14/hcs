import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseConfig } from '../../adapters/supabase'

const UploadSchema = z.object({
  conversationId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  fileType: z.string().trim().min(1).max(100),
  fileSize: z.number().int().positive(),
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
    const parsed = UploadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid upload data' },
        { status: 400 }
      )
    }

    const { conversationId, fileName, fileType, fileSize } = parsed.data

    const conversation = await config.repositories.conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const data = await config.repositories.attachment.getUploadUrl(
      conversationId,
      fileName,
      fileType,
      fileSize
    )

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Chat upload API error:', error)
    return NextResponse.json({ error: 'Could not prepare upload' }, { status: 500 })
  }
}
