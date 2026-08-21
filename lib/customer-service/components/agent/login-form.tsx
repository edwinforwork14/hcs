'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/context/language-context'
import { getSupabaseClient } from '@/lib/supabase/client'
import {
  AdminLoginSchema,
  type AdminLoginInput,
} from '@/lib/validations/chat'

export function LoginForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = async (values: AdminLoginInput) => {
    setSubmitting(true)
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) throw error
      // Re-run the server component to pick up the new session.
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
          <LanguageToggle variant="panel" />
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] text-white">
            <MessageCircle className="size-6" />
          </div>
          <h1 className="mt-4 text-lg font-semibold">{t('admin.login.title')}</h1>
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
            className="w-full cursor-pointer"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? t('admin.signingIn') : t('admin.signIn')}
          </Button>
        </form>

        <Button asChild variant="ghost" className="mt-4 w-full cursor-pointer">
          <Link href="/">
            <ArrowLeft className="size-4" /> {t('admin.backToSite')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
