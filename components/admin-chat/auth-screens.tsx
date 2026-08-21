import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LoginForm } from './login-form'
import { SignOutButton } from './sign-out-button'
import type { AdminAuthResult } from '@/lib/admin-auth'

export function ConfigNotice() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-lg font-semibold">Support Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Supabase is not configured. Set{' '}
          <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{' '}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in your environment, then run
          the migration in <code>supabase/schema.sql</code>.
        </p>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function AccessDenied({ email }: { email: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-lg font-semibold">Access denied</h1>
        <p className="text-sm text-muted-foreground">
          Your account (<strong>{email}</strong>) is not authorized to use the
          support dashboard. Ask a project admin to add your email to the{' '}
          <code>admins</code> table.
        </p>
        <div className="flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to site
            </Link>
          </Button>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

/** Render the correct gate screen for a getAdminAuth() result, or null. */
export function AdminAuthScreen({ auth }: { auth: AdminAuthResult }) {
  if (auth.status === 'not-configured') return <ConfigNotice />
  if (auth.status === 'not-authenticated') return <LoginGate />
  if (auth.status === 'not-admin') return <AccessDenied email={auth.email} />
  return null
}

function LoginGate() {
  return <LoginForm />
}
