'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'

import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'
import type { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations/auth'

export interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const supabase = getSupabaseClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const supabase = getSupabaseClient()
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      if (data) {
        setProfile(data)
      } else {
        // Profile doesn't exist yet — create it from auth metadata
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (authUser) {
          const meta = authUser.user_metadata ?? {}
          const fullName: string =
            meta.full_name ?? meta.name ?? authUser.email?.split('@')[0] ?? 'User'
          const phone: string | null = meta.phone ?? null
          const email: string = authUser.email ?? ''
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({ id: userId, full_name: fullName, email, phone })
          if (!insertError) {
            setProfile({ id: userId, full_name: fullName, email, phone })
          } else {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      }
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const register = useCallback(async (input: RegisterInput) => {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          phone: input.phone || null,
        },
      },
    })
    if (error) throw error
    if (!data.user) throw new Error('Could not create user')

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: input.fullName,
        email: input.email,
        phone: input.phone || null,
      })
    if (profileError) throw profileError

    return data.user
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })
    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    // Clear any stale chat session from localStorage so the user
    // always starts fresh after logout.
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('hcs-chat-session')
    }
  }, [])

  /** Solicitar email de recuperación de contraseña */
  const forgotPassword = useCallback(async (input: ForgotPasswordInput) => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw error
  }, [])

  /** Restablecer contraseña con token (llamado desde la página de reset) */
  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.updateUser({
      password: input.password,
    })
    if (error) throw error
  }, [])

  return { user, profile, loading, register, login, logout, forgotPassword, resetPassword }
}
