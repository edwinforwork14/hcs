import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseConfig } from '../../adapters/supabase'

const PathSchema = z.object({
  path: z.string().trim().min(1).max(500),
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
    const parsed = PathSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const { path } = parsed.data
    if (!path.startsWith('conversations/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const downloadUrl = await config.repositories.attachment.getDownloadUrl(path)

    return NextResponse.json({ url: downloadUrl })
  } catch (error) {
    console.error('Attachment URL API error:', error)
    return NextResponse.json({ error: 'Could not generate link' }, { status: 500 })
  }
}
