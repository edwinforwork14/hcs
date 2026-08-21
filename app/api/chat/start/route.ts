import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { StartConversationSchema } from '@/lib/validations/chat'

// ---------------------------------------------------------------------------
// Customize the automatic welcome message sent to every new visitor here.
// The visitor's language comes from the widget (en / es).
// ---------------------------------------------------------------------------
function getWelcomeMessage(name: string, language: 'en' | 'es'): string {
  if (language === 'es') {
    return `¡Hola ${name}! Gracias por escribir al Soporte HCS. Un especialista te atenderá en breve.`
  }
  return `Hi ${name}! Thanks for contacting HCS Support. A specialist will be with you shortly.`
}

const StartChatRequestSchema = StartConversationSchema.extend({
  customerLocation: z.string().trim().max(100).optional().or(z.literal('')),
  language: z.enum(['en', 'es']).default('en'),
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
    const parsed = StartChatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.errors[0]?.message ?? 'Invalid conversation data',
        },
        { status: 400 },
      )
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      language,
    } = parsed.data

    // Check for an existing open conversation for this email.
    const { data: existing } = await service
      .from('conversations')
      .select('*')
      .eq('customer_email', customerEmail)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({
        success: true,
        data: { conversation: existing, welcomeMessage: null },
      })
    }

    // Create the conversation.
    const { data: conversation, error: convError } = await service
      .from('conversations')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        customer_location: customerLocation || null,
        customer_language: language,
        status: 'open',
      })
      .select()
      .single()

    if (convError || !conversation) {
      console.error('Conversation create error:', convError)
      return NextResponse.json(
        { error: 'Could not create conversation' },
        { status: 500 },
      )
    }

    // Insert the automatic welcome message.
    const { data: welcomeMessage, error: msgError } = await service
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'admin',
        content: getWelcomeMessage(customerName, language),
      })
      .select()
      .single()

    if (msgError) {
      console.error('Welcome message error:', msgError)
      // Conversation was created; return it even if the welcome message failed.
    }

    return NextResponse.json({
      success: true,
      data: { conversation, welcomeMessage: welcomeMessage ?? null },
    })
  } catch (error) {
    console.error('Chat start API error:', error)
    return NextResponse.json(
      { error: 'Could not start the conversation' },
      { status: 500 },
    )
  }
}
