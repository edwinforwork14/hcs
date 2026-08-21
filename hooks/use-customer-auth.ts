'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

import { getCustomerAuthClient } from '@/lib/supabase/client'

export type CustomerAuthStatus =
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'

export interface CustomerAuthUser {
  id: string
  email: string
  name?: string
  phone?: string
}

function toUser(session: Session | null): CustomerAuthUser | null {
  if (!session?.user) return null
  const metadata = session.user.user_metadata as Record<string, unknown> | null
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: typeof metadata?.full_name === 'string' ? metadata.full_name : undefined,
    phone:
      typeof metadata?.phone === 'string' && metadata.phone.trim()
        ? metadata.phone.trim()
        : undefined,
  }
}

/**
 * Tracks the customer's Supabase Auth session (isolated storage key) and
 * exposes sign-in / sign-up / sign-out helpers for the chat widget.
 */
export function useCustomerAuth() {
  const [status, setStatus] = useState<CustomerAuthStatus>('loading')
  const [user, setUser] = useState<CustomerAuthUser | null>(null)

  useEffect(() => {
    const supabase = getCustomerAuthClient()
    let cancelled = false

    const sync = (session: Session | null) => {
      if (cancelled) return
      setUser(toUser(session))
      setStatus(session ? 'authenticated' : 'unauthenticated')
    }

    supabase.auth.getSession().then(({ data }) => sync(data.session))

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => sync(session),
    )

    return () => {
      cancelled = true
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getCustomerAuthClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }, [])

  const signUp = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      const { data, error } = await getCustomerAuthClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: name, phone } },
      })
      if (error) throw error
      // Depending on the supabase-js version, an existing account is either
      // reported as an error or as a user with an empty `identities` array.
      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        const exists = new Error('Account already exists')
        ;(exists as { code?: string }).code = 'user_already_exists'
        throw exists
      }
      // When email confirmation is enabled Supabase returns no session until
      // the visitor confirms; the caller shows a "check your email" message.
      return Boolean(data.session)
    },
    [],
  )

  const signOut = useCallback(async () => {
    const { error } = await getCustomerAuthClient().auth.signOut()
    if (error) throw error
  }, [])

  const resendConfirmation = useCallback(async (email: string) => {
    const { error } = await getCustomerAuthClient().auth.resend({
      type: 'signup',
      email,
    })
    if (error) throw error
  }, [])

  return { status, user, signIn, signUp, signOut, resendConfirmation }
}
