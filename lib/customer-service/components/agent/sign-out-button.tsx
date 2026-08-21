'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCustomerService } from '../../context'
import { useAuth } from '../../hooks'

interface SignOutButtonProps {
  iconOnly?: boolean
}

export function SignOutButton({ iconOnly = false }: SignOutButtonProps) {
  const { t } = useCustomerService()
  const { logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await logout()
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
        className="cursor-pointer text-muted-foreground hover:text-foreground border-0"
      >
        <LogOut className="size-4" />
      </Button>
    )
  }

  return (
    <Button type="button" variant="outline" onClick={handleSignOut} className="cursor-pointer">
      <LogOut className="size-4 mr-2" /> {t('admin.signOut')}
    </Button>
  )
}
