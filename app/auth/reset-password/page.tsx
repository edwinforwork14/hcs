'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/context/language-context'
import { useAuth } from '@/hooks/use-auth'
import { getSupabaseClient } from '@/lib/supabase/client'
import { ResetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/auth'

function ResetPasswordForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  // Verify the token is valid by trying to get the session
  useEffect(() => {
    const verifyToken = async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) {
        setValidToken(true)
      } else {
        setValidToken(false)
        toast.error(t('auth.resetPassword.invalidToken'))
        router.push('/auth/forgot-password')
      }
      setCheckingToken(false)
    }
    verifyToken()
  }, [router, t])

  const handleSubmit = async (values: ResetPasswordInput) => {
    setSubmitting(true)
    try {
      await resetPassword(values)
      toast.success(t('auth.resetPassword.success'))
      router.push('/')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('auth.resetPassword.error'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (checkingToken) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] text-white">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </div>
    )
  }

  if (!validToken) {
    return null
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
          <h1 className="mt-4 text-lg font-semibold">{t('auth.resetPassword.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('auth.resetPassword.subtitle')}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-password">{t('auth.resetPassword.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="reset-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                className="pl-9"
                {...form.register('password')}
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-confirm-password">{t('auth.resetPassword.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="reset-confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={submitting}
                className="pl-9"
                {...form.register('confirmPassword')}
              />
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full cursor-pointer">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitting ? t('auth.resetPassword.submitting') : t('auth.resetPassword.submit')}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] text-white">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}