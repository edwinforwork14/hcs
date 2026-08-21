import type {
  ConversationRepository,
  MessageRepository,
  CustomerRepository,
  AgentRepository,
  AttachmentRepository,
  AuthProvider,
  RealtimeProvider,
  PresenceProvider,
  StorageProvider,
  PermissionProvider,
  NotificationProvider,
} from '../core/interfaces'
import type { CustomerServiceTheme } from '../theme/types'

export interface CustomerServiceConfig {
  repositories: {
    conversation: ConversationRepository
    message: MessageRepository
    customer: CustomerRepository
    agent: AgentRepository
    attachment: AttachmentRepository
  }
  anonRepositories?: {
    conversation: ConversationRepository
    message: MessageRepository
    customer: CustomerRepository
    agent: AgentRepository
    attachment: AttachmentRepository
  }

  providers: {
    auth: AuthProvider
    realtime: RealtimeProvider
    presence: PresenceProvider
    storage: StorageProvider
    permission: PermissionProvider
    notification?: NotificationProvider
  }

  brandName?: string
  theme?: CustomerServiceTheme
  translations?: Record<string, Record<string, string>>
  defaultLanguage?: 'en' | 'es'
  storageKey?: string
  presenceChannel?: string
  adminRoute?: string
  forgotPasswordUrl?: string
  maxAttachmentSize?: number
  allowedAttachmentTypes?: string[]

  features?: {
    enableAuth?: boolean
    enableAttachments?: boolean
    enablePresence?: boolean
    enableNotifications?: boolean
    enableDateChange?: boolean
  }
}
