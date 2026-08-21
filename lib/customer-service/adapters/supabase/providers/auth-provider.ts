import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { AuthProvider, AuthUser } from '../../../core/interfaces'

export class SupabaseAuthProvider implements AuthProvider {
  constructor(
    private getClient: () => SupabaseClient<Database>,
    private getResetPasswordRedirectUrl: () => string
  ) {}

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await this.getClient().auth.getUser()
    if (error || !user) return null
    return { id: user.id, email: user.email }
  }

  async login(email: string, password: string): Promise<void> {
    const { error } = await this.getClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  async logout(): Promise<void> {
    const { error } = await this.getClient().auth.signOut()
    if (error) throw error
  }

  async register(
    email: string,
    password: string,
    fullName: string,
    phone?: string | null
  ): Promise<AuthUser> {
    const { data, error } = await this.getClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    })
    if (error) throw error
    if (!data.user) throw new Error('Could not create user')
    return { id: data.user.id, email: data.user.email }
  }

  async forgotPassword(email: string): Promise<void> {
    const { error } = await this.getClient().auth.resetPasswordForEmail(email, {
      redirectTo: this.getResetPasswordRedirectUrl(),
    })
    if (error) throw error
  }

  async resetPassword(password: string): Promise<void> {
    const { error } = await this.getClient().auth.updateUser({
      password,
    })
    if (error) throw error
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const { data: { subscription } } = this.getClient().auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user
        callback(user ? { id: user.id, email: user.email } : null)
      }
    )
    return () => subscription.unsubscribe()
  }
}
