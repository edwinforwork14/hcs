import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  isAllowedAttachmentType,
  MAX_ATTACHMENT_SIZE,
  sanitizeFileName,
} from '@/lib/attachments'
import { createServiceRoleClient } from '@/lib/supabase/server'

const UploadSchema = z.object({
  conversationId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  fileType: z.string().trim().min(1).max(100),
  fileSize: z.number().int().positive().max(MAX_ATTACHMENT_SIZE),
})

export async function POST(request: Request) {
  try {
    const service = createServiceRoleClient()
    if (!service) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = UploadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid upload data' },
        { status: 400 },
      )
    }

    const { conversationId, fileName, fileType, fileSize } = parsed.data

    if (!isAllowedAttachmentType(fileType)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
    }

    // The conversation must exist (UUIDs are unguessable, so this also keeps
    // files from being uploaded into conversations that do not exist).
    const { data: conversation } = await service
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle()
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const path = `conversations/${conversationId}/${crypto.randomUUID()}/${sanitizeFileName(fileName)}`

    const { data, error } = await service.storage
      .from('chat-attachments')
      .createSignedUploadUrl(path)
    if (error || !data) {
      console.error('Chat upload URL error:', error)
      return NextResponse.json(
        { error: 'Could not prepare upload' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: data.signedUrl,
        path: data.path,
      },
    })
  } catch (error) {
    console.error('Chat upload error:', error)
    return NextResponse.json(
      { error: 'Could not prepare upload' },
      { status: 500 },
    )
  }
}
