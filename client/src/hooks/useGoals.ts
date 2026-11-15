import { useState, useEffect, useCallback, useMemo } from 'react'
import { apiGetGoals, type Goal } from '../api/goals'
import { ApiError } from '../api/client'

export interface UseGoalsResult {
  goals: Goal[]
  selectedGoal: Goal | null
  selectedGoalId: string | null
  loading: boolean
  error: string | null
  setSelectedGoalId: (id: string) => void
  handleGoalCreated: (newGoal: Goal) => void
  refreshGoals: () => Promise<void>
}

/**
 * Hook zarządzający listą celów użytkownika (US02).
 * Pobiera cele z GET /api/goals i pozwala wybrać aktywny cel.
 */
export function useGoals(enabled = true): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  const refreshGoals = useCallback(async () => {
    if (!enabled) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await apiGetGoals()
      setGoals(data)
      if (data.length > 0) {
        setSelectedGoalId((prev) => {
          if (prev && data.some((g) => g.id === prev)) {
            return prev
          }
          return data[0]?.id ?? null
        })
      } else {
        setSelectedGoalId(null)
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setGoals([])
        setSelectedGoalId(null)
        return
      }
      const message = err instanceof Error ? err.message : 'Nie udało się pobrać listy Twoich celów'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let isMounted = true

    apiGetGoals()
      .then((data) => {
        if (!isMounted) return
        setGoals(data)
        if (data.length > 0) {
          setSelectedGoalId((prev) => {
            if (prev && data.some((g) => g.id === prev)) {
              return prev
            }
            return data[0]?.id ?? null
          })
        } else {
          setSelectedGoalId(null)
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        if (err instanceof ApiError && err.status === 401) {
          setGoals([])
          setSelectedGoalId(null)
          return
        }
        const message =
          err instanceof Error ? err.message : 'Nie udało się pobrać listy Twoich celów'
        setError(message)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [enabled])

  /**
   * Zgodnie z kontraktem docs/api/goals.md:
   * Klient dodaje nowo utworzony cel na początek listy i ustawia jako wybrany.
   */
  const handleGoalCreated = useCallback((newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev.filter((g) => g.id !== newGoal.id)])
    setSelectedGoalId(newGoal.id)
  }, [])

  const selectedGoal = useMemo(() => {
    if (!selectedGoalId) return goals[0] ?? null
    return goals.find((g) => g.id === selectedGoalId) ?? goals[0] ?? null
  }, [goals, selectedGoalId])

  return {
    goals,
    selectedGoal,
    selectedGoalId: selectedGoal?.id ?? null,
    loading,
    error,
    setSelectedGoalId,
    handleGoalCreated,
    refreshGoals,
  }
}
