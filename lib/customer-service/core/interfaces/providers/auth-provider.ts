export interface AuthUser {
  id: string
  email?: string
}

export interface AuthProvider {
  getCurrentUser(): Promise<AuthUser | null>
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  register(
    email: string,
    password: string,
    fullName: string,
    phone?: string | null
  ): Promise<AuthUser>
  forgotPassword(email: string): Promise<void>
  resetPassword(password: string): Promise<void>
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void
}
