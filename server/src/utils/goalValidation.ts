import {
  APP_TIME_ZONE,
  DEFAULT_GOAL_CATEGORY,
  DEFAULT_GOAL_TYPE,
  GOAL_AMOUNT_MAX,
  GOAL_DESCRIPTION_MAX_LENGTH,
  GOAL_TARGET_DATE_MAX_YEARS,
  GOAL_TITLE_MAX_LENGTH,
  GOAL_WEEKLY_MAX,
  GOAL_WEEKLY_MIN,
  isGoalCategory,
  isGoalType,
  type GoalType,
} from '../domain/goalRules.js'
import type { CreateGoalInput } from '../services/goalsService.js'
import { HttpError } from './httpError.js'

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

/** Dzisiejsza data w strefie aplikacji jako "YYYY-MM-DD" */
export function todayInAppZone(now: Date = new Date()): string {
  // Format en-CA daje akurat YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIME_ZONE }).format(now)
}

/** "YYYY-MM-DD" na północ UTC tego dnia albo null, gdy dzień nie istnieje (np. 2026-02-30) */
function parseDay(value: string): Date | null {
  const match = DATE_PATTERN.exec(value)
  if (!match) return null
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(Date.UTC(year, month - 1, day))
  const sameDay =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  return sameDay ? date : null
}

function parseTargetValue(type: GoalType, value: unknown): number | null | string {
  // Seria dzienna nie ma wartości docelowej. Starą wartość z formularza (po zmianie typu) pomijamy.
  if (type === 'daily_streak') return null

  if (type === 'amount') {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      return 'Podaj kwotę większą od zera'
    }
    if (value > GOAL_AMOUNT_MAX) return 'Kwota może wynosić najwyżej 10 000 000 zł'
    return Math.round(value * 100) / 100
  }

  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < GOAL_WEEKLY_MIN ||
    value > GOAL_WEEKLY_MAX
  ) {
    return `Podaj liczbę od ${GOAL_WEEKLY_MIN} do ${GOAL_WEEKLY_MAX}`
  }
  return value
}

/**
 * Sprawdza dane nowego celu z body (US02, ADR-009). Zbiera wszystkie błędy naraz i rzuca 400
 * z polami do wyświetlenia pod formularzem. Pól spoza listy (np. userId, status) nie czyta.
 */
export function parseGoalInput(body: unknown, now: Date = new Date()): CreateGoalInput {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  const fields: Record<string, string> = {}

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (!title) {
    fields.title = 'Podaj nazwę celu'
  } else if (title.length > GOAL_TITLE_MAX_LENGTH) {
    fields.title = `Nazwa może mieć najwyżej ${GOAL_TITLE_MAX_LENGTH} znaków`
  }

  let description: string | null = null
  if (typeof data.description === 'string') {
    description = data.description.trim() || null
    if (description && description.length > GOAL_DESCRIPTION_MAX_LENGTH) {
      fields.description = `Opis może mieć najwyżej ${GOAL_DESCRIPTION_MAX_LENGTH} znaków`
    }
  } else if (data.description !== undefined && data.description !== null) {
    fields.description = 'Opis musi być tekstem'
  }

  const category = data.category ?? DEFAULT_GOAL_CATEGORY
  if (!isGoalCategory(category)) fields.category = 'Wybierz kategorię z listy'

  const type = data.type ?? DEFAULT_GOAL_TYPE
  let targetValue: number | null = null
  if (!isGoalType(type)) {
    fields.type = 'Wybierz typ celu'
  } else {
    const parsed = parseTargetValue(type, data.targetValue)
    if (typeof parsed === 'string') fields.targetValue = parsed
    else targetValue = parsed
  }

  let targetDate: Date | null = null
  if (data.targetDate !== undefined && data.targetDate !== null && data.targetDate !== '') {
    const parsed = typeof data.targetDate === 'string' ? parseDay(data.targetDate) : null
    const today = todayInAppZone(now)
    const maxDay = `${Number(today.slice(0, 4)) + GOAL_TARGET_DATE_MAX_YEARS}${today.slice(4)}`
    if (!parsed) {
      fields.targetDate = 'Podaj poprawną datę'
    } else if ((data.targetDate as string) < today) {
      fields.targetDate = 'Termin nie może być w przeszłości'
    } else if ((data.targetDate as string) > maxDay) {
      fields.targetDate = `Termin może być najpóźniej za ${GOAL_TARGET_DATE_MAX_YEARS} lat`
    } else {
      targetDate = parsed
    }
  }

  let isPublic = true
  if (typeof data.isPublic === 'boolean') {
    isPublic = data.isPublic
  } else if (data.isPublic !== undefined) {
    fields.isPublic = 'Wybierz widoczność'
  }

  if (Object.keys(fields).length > 0) {
    throw new HttpError(400, 'Popraw zaznaczone pola', fields)
  }

  return {
    title,
    description,
    category: category as CreateGoalInput['category'],
    type: type as CreateGoalInput['type'],
    targetValue,
    targetDate,
    isPublic,
  }
}
