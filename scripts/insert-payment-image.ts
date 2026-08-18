import { readFileSync } from 'fs'
import { createServiceRoleClient } from '../lib/supabase/server'
import type { Message } from '../types/chat'

async function main() {
  const service = createServiceRoleClient()
  if (!service) {
    console.error('Supabase not configured')
    process.exit(1)
  }

  // 1. Find the conversation
  const { data: conversations, error: convError } = await service
    .from('conversations')
    .select('*')
    .ilike('customer_name', '%MARIBETH%DIAZ%')
    .limit(1)

  if (convError || !conversations || conversations.length === 0) {
    console.error('Conversation not found:', convError)
    process.exit(1)
  }

  const conversation = conversations[0]
  console.log(`Found conversation: ${conversation.id} - ${conversation.customer_name}`)

  // 2. Get all messages ordered by created_at
  const { data: messages, error: msgError } = await service
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })

  if (msgError || !messages) {
    console.error('Error fetching messages:', msgError)
    process.exit(1)
  }

  console.log(`Found ${messages.length} messages`)

  // 3. Find the two boundary messages
  const welcomeMsg = messages.find(m =>
    m.content.includes('Hi MARIBETH C DIAZ!')
  )
  const confirmMsg = messages.find(m =>
    m.content.includes('Confirmado  de manera exitosa')
  )

  if (!welcomeMsg || !confirmMsg) {
    console.error('Could not find boundary messages')
    console.log('Messages found:')
    messages.forEach(m => console.log(`  - ${m.id}: ${m.content.substring(0, 60)}...`))
    process.exit(1)
  }

  console.log(`Welcome message: ${welcomeMsg.id} at ${welcomeMsg.created_at}`)
  console.log(`Confirm message: ${confirmMsg.id} at ${confirmMsg.created_at}`)

  // 4. Calculate the timestamp (19:45 on the same day as the welcome message)
  const welcomeDate = new Date(welcomeMsg.created_at)
  const paymentTime = new Date(welcomeDate)
  paymentTime.setHours(19, 45, 0, 0)

  console.log(`Payment time: ${paymentTime.toISOString()}`)

  // 5. Read the image file
  const imageBuffer = readFileSync('./pago.png')
  const fileName = 'pago.png'
  const fileType = 'image/png'
  const fileSize = imageBuffer.length

  // 6. Upload to Supabase Storage
  const filePath = `conversations/${conversation.id}/${crypto.randomUUID()}/${fileName}`
  const { error: uploadError } = await service.storage
    .from('chat-attachments')
    .upload(filePath, imageBuffer, {
      contentType: fileType,
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    process.exit(1)
  }

  console.log(`Uploaded to: ${filePath}`)

  // 7. Create the message with attachment
  const content = JSON.stringify({
    attachment: {
      name: fileName,
      size: fileSize,
      type: fileType,
      path: filePath,
    },
    text: '',
  })

  const { data: newMessage, error: insertError } = await service
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      sender_type: 'admin',
      content: content,
      created_at: paymentTime.toISOString(),
    })
    .select()
    .single()

  if (insertError) {
    console.error('Insert error:', insertError)
    process.exit(1)
  }

  console.log(`Created message: ${newMessage.id} at ${newMessage.created_at}`)
  console.log('Done!')
}

main()
