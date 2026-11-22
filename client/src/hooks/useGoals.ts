import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiGetGoals, type Goal } from '../api/goals'

export interface UseGoalsResult {
  goals: Goal[]
  selectedGoal: Goal | null
  selectedGoalId: string | null
  loading: boolean
  /** true, gdy GET /api/goals się nie udał (stan S-cele-blad). */
  loadFailed: boolean
  setSelectedGoalId: (id: string) => void
  handleGoalCreated: (newGoal: Goal) => void
  refreshGoals: () => Promise<void>
}

/**
 * Hook zarządzający listą celów użytkownika (US02).
 * Pobiera cele z GET /api/goals i pozwala wybrać aktywny cel.
 * 401 obsługuje AuthProvider (powrót do logowania), więc tutaj go nie rozróżniamy.
 */
export function useGoals(): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  /** Pobiera listę; stany ładowania ustawia wywołujący (stan początkowy albo refreshGoals). */
  const fetchGoals = useCallback(
    (isActive: () => boolean) =>
      apiGetGoals()
        .then((data) => {
          if (!isActive()) return
          setGoals(data)
          setSelectedGoalId((prev) =>
            prev && data.some((g) => g.id === prev) ? prev : (data[0]?.id ?? null)
          )
        })
        .catch((err: unknown) => {
          if (!isActive()) return
          console.error('Błąd podczas pobierania celów:', err)
          setLoadFailed(true)
        })
        .finally(() => {
          if (isActive()) setLoading(false)
        }),
    []
  )

  useEffect(() => {
    let active = true
    void fetchGoals(() => active)
    return () => {
      active = false
    }
  }, [fetchGoals])

  /** „Spróbuj ponownie” w stanie S-cele-blad. */
  const refreshGoals = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    await fetchGoals(() => true)
  }, [fetchGoals])

  /**
   * Zgodnie z kontraktem docs/api/goals.md:
   * klient dodaje nowo utworzony cel na początek listy i ustawia go jako wybrany.
   */
  const handleGoalCreated = useCallback((newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev.filter((g) => g.id !== newGoal.id)])
    setSelectedGoalId(newGoal.id)
  }, [])

  const selectedGoal = useMemo(
    () => goals.find((g) => g.id === selectedGoalId) ?? goals[0] ?? null,
    [goals, selectedGoalId]
  )

  return {
    goals,
    selectedGoal,
    selectedGoalId: selectedGoal?.id ?? null,
    loading,
    loadFailed,
    setSelectedGoalId,
    handleGoalCreated,
    refreshGoals,
  }
}
