import { useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  apiGetMe,
  apiLogin,
  apiLogout,
  apiRegister,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from '../api/auth'
import { ApiError } from '../api/client'
import { AuthContext, type AuthContextValue } from './authContext'

interface AuthProviderProps {
  children: ReactNode
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return err.message
  }
  if (err instanceof Error) {
    return err.message
  }
  return fallback
}

/**
 * Provider stanu autoryzacji użytkownika (ADR-013).
 * Sprawdza sesję przy starcie aplikacji przez apiGetMe() (ciasteczko httpOnly).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    apiGetMe()
      .then((userData) => {
        if (isMounted) {
          setUser(userData)
          setSessionError(null)
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return

        // 401 Unauthorized oznacza po prostu brak aktywnej sesji (użytkownik niezalogowany)
        if (err instanceof ApiError && err.status === 401) {
          setUser(null)
          setSessionError(null)
          return
        }

        // Błąd sieciowy lub błąd serwera (np. 500)
        const message = getErrorMessage(
          err,
          'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.'
        )
        setUser(null)
        setSessionError(message)
        console.error('Błąd podczas sprawdzania sesji użytkownika:', err)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const retrySessionCheck = useCallback(async (): Promise<void> => {
    setLoading(true)
    setSessionError(null)

    try {
      const userData = await apiGetMe()
      setUser(userData)
      setSessionError(null)
    } catch (err: unknown) {
      // 401 Unauthorized oznacza po prostu brak aktywnej sesji (użytkownik niezalogowany)
      if (err instanceof ApiError && err.status === 401) {
        setUser(null)
        setSessionError(null)
        return
      }

      // Błąd sieciowy lub błąd serwera (np. 500)
      const message = getErrorMessage(
        err,
        'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.'
      )
      setUser(null)
      setSessionError(message)
      console.error('Błąd podczas sprawdzania sesji użytkownika:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials: LoginInput): Promise<AuthUser> => {
    setError(null)
    try {
      const loggedInUser = await apiLogin(credentials)
      setUser(loggedInUser)
      setSessionError(null)
      return loggedInUser
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Nie udało się zalogować')
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async (credentials: RegisterInput): Promise<AuthUser> => {
    setError(null)
    try {
      const registeredUser = await apiRegister(credentials)
      setUser(registeredUser)
      setSessionError(null)
      return registeredUser
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Nie udało się założyć konta')
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    if (loggingOut) {
      return
    }

    setLoggingOut(true)
    try {
      await apiLogout()
    } catch (err: unknown) {
      console.error('Błąd podczas wylogowywania na serwerze:', err)
    } finally {
      setUser(null)
      setError(null)
      setLoggingOut(false)
    }
  }, [loggingOut])

  const value: AuthContextValue = {
    user,
    loading,
    sessionError,
    loggingOut,
    error,
    login,
    register,
    logout,
    retrySessionCheck,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
