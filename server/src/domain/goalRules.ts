// Reguły celu (US02). Jedno źródło dozwolonych wartości po stronie serwera, bo SQLite nie ma
// enumów (ADR-004). Te same listy i limity musi mieć klient (ADR-009, docs/api/goals.md).

/** Kategorie z formularza celu; od kategorii zależy dopasowanie rówieśnika (ADR-012) */
export const GOAL_CATEGORIES = ['nalog', 'finanse', 'sport', 'kariera', 'zdrowie', 'inne'] as const
export type GoalCategory = (typeof GOAL_CATEGORIES)[number]
export const DEFAULT_GOAL_CATEGORY: GoalCategory = 'inne'

/** Typy celu (ADR-011): seria dzienna, cel kwotowy, licznik tygodniowy */
export const GOAL_TYPES = ['daily_streak', 'amount', 'weekly_count'] as const
export type GoalType = (typeof GOAL_TYPES)[number]
export const DEFAULT_GOAL_TYPE: GoalType = 'daily_streak'

export const GOAL_STATUSES = ['active', 'completed', 'archived'] as const
export type GoalStatus = (typeof GOAL_STATUSES)[number]

export const GOAL_TITLE_MAX_LENGTH = 100
export const GOAL_DESCRIPTION_MAX_LENGTH = 1000

/** Cel kwotowy: kwota w PLN, większa od zera */
export const GOAL_AMOUNT_MAX = 10_000_000
/** Licznik tygodniowy: ile razy w tygodniu */
export const GOAL_WEEKLY_MIN = 1
export const GOAL_WEEKLY_MAX = 7

/** Termin najpóźniej za tyle lat od dziś */
export const GOAL_TARGET_DATE_MAX_YEARS = 5
/** Strefa, w której liczymy "dziś" przy sprawdzaniu terminu */
export const APP_TIME_ZONE = 'Europe/Warsaw'

/** Ile aktywnych celów może mieć jedno konto naraz */
export const MAX_ACTIVE_GOALS = 5

export function isGoalCategory(value: unknown): value is GoalCategory {
  return typeof value === 'string' && (GOAL_CATEGORIES as readonly string[]).includes(value)
}

export function isGoalType(value: unknown): value is GoalType {
  return typeof value === 'string' && (GOAL_TYPES as readonly string[]).includes(value)
}
