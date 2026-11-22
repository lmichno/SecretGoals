import { createContext } from 'react'
import type { AuthUser, LoginInput, RegisterInput } from '../api/auth'

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  sessionError: string | null
  /** true po 401 w trakcie pracy: logowanie pokazuje „Sesja wygasła” (stan auth-sesja-wygasla). */
  sessionExpired: boolean
  loggingOut: boolean
  error: string | null
  login: (credentials: LoginInput) => Promise<AuthUser>
  register: (credentials: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
  retrySessionCheck: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
