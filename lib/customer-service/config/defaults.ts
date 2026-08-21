import type { CustomerServiceConfig } from './types'

export const DEFAULT_CONFIG = {
  brandName: 'HCS Support',
  defaultLanguage: 'en' as const,
  storageKey: 'hcs-chat-session',
  presenceChannel: 'support-presence',
  adminRoute: '/admin/support',
  forgotPasswordUrl: '/auth/forgot-password',
  maxAttachmentSize: 25 * 1024 * 1024, // 25MB
  allowedAttachmentTypes: [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
  ],
  features: {
    enableAuth: true,
    enableAttachments: true,
    enablePresence: true,
    enableNotifications: true,
    enableDateChange: false,
  },
}
