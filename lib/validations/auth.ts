import { z } from 'zod'

/** Registro de usuario */
export const RegisterSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name is too long' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address' })
    .max(200, { message: 'Email is too long' }),
  phone: z
    .string()
    .trim()
    .max(40, { message: 'Phone is too long' })
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(200, { message: 'Password is too long' }),
})

export type RegisterInput = z.infer<typeof RegisterSchema>

/** Inicio de sesión */
export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(200),
})

export type LoginInput = z.infer<typeof LoginSchema>
