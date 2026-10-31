import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from '../context/authContext'

/**
 * Hook ułatwiający dostęp do kontekstu autoryzacji (ADR-013).
 * Wymaga umieszczenia komponentu wewnątrz AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
