'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User, Phone, UserPlus, LogIn } from 'lucide-react'

import { useCustomerService } from '../../context'
import { useAuth } from '../../hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  RegisterSchema,
  type RegisterInput,
  LoginSchema,
  type LoginInput,
} from '@/lib/validations/auth'

interface ChatAuthProps {
  onStart: (input: {
    customerName: string
    customerEmail: string
    customerPhone?: string
  }) => Promise<void>
}

export function ChatAuth({ onStart }: ChatAuthProps) {
  const { config, t } = useCustomerService()
  const { profile, login, register } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [authCompleted, setAuthCompleted] = useState(false)
  const startCalledRef = useRef(false)

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '' },
  })

  useEffect(() => {
    if (profile && authCompleted && !startCalledRef.current) {
      startCalledRef.current = true
      onStart({
        customerName: profile.full_name,
        customerEmail: profile.email,
        customerPhone: profile.phone ?? '',
      }).catch(() => {
        startCalledRef.current = false
      })
    }
  }, [profile, authCompleted, onStart])

  useEffect(() => {
    if (profile && !authCompleted) {
      setAuthCompleted(true)
    }
  }, [profile, authCompleted])

  if (profile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const handleLogin = async (values: LoginInput) => {
    setSubmitting(true)
    try {
      await login(values)
      setAuthCompleted(true)
      toast.success(t('auth.login.success'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('auth.login.error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (values: RegisterInput) => {
    setSubmitting(true)
    try {
      await register(values)
      setAuthCompleted(true)
      toast.success(t('auth.register.success'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('auth.register.error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const gradientBg = {
    background: 'linear-gradient(to right, var(--cs-primary, #D90429), var(--cs-secondary, #FF4D6A))'
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{t('chat.startTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('chat.startSubtitle')}
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('login')}
          style={tab === 'login' ? gradientBg : undefined}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'login'
              ? 'text-white'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <LogIn className="size-4" />
          {t('auth.login.submit')}
        </button>
        <button
          onClick={() => setTab('register')}
          style={tab === 'register' ? gradientBg : undefined}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === 'register'
              ? 'text-white'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <UserPlus className="size-4" />
          {t('auth.register.submit')}
        </button>
      </div>

      {/* Login form */}
      {tab === 'login' && (
        <form
          onSubmit={loginForm.handleSubmit(handleLogin)}
          className="flex flex-col gap-3"
        >
          <div className="space-y-1">
            <Label htmlFor="chat-login-email" className="text-xs text-gray-400">
              {t('auth.login.email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-login-email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...loginForm.register('email')}
              />
            </div>
            {loginForm.formState.errors.email && (
              <p className="text-xs text-destructive">
                {loginForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="chat-login-password"
              className="text-xs text-gray-400"
            >
              {t('auth.login.password')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...loginForm.register('password')}
              />
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-xs text-destructive">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push(config.forgotPasswordUrl || '/auth/forgot-password')}
              className="text-xs hover:underline cursor-pointer"
              style={{ color: 'var(--cs-primary, #D90429)' }}
            >
              {t('auth.login.forgotPassword')}
            </button>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            style={gradientBg}
            className="mt-1 w-full h-9 cursor-pointer hover:opacity-90 border-0"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? t('auth.login.submitting') : t('auth.login.submit')}
          </Button>
        </form>
      )}

      {/* Register form */}
      {tab === 'register' && (
        <form
          onSubmit={registerForm.handleSubmit(handleRegister)}
          className="flex flex-col gap-3"
        >
          <div className="space-y-1">
            <Label
              htmlFor="chat-reg-name"
              className="text-xs text-gray-400"
            >
              {t('auth.register.fullName')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-reg-name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...registerForm.register('fullName')}
              />
            </div>
            {registerForm.formState.errors.fullName && (
              <p className="text-xs text-destructive">
                {registerForm.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="chat-reg-email"
              className="text-xs text-gray-400"
            >
              {t('auth.register.email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-reg-email"
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...registerForm.register('email')}
              />
            </div>
            {registerForm.formState.errors.email && (
              <p className="text-xs text-destructive">
                {registerForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="chat-reg-phone"
              className="text-xs text-gray-400"
            >
              {t('auth.register.phone')}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-reg-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...registerForm.register('phone')}
              />
            </div>
            {registerForm.formState.errors.phone && (
              <p className="text-xs text-destructive">
                {registerForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="chat-reg-password"
              className="text-xs text-gray-400"
            >
              {t('auth.register.password')}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="chat-reg-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                className="h-9 pl-9 text-sm"
                {...registerForm.register('password')}
              />
            </div>
            {registerForm.formState.errors.password && (
              <p className="text-xs text-destructive">
                {registerForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            style={gradientBg}
            className="mt-1 w-full h-9 cursor-pointer hover:opacity-90 border-0"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting
              ? t('auth.register.submitting')
              : t('auth.register.submit')}
          </Button>
        </form>
      )}
    </div>
  )
}
