import { createServiceRoleClient } from '../lib/supabase/server'

async function main() {
  const service = createServiceRoleClient()
  if (!service) {
    console.error('Supabase not configured')
    process.exit(1)
  }

  // Find the conversation
  const { data: conversations, error: findError } = await service
    .from('conversations')
    .select('*')
    .eq('customer_email', 'test@gmail.com')
    .eq('customer_phone', '123123123123')

  if (findError) {
    console.error('Error finding conversation:', findError)
    process.exit(1)
  }

  if (!conversations || conversations.length === 0) {
    console.log('No conversation found with email test@gmail.com')
    process.exit(0)
  }

  console.log(`Found ${conversations.length} conversation(s):`)
  for (const conv of conversations) {
    console.log(`  - ID: ${conv.id}, Name: ${conv.customer_name}, Status: ${conv.status}`)
  }

  // Delete messages first
  for (const conv of conversations) {
    const { error: msgError } = await service
      .from('messages')
      .delete()
      .eq('conversation_id', conv.id)

    if (msgError) {
      console.error(`Error deleting messages for ${conv.id}:`, msgError)
      continue
    }
    console.log(`Deleted messages for conversation ${conv.id}`)
  }

  // Delete conversations
  for (const conv of conversations) {
    const { error: convError } = await service
      .from('conversations')
      .delete()
      .eq('id', conv.id)

    if (convError) {
      console.error(`Error deleting conversation ${conv.id}:`, convError)
      continue
    }
    console.log(`Deleted conversation ${conv.id}`)
  }

  console.log('Done!')
}

main()
