'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, MessageCircle, Globe } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomerService } from '../../context'
import { useAuth } from '../../hooks'
import {
  AdminLoginSchema,
  type AdminLoginInput,
} from '@/lib/validations/chat'

export function LoginForm() {
  const { language, setLanguage, t } = useCustomerService()
  const { login } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = async (values: AdminLoginInput) => {
    setSubmitting(true)
    try {
      await login({
        email: values.email,
        password: values.password,
      })
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('admin.signInFailed'),
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-6">
      <div className="relative w-full max-w-sm rounded-xl border bg-background p-8 shadow-sm">
        <div className="absolute right-4 top-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="cursor-pointer border-0"
            title={language === 'en' ? 'Español' : 'English'}
          >
            <Globe className="size-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-col items-center text-center">
          <div
            style={{
              background: 'linear-gradient(to right, var(--cs-primary, #D90429), var(--cs-secondary, #FF4D6A))',
            }}
            className="flex size-12 items-center justify-center rounded-full text-white"
          >
            <MessageCircle className="size-6 text-white" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-foreground">{t('admin.login.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('admin.login.subtitle')}
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="login-email">{t('admin.email')}</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="admin@hcstradingllc.org"
              autoComplete="email"
              disabled={submitting}
              className="bg-background text-foreground"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">{t('admin.password')}</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
              className="bg-background text-foreground"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer text-white"
            style={{
              background: 'linear-gradient(to right, var(--cs-primary, #D90429), var(--cs-secondary, #FF4D6A))',
            }}
          >
            {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
            {submitting ? t('admin.signingIn') : t('admin.signIn')}
          </Button>
        </form>

        <Button asChild variant="ghost" className="mt-4 w-full cursor-pointer text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="size-4 mr-2" /> {t('admin.backToSite')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
