import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseConfig } from '../../adapters/supabase'
import { StartConversationSchema } from '@/lib/validations/chat'

function getWelcomeMessage(name: string, language: 'en' | 'es'): string {
  if (language === 'es') {
    return `¡Hola ${name}! Gracias por escribir al Soporte. Un especialista te atenderá en breve.`
  }
  return `Hi ${name}! Thanks for contacting Support. A specialist will be with you shortly.`
}

const StartChatRequestSchema = StartConversationSchema.extend({
  customerLocation: z.string().trim().max(100).optional().or(z.literal('')),
  language: z.enum(['en', 'es']).default('en'),
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
    const parsed = StartChatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid conversation data' },
        { status: 400 }
      )
    }

    const { customerName, customerEmail, customerPhone, customerLocation, language } = parsed.data

    const existing = await config.repositories.conversation.findOpenByEmail(customerEmail)
    if (existing) {
      return NextResponse.json({
        success: true,
        data: { conversation: existing, welcomeMessage: null },
      })
    }

    const conversation = await config.repositories.conversation.create({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      customer_location: customerLocation || null,
      customer_language: language,
    })

    const welcomeMessage = await config.repositories.message.create({
      conversation_id: conversation.id,
      sender_type: 'admin',
      content: getWelcomeMessage(customerName, language),
    })

    return NextResponse.json({
      success: true,
      data: { conversation, welcomeMessage },
    })
  } catch (error) {
    console.error('Chat start API error:', error)
    return NextResponse.json({ error: 'Could not start the conversation' }, { status: 500 })
  }
}
