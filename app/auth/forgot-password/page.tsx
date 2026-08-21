'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/context/language-context'
import { useAuth } from '@/hooks/use-auth'
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations/auth'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const { forgotPassword } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const handleSubmit = async (values: ForgotPasswordInput) => {
    setSubmitting(true)
    try {
      await forgotPassword(values)
      toast.success(t('auth.forgotPassword.success'))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('auth.forgotPassword.error'),
      )
    } finally {
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
            <Lock className="size-6" />
          </div>
          <h1 className="mt-4 text-lg font-semibold">{t('auth.forgotPassword.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('auth.forgotPassword.subtitle')}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">{t('auth.forgotPassword.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="forgot-email"
                type="email"
                placeholder="admin@hcstradingllc.org"
                autoComplete="email"
                disabled={submitting}
                className="pl-9"
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full cursor-pointer">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? t('auth.forgotPassword.submitting') : t('auth.forgotPassword.submit')}
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