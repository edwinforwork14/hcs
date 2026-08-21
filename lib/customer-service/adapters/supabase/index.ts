import { getSupabaseBrowserClient, getSupabaseAnonClient } from './client'
import { SupabaseConversationRepository } from './repositories/conversation-repository'
import { SupabaseMessageRepository } from './repositories/message-repository'
import { SupabaseCustomerRepository } from './repositories/customer-repository'
import { SupabaseAgentRepository } from './repositories/agent-repository'
import { SupabaseAttachmentRepository } from './repositories/attachment-repository'
import { SupabaseAuthProvider } from './providers/auth-provider'
import { SupabaseRealtimeProvider } from './providers/realtime-provider'
import { SupabasePresenceProvider } from './providers/presence-provider'
import { SupabaseStorageProvider } from './providers/storage-provider'
import { SupabasePermissionProvider } from './providers/permission-provider'
import type { CustomerServiceConfig } from '../../config/types'

export * from './client'
export * from './types'
export * from './repositories/conversation-repository'
export * from './repositories/message-repository'
export * from './repositories/customer-repository'
export * from './repositories/agent-repository'
export * from './repositories/attachment-repository'
export * from './providers/auth-provider'
export * from './providers/realtime-provider'
export * from './providers/presence-provider'
export * from './providers/storage-provider'
export * from './providers/permission-provider'

export interface SupabaseConfigOptions {
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseServiceRoleKey?: string
  forgotPasswordUrl?: string
}

export function createSupabaseConfig(options?: Partial<SupabaseConfigOptions>): CustomerServiceConfig {
  const supabaseUrl = options?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = options?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabaseServiceRoleKey = options?.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY
  const forgotPasswordUrl = options?.forgotPasswordUrl
  const isServer = typeof window === 'undefined'

  // Standard client (session-aware on browser, service role or normal on server)
  const clientGetter = () => {
    if (isServer) {
      const { createClient } = require('@supabase/supabase-js')
      const key = supabaseServiceRoleKey || supabaseAnonKey
      return createClient(supabaseUrl, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    }
    return getSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  // Anon client (session-less, always anon role)
  const anonClientGetter = () => {
    if (isServer) {
      const { createClient } = require('@supabase/supabase-js')
      return createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    }
    return getSupabaseAnonClient(supabaseUrl, supabaseAnonKey)
  }

  const redirectUrlGetter = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/auth/reset-password`
    }
    return '/auth/reset-password'
  }

  return {
    repositories: {
      conversation: new SupabaseConversationRepository(clientGetter),
      message: new SupabaseMessageRepository(clientGetter),
      customer: new SupabaseCustomerRepository(clientGetter),
      agent: new SupabaseAgentRepository(clientGetter),
      attachment: new SupabaseAttachmentRepository(clientGetter),
    },
    anonRepositories: {
      conversation: new SupabaseConversationRepository(anonClientGetter),
      message: new SupabaseMessageRepository(anonClientGetter),
      customer: new SupabaseCustomerRepository(anonClientGetter),
      agent: new SupabaseAgentRepository(anonClientGetter),
      attachment: new SupabaseAttachmentRepository(anonClientGetter),
    },
    providers: {
      auth: new SupabaseAuthProvider(clientGetter, redirectUrlGetter),
      realtime: new SupabaseRealtimeProvider(clientGetter),
      presence: new SupabasePresenceProvider(clientGetter),
      storage: new SupabaseStorageProvider(clientGetter),
      permission: new SupabasePermissionProvider(clientGetter),
    },
    brandName: 'HCS Support',
    forgotPasswordUrl: forgotPasswordUrl || '/auth/forgot-password',
  }
}
