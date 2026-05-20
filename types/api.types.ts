export interface ContactFormPayload {
  fullName: string
  email: string
  company?: string
  phone?: string
  message: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  messageId?: string
}
