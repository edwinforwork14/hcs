import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/server'

const PathSchema = z.object({
  path: z.string().trim().min(1).max(500),
})

export async function POST(request: Request) {
  try {
    const service = createServiceRoleClient()
    if (!service) {
      return NextResponse.json({ error: 'Chat service not configured' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    const parsed = PathSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const { path } = parsed.data
    if (!path.startsWith('conversations/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const { data, error } = await service.storage
      .from('chat-attachments')
      .createSignedUrl(path, 60 * 60) // 1 hour

    if (error || !data?.signedUrl) {
      console.error('Attachment URL API error:', error)
      return NextResponse.json({ error: 'Could not generate link' }, { status: 500 })
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    console.error('Attachment URL API error:', error)
    return NextResponse.json({ error: 'Could not generate link' }, { status: 500 })
  }
}
