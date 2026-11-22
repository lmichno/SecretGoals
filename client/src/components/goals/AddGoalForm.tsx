import { useState, useMemo, useRef, type FormEvent } from 'react'
import { AlertTriangle, Calendar, Check, Flame, Globe, Loader2, Lock, Target } from 'lucide-react'
import { Button, TextField, TextArea, cn } from '../ui'
import {
  apiCreateGoal,
  CATEGORY_LABELS,
  type Goal,
  type GoalCategory,
  type GoalType,
  type CreateGoalInput,
} from '../../api/goals'
import { ApiError } from '../../api/client'

const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 1000
const MAX_TARGET_YEARS = 5

/** Kolejność pól w formularzu i selektory do ustawienia fokusu po błędzie walidacji. */
const FIELD_ORDER = [
  'title',
  'description',
  'category',
  'type',
  'targetValue',
  'targetDate',
] as const satisfies ReadonlyArray<keyof FieldErrors>

const FIELD_SELECTORS: Record<(typeof FIELD_ORDER)[number], string> = {
  title: '#sg-gname',
  description: '#sg-gdesc',
  category: 'input[name="category"]',
  type: 'input[name="goalType"]',
  targetValue: '#sg-gtarget',
  targetDate: '#sg-gdate',
}

const CATEGORIES: GoalCategory[] = ['nalog', 'finanse', 'sport', 'kariera', 'zdrowie', 'inne']

const GOAL_TYPES: {
  id: GoalType
  title: string
  desc: string
  icon: typeof Flame
}[] = [
  {
    id: 'daily_streak',
    title: 'Seria dzienna',
    desc: 'Zaznaczasz każdy dzień, liczy się seria.',
    icon: Flame,
  },
  {
    id: 'amount',
    title: 'Cel kwotowy',
    desc: 'Np. spłata długu albo oszczędzanie.',
    icon: Target,
  },
  {
    id: 'weekly_count',
    title: 'Licznik tygodniowy',
    desc: 'Np. 3 treningi w tygodniu.',
    icon: Calendar,
  },
]

interface FieldErrors {
  title?: string
  description?: string
  category?: string
  type?: string
  targetValue?: string
  targetDate?: string
  isPublic?: string
  [key: string]: string | undefined
}

interface FormErrorState {
  title: string
  description?: string
}

interface AddGoalFormProps {
  onSuccess: (goal: Goal) => void
  onCancel: () => void
  onSubmittingChange?: (submitting: boolean) => void
  className?: string
}

type VisibilityMode = 'public' | 'private'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

function getTodayString(): string {
  // Strefa czasowa aplikacji: Europe/Warsaw (zgodnie z ADR-009)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date())
}

function getMaxDateString(today: string): string {
  const year = Number(today.slice(0, 4)) + MAX_TARGET_YEARS
  return `${year}${today.slice(4)}`
}

export function AddGoalForm({
  onSuccess,
  onCancel,
  onSubmittingChange,
  className,
}: AddGoalFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('inne')
  const [type, setType] = useState<GoalType>('daily_streak')
  const [targetValue, setTargetValue] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [visibility, setVisibility] = useState<VisibilityMode>('public')

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<FormErrorState | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const todayStr = useMemo(() => getTodayString(), [])
  const maxDateStr = useMemo(() => getMaxDateString(todayStr), [todayStr])

  const setSubmittingState = (value: boolean) => {
    setSubmitting(value)
    onSubmittingChange?.(value)
  }

  const formRef = useRef<HTMLFormElement>(null)

  /** Po nieudanej walidacji przenosi fokus na pierwsze błędne pole (na telefonie komunikat bywa poza ekranem). */
  const focusFirstError = (fieldErrors: FieldErrors) => {
    const firstKey = FIELD_ORDER.find((key) => fieldErrors[key])
    if (!firstKey) return
    const el = formRef.current?.querySelector<HTMLElement>(FIELD_SELECTORS[firstKey])
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  const validate = (): FieldErrors => {
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

    if (!CATEGORIES.includes(category)) {
      newErrors.category = 'Wybierz kategorię z listy'
    }

    if (!GOAL_TYPES.some((t) => t.id === type)) {
      newErrors.type = 'Wybierz typ celu'
    }

    if (type === 'amount') {
      const trimmedVal = targetValue.trim()
      const parsedVal = Number(trimmedVal.replace(',', '.'))
      if (!trimmedVal || isNaN(parsedVal) || parsedVal <= 0) {
        newErrors.targetValue = 'Podaj kwotę większą od zera'
      } else if (parsedVal > 10_000_000) {
        newErrors.targetValue = 'Kwota może wynosić najwyżej 10 000 000 zł'
      }
    } else if (type === 'weekly_count') {
      const trimmedVal = targetValue.trim()
      const parsedVal = Number(trimmedVal)
      if (
        !trimmedVal ||
        isNaN(parsedVal) ||
        !Number.isInteger(parsedVal) ||
        parsedVal < 1 ||
        parsedVal > 7
      ) {
        newErrors.targetValue = 'Podaj liczbę od 1 do 7'
      }
    }

    if (targetDate) {
      if (!DATE_REGEX.test(targetDate)) {
        newErrors.targetDate = 'Podaj poprawną datę'
      } else if (targetDate < todayStr) {
        newErrors.targetDate = 'Termin nie może być w przeszłości'
      } else if (targetDate > maxDateStr) {
        newErrors.targetDate = 'Termin może być najpóźniej za 5 lat'
      }
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const validationErrors = validate()
    if (Object.values(validationErrors).some(Boolean)) {
      focusFirstError(validationErrors)
      return
    }

    setSubmittingState(true)

    let parsedTargetValue: number | null = null
    if (type === 'amount') {
      parsedTargetValue = Math.round(Number(targetValue.trim().replace(',', '.')) * 100) / 100
    } else if (type === 'weekly_count') {
      parsedTargetValue = Number(targetValue.trim())
    }

    const payload: CreateGoalInput = {
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      category,
      type,
      targetValue: parsedTargetValue,
      targetDate: targetDate || null,
      isPublic: visibility === 'public',
    }

    try {
      const created = await apiCreateGoal(payload)
      onSuccess(created)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          // Limit 5 aktywnych celów (kontrakt goals.md)
          setFormError({
            title:
              'Możesz mieć najwyżej 5 aktywnych celów. Zakończ albo zarchiwizuj któryś, żeby dodać nowy.',
          })
        } else if (err.status === 401) {
          // Flow 3: przejście do logowania (apiRequest informuje AuthProvider)
          setFormError({
            title: 'Sesja wygasła',
            description: 'Zaloguj się ponownie, aby kontynuować.',
          })
        } else if (err.status === 0 || err.status >= 500) {
          // Flow 3 / stan cel-blad-serwera:
          // Dane zostają w formularzu
          setFormError({
            title: 'Nie udało się zapisać celu',
            description:
              'Sprawdź połączenie i spróbuj ponownie. Wpisane dane zostały w formularzu.',
          })
        } else if (err.fields && Object.keys(err.fields).length > 0) {
          // 400 z polami walidacji
          setErrors((prev) => ({
            ...prev,
            ...err.fields,
          }))

          // Fallback z pkt 2: jeśli w fields jest klucz nieposiadający widocznego pola w UI
          const visibleFields = new Set([
            'title',
            'description',
            'category',
            'type',
            ...(type !== 'daily_streak' ? ['targetValue'] : []),
            'targetDate',
            'isPublic',
          ])
          const unmappedKeys = Object.keys(err.fields).filter((k) => !visibleFields.has(k))

          if (unmappedKeys.length > 0) {
            setFormError({
              title: 'Popraw zaznaczone pola',
              description: unmappedKeys.map((k) => err.fields![k]).join('. '),
            })
          } else if (err.message && err.message !== 'Popraw zaznaczone pola') {
            setFormError({
              title: err.message,
            })
          }
        } else {
          setFormError({
            title: err.message || 'Nie udało się zapisać celu',
            description: 'Sprawdź dane i spróbuj ponownie.',
          })
        }
      } else {
        setFormError({
          title: 'Nie udało się zapisać celu',
          description: 'Sprawdź połączenie i spróbuj ponownie. Wpisane dane zostały w formularzu.',
        })
      }
    } finally {
      setSubmittingState(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={className}>
      <div className="flex flex-col gap-4.5">
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-control border border-danger-border bg-surface p-3.5"
          >
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <span className="text-small font-semibold leading-snug text-danger">
                {formError.title}
              </span>
              {formError.description && (
                <span className="text-small leading-snug text-danger/90">
                  {formError.description}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Nazwa celu */}
        <TextField
          label="Nazwa celu"
          id="sg-gname"
          placeholder="Np. Zero nikotyny"
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
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          }
          disabled={submitting}
        />

        {/* Opis celu */}
        <TextArea
          label="Opis (opcjonalnie)"
          id="sg-gdesc"
          placeholder="Po co Ci ten cel? Co będzie sukcesem?"
          rows={2}
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
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          }
          disabled={submitting}
        />

        {/* Kategoria */}
        <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
          <legend className="text-small font-semibold text-text-secondary">Kategoria</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((catKey) => {
              const isSelected = category === catKey
              return (
                <label
                  key={catKey}
                  className={cn(
                    'h-10 shrink-0 rounded-chip border px-3.5 text-ui transition cursor-pointer flex items-center justify-center',
                    isSelected
                      ? 'border-accent bg-accent-subtle text-text font-semibold'
                      : 'border-border bg-surface text-text-secondary font-medium hover:border-border-strong hover:text-text',
                    submitting && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  <input
                    type="radio"
                    name="category"
                    value={catKey}
                    checked={isSelected}
                    onChange={() => {
                      setCategory(catKey)
                      if (errors.category) {
                        setErrors((prev) => ({ ...prev, category: undefined }))
                      }
                    }}
                    disabled={submitting}
                    className="sr-only"
                  />
                  <span>{CATEGORY_LABELS[catKey]}</span>
                </label>
              )
            })}
          </div>
          {errors.category && <span className="text-caption text-danger">{errors.category}</span>}
        </fieldset>

        {/* Typ celu */}
        <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
          <legend className="text-small font-semibold text-text-secondary">Typ celu</legend>
          <div className="flex flex-col gap-2">
            {GOAL_TYPES.map(({ id: tKey, title: tTitle, desc: tDesc, icon: IconComponent }) => {
              const isSelected = type === tKey
              return (
                <label
                  key={tKey}
                  aria-labelledby={`sg-gtype-${tKey}-title`}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-tile border p-3 lg:p-3.5 text-left text-text transition cursor-pointer',
                    isSelected
                      ? 'border-accent bg-accent-subtle'
                      : 'border-border bg-surface hover:border-border-strong',
                    submitting && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  <input
                    type="radio"
                    name="goalType"
                    value={tKey}
                    checked={isSelected}
                    aria-labelledby={`sg-gtype-${tKey}-title`}
                    aria-describedby={`sg-gtype-${tKey}-desc`}
                    onChange={() => {
                      setType(tKey)
                      if (errors.type) {
                        setErrors((prev) => ({ ...prev, type: undefined }))
                      }
                      if (errors.targetValue) {
                        setErrors((prev) => ({ ...prev, targetValue: undefined }))
                      }
                    }}
                    disabled={submitting}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'mt-0.5 size-5 shrink-0 rounded-full box-border',
                      isSelected
                        ? 'border-[6px] border-accent bg-accent-ink'
                        : 'border-2 border-border-strong'
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-body font-semibold">
                      <span className={isSelected ? 'text-accent' : 'text-muted'}>
                        <IconComponent size={18} aria-hidden="true" />
                      </span>
                      <span id={`sg-gtype-${tKey}-title`}>{tTitle}</span>
                    </span>
                    <span
                      id={`sg-gtype-${tKey}-desc`}
                      className="text-small leading-snug text-muted"
                    >
                      {tDesc}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
          {errors.type && <span className="text-caption text-danger">{errors.type}</span>}
        </fieldset>

        {/* Wartość docelowa - zależna od typu */}
        {type === 'amount' && (
          <TextField
            label="Kwota docelowa (zł)"
            id="sg-gtarget"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="Np. 8000"
            value={targetValue}
            onChange={(e) => {
              setTargetValue(e.target.value)
              if (errors.targetValue) {
                setErrors((prev) => ({ ...prev, targetValue: undefined }))
              }
            }}
            error={errors.targetValue}
            hint="Kwota w PLN, większa od zera (maks. 10 000 000 zł)."
            disabled={submitting}
          />
        )}

        {type === 'weekly_count' && (
          <TextField
            label="Ile razy w tygodniu?"
            id="sg-gtarget"
            type="number"
            min={1}
            max={7}
            step={1}
            placeholder="Np. 3"
            value={targetValue}
            onChange={(e) => {
              setTargetValue(e.target.value)
              if (errors.targetValue) {
                setErrors((prev) => ({ ...prev, targetValue: undefined }))
              }
            }}
            error={errors.targetValue}
            hint="Pokażemy postęp jako 1/3, 2/3, 3/3."
            disabled={submitting}
          />
        )}

        {/* Termin */}
        <TextField
          label="Termin (opcjonalnie)"
          id="sg-gdate"
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
          disabled={submitting}
        />

        {/* Widoczność (dwa kafelki z prototypu v2) */}
        <fieldset className="flex flex-col gap-2 border-none p-0 m-0">
          <legend className="text-small font-semibold text-text-secondary">Widoczność</legend>
          <div className="flex flex-col gap-2">
            <label
              aria-labelledby="sg-gvis-public-title"
              className={cn(
                'flex w-full items-start gap-3 rounded-tile border p-3 lg:p-3.5 text-left text-text transition cursor-pointer',
                visibility === 'public'
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border bg-surface hover:border-border-strong',
                submitting && 'opacity-60 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                aria-labelledby="sg-gvis-public-title"
                aria-describedby="sg-gvis-public-desc"
                onChange={() => {
                  setVisibility('public')
                  if (errors.isPublic) {
                    setErrors((prev) => ({ ...prev, isPublic: undefined }))
                  }
                }}
                disabled={submitting}
                className="sr-only"
              />
              <span
                className={cn(
                  'mt-0.5 size-5 shrink-0 rounded-full box-border',
                  visibility === 'public'
                    ? 'border-[6px] border-accent bg-accent-ink'
                    : 'border-2 border-border-strong'
                )}
                aria-hidden="true"
              />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-body font-semibold">
                  <span className={visibility === 'public' ? 'text-accent' : 'text-muted'}>
                    <Globe size={18} aria-hidden="true" />
                  </span>
                  <span id="sg-gvis-public-title">Publiczny</span>
                </span>
                <span id="sg-gvis-public-desc" className="text-small leading-snug text-muted">
                  Cel stanie się postem w Społeczności. Inni zobaczą tylko Twój alias.
                </span>
              </span>
            </label>

            <label
              aria-labelledby="sg-gvis-private-title"
              className={cn(
                'flex w-full items-start gap-3 rounded-tile border p-3 lg:p-3.5 text-left text-text transition cursor-pointer',
                visibility === 'private'
                  ? 'border-accent bg-accent-subtle'
                  : 'border-border bg-surface hover:border-border-strong',
                submitting && 'opacity-60 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                aria-labelledby="sg-gvis-private-title"
                aria-describedby="sg-gvis-private-desc"
                onChange={() => {
                  setVisibility('private')
                  if (errors.isPublic) {
                    setErrors((prev) => ({ ...prev, isPublic: undefined }))
                  }
                }}
                disabled={submitting}
                className="sr-only"
              />
              <span
                className={cn(
                  'mt-0.5 size-5 shrink-0 rounded-full box-border',
                  visibility === 'private'
                    ? 'border-[6px] border-accent bg-accent-ink'
                    : 'border-2 border-border-strong'
                )}
                aria-hidden="true"
              />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="flex items-center gap-1.5 text-body font-semibold">
                  <span className={visibility === 'private' ? 'text-accent' : 'text-muted'}>
                    <Lock size={18} aria-hidden="true" />
                  </span>
                  <span id="sg-gvis-private-title">Prywatny</span>
                </span>
                <span id="sg-gvis-private-desc" className="text-small leading-snug text-muted">
                  Widzisz go tylko Ty. Możesz go upublicznić później.
                </span>
              </span>
            </label>
          </div>
          {errors.isPublic && <span className="text-caption text-danger">{errors.isPublic}</span>}
        </fieldset>

        {/* Przyciski formularza */}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row-reverse sm:gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            block
            disabled={submitting}
            icon={
              submitting ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Check size={18} strokeWidth={2.5} aria-hidden="true" />
              )
            }
          >
            {submitting ? 'Tworzenie celu…' : 'Utwórz cel'}
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
