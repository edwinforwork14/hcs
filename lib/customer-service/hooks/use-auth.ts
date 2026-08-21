'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AuthUser } from '../core/interfaces'
import type { Customer } from '../core/domain'
import { useCustomerService } from '../context'

export function useAuth() {
  const { config } = useCustomerService()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const STORAGE_KEY = config.storageKey || 'hcs-chat-session'

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const data = await config.repositories.customer.findById(userId)
        if (data) {
          setProfile(data)
        } else {
          const authUser = await config.providers.auth.getCurrentUser()
          if (authUser && authUser.id === userId) {
            const fullName = authUser.email ? authUser.email.split('@')[0] : 'User'
            const email = authUser.email || ''
            const created = await config.repositories.customer.create({
              id: userId,
              full_name: fullName,
              email,
            })
            setProfile(created)
          } else {
            setProfile(null)
          }
        }
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    },
    [config.repositories.customer, config.providers.auth]
  )

  useEffect(() => {
    config.providers.auth.getCurrentUser().then((authUser) => {
      setUser(authUser)
      if (authUser) {
        fetchProfile(authUser.id)
      } else {
        setLoading(false)
      }
    })

    const unsubscribe = config.providers.auth.onAuthStateChange((authUser) => {
      setUser(authUser)
      if (authUser) {
        fetchProfile(authUser.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [config.providers.auth, fetchProfile])

  const register = useCallback(
    async (input: { email: string; password: string; fullName: string; phone?: string }) => {
      const authUser = await config.providers.auth.register(
        input.email,
        input.password,
        input.fullName,
        input.phone || null
      )

      try {
        const profile = await config.repositories.customer.create({
          id: authUser.id,
          full_name: input.fullName,
          email: input.email,
          phone: input.phone || null,
        })
        setProfile(profile)
      } catch {
        // Safe fallback in case profile already existed
        await fetchProfile(authUser.id)
      }

      return authUser
    },
    [config.providers.auth, config.repositories.customer, fetchProfile]
  )

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      await config.providers.auth.login(input.email, input.password)
    },
    [config.providers.auth]
  )

  const logout = useCallback(async () => {
    await config.providers.auth.logout()
    setUser(null)
    setProfile(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [config.providers.auth, STORAGE_KEY])

  const forgotPassword = useCallback(
    async (input: { email: string }) => {
      await config.providers.auth.forgotPassword(input.email)
    },
    [config.providers.auth]
  )

  const resetPassword = useCallback(
    async (input: { password: string }) => {
      await config.providers.auth.resetPassword(input.password)
    },
    [config.providers.auth]
  )

  return { user, profile, loading, register, login, logout, forgotPassword, resetPassword }
}
