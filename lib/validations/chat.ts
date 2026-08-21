import { z } from 'zod'

/** A single chat message sent by either side. */
export const MessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(2000, { message: 'Message is too long (max 2000 characters)' }),
})

export type MessageInput = z.infer<typeof MessageSchema>

/** Details collected from the visitor before starting a conversation. */
export const StartConversationSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  customerEmail: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address' })
    .max(200, { message: 'Email is too long' }),
  customerPhone: z
    .string()
    .trim()
    .max(40, { message: 'Phone is too long' })
    .optional()
    .or(z.literal('')),
})

export type StartConversationInput = z.infer<typeof StartConversationSchema>

/** Admin sign-in form. */
export const AdminLoginSchema = z.object({
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(200),
})

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>

/** Customer sign-in (existing account). */
export const CustomerLoginSchema = z.object({
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(200),
})

export type CustomerLoginInput = z.infer<typeof CustomerLoginSchema>

/** Customer sign-up (new account). */
export const CustomerSignUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  phone: z
    .string()
    .trim()
    .max(40, { message: 'Phone is too long' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(200),
})

export type CustomerSignUpInput = z.infer<typeof CustomerSignUpSchema>

/** Attachment metadata attached to a message. */
export const AttachmentSchema = z.object({
  name: z.string().trim().min(1).max(255),
  size: z.number().int().positive(),
  type: z.string().trim().min(1).max(100),
  path: z.string().trim().min(1).max(500),
})

export type AttachmentInput = z.infer<typeof AttachmentSchema>
