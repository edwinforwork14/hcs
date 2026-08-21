'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/language-context'
import { getSupabaseClient } from '@/lib/supabase/client'

interface SignOutButtonProps {
  /** Compact icon-only button for tight headers (e.g. the dashboard sidebar). */
  iconOnly?: boolean
}

export function SignOutButton({ iconOnly = false }: SignOutButtonProps) {
  const { t } = useLanguage()
  const router = useRouter()

  const handleSignOut = async () => {
    await getSupabaseClient().auth.signOut()
    router.refresh()
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleSignOut}
        aria-label={t('admin.signOut')}
        title={t('admin.signOut')}
        className="cursor-pointer text-muted-foreground hover:text-foreground"
      >
        <LogOut className="size-4" />
      </Button>
    )
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      <LogOut className="size-4" /> {t('admin.signOut')}
    </Button>
  )
}
