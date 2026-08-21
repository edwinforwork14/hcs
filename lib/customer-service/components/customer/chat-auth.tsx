'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  CustomerLoginSchema,
  CustomerSignUpSchema,
} from '@/lib/validations/chat'

type AuthMode = 'signin' | 'signup'

interface AuthFormValues {
  name: string
  email: string
  phone: string
  password: string
}

interface ChatAuthProps {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<boolean>
  resendConfirmation: (email: string) => Promise<void>
}

/** Returns the GoTrue error code (if any) from a thrown auth error. */
function getAuthErrorCode(error: unknown): string | null {
  const code = (error as { code?: string } | null)?.code
  return typeof code === 'string' && code ? code : null
}

export function ChatAuth({
  signIn,
  signUp,
  resendConfirmation,
}: ChatAuthProps) {
  const { t } = useLanguage()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [resending, setResending] = useState(false)

  const authSchema = mode === 'signin' ? CustomerLoginSchema : CustomerSignUpSchema

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema) as Resolver<AuthFormValues>,
    defaultValues: { name: '', email: '', phone: '', password: '' },
  })

  const switchMode = (next: AuthMode) => {
    if (next === mode) return
    setMode(next)
    setConfirmation(false)
    form.clearErrors()
  }

  const handleSubmit = async (values: AuthFormValues) => {
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        await signIn(values.email, values.password)
        // Success: the auth hook flips to "authenticated" and the widget
        // swaps this form for the conversation form.
      } else {
        const sessionCreated = await signUp(
          values.name,
          values.email,
          values.phone,
          values.password,
        )
        if (!sessionCreated) setConfirmation(true)
      }
    } catch (error) {
      const code = getAuthErrorCode(error)
      if (code === 'user_already_exists') {
        toast.error(t('chat.auth.accountExists'))
        switchMode('signin')
      } else if (code === 'email_not_confirmed') {
        setConfirmation(true)
      } else if (code === 'signup_disabled') {
        toast.error(t('chat.auth.signupDisabled'))
      } else if (
        code === 'over_email_send_rate_limit' ||
        code === 'over_request_rate_limit'
      ) {
        toast.error(t('chat.auth.rateLimit'))
      } else if (code === 'invalid_credentials') {
        toast.error(t('chat.auth.invalidCredentials'))
      } else {
        // Unknown cause (e.g. CORS/network or a different Supabase project in
        // production): surface the provider's own message so it is visible
        // instead of a generic one.
        const rawMessage =
          error instanceof Error &&
          error.message &&
          error.message !== 'Failed to fetch'
            ? error.message
            : null
        toast.error(
          rawMessage ??
            (mode === 'signin'
              ? t('chat.auth.invalidCredentials')
              : t('chat.auth.signUpFailed')),
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    const email = form.getValues('email')
    if (!email) return
    setResending(true)
    try {
      await resendConfirmation(email)
      toast.success(t('chat.auth.confirmationSent'))
    } catch {
      toast.error(t('chat.auth.resendFailed'))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{t('chat.auth.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('chat.auth.subtitle')}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button
          type="button"
          onClick={() => switchMode('signin')}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            mode === 'signin'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t('chat.auth.tabSignIn')}
        </button>
        <button
          type="button"
          onClick={() => switchMode('signup')}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            mode === 'signup'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t('chat.auth.tabSignUp')}
        </button>
      </div>

      {confirmation ? (
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            {t('chat.auth.confirmationRequired')}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={resending}
            className="w-full cursor-pointer"
            onClick={handleResend}
          >
            {resending && <Loader2 className="size-4 animate-spin" />}
            {t('chat.auth.resendConfirmation')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => switchMode('signin')}
          >
            {t('chat.auth.signIn')}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('chat.auth.name')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={submitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('chat.auth.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      autoComplete="email"
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('chat.auth.phone')}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 555 000 0000"
                        autoComplete="tel"
                        disabled={submitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('chat.auth.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete={
                        mode === 'signin' ? 'current-password' : 'new-password'
                      }
                      disabled={submitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full cursor-pointer bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429]"
            >
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting
                ? mode === 'signin'
                  ? t('chat.auth.signingIn')
                  : t('chat.auth.signingUp')
                : mode === 'signin'
                  ? t('chat.auth.signIn')
                  : t('chat.auth.signUp')}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
