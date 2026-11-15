import { useState, useCallback, useMemo, type FormEvent } from 'react'
import { AlertTriangle, Globe, Lock } from 'lucide-react'
import { Button, InfoNote, SegmentedControl, TextField, TextArea } from '../ui'
import { apiCreateGoal, type Goal, type CreateGoalInput } from '../../api/goals'
import { ApiError } from '../../api/client'

const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 1000
const MAX_TARGET_YEARS = 5

interface FieldErrors {
  title?: string
  description?: string
  targetDate?: string
  isPublic?: string
}

interface AddGoalFormProps {
  onSuccess: (goal: Goal) => void
  onCancel: () => void
  className?: string
}

type VisibilityMode = 'public' | 'private'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

function getTodayString(): string {
  // Strefa czasowa aplikacji: Europe/Warsaw (zgodnie z domeną projektu)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date())
}

function getMaxDateString(today: string): string {
  const year = Number(today.slice(0, 4)) + MAX_TARGET_YEARS
  return `${year}${today.slice(4)}`
}

export function AddGoalForm({ onSuccess, onCancel, className }: AddGoalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [visibility, setVisibility] = useState<VisibilityMode>('public')

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const todayStr = useMemo(() => getTodayString(), [])
  const maxDateStr = useMemo(() => getMaxDateString(todayStr), [todayStr])

  const validate = (): boolean => {
    const newErrors: FieldErrors = {}
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      newErrors.title = 'Podaj nazwę celu'
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Nazwa może mieć najwyżej ${TITLE_MAX_LENGTH} znaków`
    }

    const trimmedDescription = description.trim()
    if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `Opis może mieć najwyżej ${DESCRIPTION_MAX_LENGTH} znaków`
    }

    if (targetDate) {
      if (!DATE_REGEX.test(targetDate)) {
        newErrors.targetDate = 'Podaj poprawną datę'
      } else if (targetDate < todayStr) {
        newErrors.targetDate = 'Termin nie może być w przeszłości'
      } else if (targetDate > maxDateStr) {
        newErrors.targetDate = `Termin może być najpóźniej za ${MAX_TARGET_YEARS} lat`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (!validate()) {
      return
    }

    setSubmitting(true)

    const payload: CreateGoalInput = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      targetDate: targetDate || null,
      isPublic: visibility === 'public',
    }

    try {
      const created = await apiCreateGoal(payload)
      onSuccess(created)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          // Limit 5 aktywnych celów
          setFormError(err.message)
        } else if (err.status === 401) {
          setFormError('Twoja sesja wygasła. Zaloguj się ponownie.')
        } else if (err.fields) {
          setErrors((prev) => ({
            ...prev,
            ...err.fields,
          }))
          if (err.message && err.message !== 'Popraw zaznaczone pola') {
            setFormError(err.message)
          }
        } else {
          setFormError(err.message)
        }
      } else if (err instanceof Error) {
        setFormError(err.message)
      } else {
        setFormError('Wystąpił błąd podczas komunikacji z serwerem. Spróbuj ponownie.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleVisibilityChange = useCallback(
    (value: VisibilityMode) => {
      setVisibility(value)
      if (errors.isPublic) {
        setErrors((prev) => ({ ...prev, isPublic: undefined }))
      }
    },
    [errors.isPublic]
  )

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="flex flex-col gap-4">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-control border border-danger-border bg-surface p-3.5 text-small text-danger"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{formError}</span>
          </div>
        )}

        <TextField
          label="Nazwa celu *"
          id="goal-title"
          placeholder="np. Bieganie 3 razy w tygodniu"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }))
            }
          }}
          error={errors.title}
          labelAside={
            <span className="text-caption text-muted">
              {title.trim().length}/{TITLE_MAX_LENGTH}
            </span>
          }
          disabled={submitting}
        />

        <TextArea
          label="Opis celu (opcjonalny)"
          id="goal-description"
          placeholder="Dodaj szczegóły, powód lub swój plan działania..."
          rows={3}
          maxLength={DESCRIPTION_MAX_LENGTH}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }))
            }
          }}
          error={errors.description}
          labelAside={
            <span className="text-caption text-muted">
              {description.trim().length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          }
          disabled={submitting}
        />

        <TextField
          label="Termin realizacji (opcjonalny)"
          id="goal-target-date"
          type="date"
          min={todayStr}
          max={maxDateStr}
          value={targetDate}
          onChange={(e) => {
            setTargetDate(e.target.value)
            if (errors.targetDate) {
              setErrors((prev) => ({ ...prev, targetDate: undefined }))
            }
          }}
          error={errors.targetDate}
          hint="Dzień, do którego chcesz osiągnąć cel (maks. 5 lat w przód)."
          disabled={submitting}
        />

        <div className="flex flex-col gap-2">
          <span className="text-small font-semibold text-text-secondary">Widoczność celu</span>
          <SegmentedControl
            label="Wybierz widoczność celu"
            value={visibility}
            onChange={handleVisibilityChange}
            options={[
              { value: 'public', label: 'Publiczny' },
              { value: 'private', label: 'Prywatny' },
            ]}
          />
          {errors.isPublic && <span className="text-caption text-danger">{errors.isPublic}</span>}

          <InfoNote>
            {visibility === 'public' ? (
              <span className="flex items-center gap-1.5">
                <Globe size={15} className="shrink-0 text-support" aria-hidden="true" />
                <span>
                  Cel będzie widoczny w Społeczności pod Twoim anonimowym aliasem. Inni będą mogli
                  Cię wspierać.
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Lock size={15} className="shrink-0 text-support" aria-hidden="true" />
                <span>Cel będzie widoczny wyłącznie dla Ciebie. Nie trafi do Społeczności.</span>
              </span>
            )}
          </InfoNote>
        </div>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
          <Button type="submit" variant="primary" size="lg" block disabled={submitting}>
            {submitting ? 'Zapisywanie...' : 'Utwórz cel'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            block
            onClick={onCancel}
            disabled={submitting}
          >
            Anuluj
          </Button>
        </div>
      </div>
    </form>
  )
}
