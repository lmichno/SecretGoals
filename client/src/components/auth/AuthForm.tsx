import { useState, useCallback, type FormEvent } from 'react'
import { Eye, EyeOff, RotateCcw } from 'lucide-react'
import { Avatar, Button, InfoNote, SegmentedControl, TextField } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import type { AuthUser } from '../../api/auth'
import { ApiError } from '../../api/client'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_DIGIT_REGEX = /\d/

const PREVIEW_ALIASES = [
  'CichyLis42',
  'DzielnyWilk18',
  'SpokojnySokół73',
  'BystryJeż55',
  'ZwinnyBorsuk91',
  'NocnyRyś64',
  'OdważnyOrzeł37',
]

type AuthMode = 'login' | 'register'

interface FieldErrors {
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

interface AuthFormProps {
  defaultMode?: AuthMode
  onSuccess?: (user: AuthUser) => void
  className?: string
}

/**
 * Komponent formularza logowania i rejestracji (US01).
 * Odwzorowuje prototyp v2 (Auth.dc.html / DesktopAuth.dc.html).
 */
export function AuthForm({ defaultMode = 'login', onSuccess, className }: AuthFormProps) {
  const { login, register } = useAuth()

  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [aliasIndex, setAliasIndex] = useState(0)

  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})

  const previewAlias = PREVIEW_ALIASES[aliasIndex % PREVIEW_ALIASES.length] ?? 'CichyLis42'

  const handleModeChange = useCallback((newMode: AuthMode) => {
    setMode(newMode)
    setFormError(null)
    setErrors({})
    setPassword('')
    setConfirmPassword('')
    setAcceptTerms(false)
  }, [])

  const handleRerollAlias = useCallback(() => {
    setAliasIndex((prev) => prev + 1)
  }, [])

  const validate = (): boolean => {
    const newErrors: FieldErrors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      newErrors.email = 'Podaj adres e-mail'
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Podaj poprawny adres e-mail'
    }

    if (!password) {
      newErrors.password = 'Podaj hasło'
    } else if (mode === 'register') {
      if (password.length < PASSWORD_MIN_LENGTH || !PASSWORD_DIGIT_REGEX.test(password)) {
        newErrors.password = 'Hasło musi mieć co najmniej 8 znaków, w tym cyfrę'
      }
    }

    if (mode === 'register') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Wpisz hasło jeszcze raz'
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Hasła muszą być identyczne'
      }

      if (!acceptTerms) {
        newErrors.terms = 'Musisz zaakceptować regulamin i politykę prywatności'
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

    try {
      if (mode === 'login') {
        const user = await login({ email: email.trim(), password })
        onSuccess?.(user)
      } else {
        const user = await register({ email: email.trim(), password })
        onSuccess?.(user)
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.fields) {
          setErrors((prev) => ({
            ...prev,
            ...err.fields,
          }))
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

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <SegmentedControl
          label="Logowanie lub rejestracja"
          value={mode}
          onChange={handleModeChange}
          options={[
            { value: 'login', label: 'Logowanie' },
            { value: 'register', label: 'Rejestracja' },
          ]}
        />

        {formError && (
          <div
            role="alert"
            className="rounded-control border border-danger-border bg-surface p-3 text-small text-danger"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
          <TextField
            label="E-mail"
            type="email"
            id="auth-email"
            autoComplete="email"
            placeholder="ty@przyklad.pl"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }))
              }
            }}
            error={errors.email}
            disabled={submitting}
          />

          <TextField
            label="Hasło"
            type={showPassword ? 'text' : 'password'}
            id="auth-password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder={mode === 'login' ? 'Twoje hasło' : 'Min. 8 znaków'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }))
              }
            }}
            error={errors.password}
            hint={mode === 'register' ? 'Co najmniej 8 znaków, w tym cyfra.' : undefined}
            labelAside={
              mode === 'login' ? (
                <span className="text-small text-accent-light">Nie pamiętasz hasła?</span>
              ) : undefined
            }
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                className="inline-flex size-11 items-center justify-center rounded-chip text-muted hover:text-text cursor-pointer"
                disabled={submitting}
              >
                {showPassword ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </button>
            }
            disabled={submitting}
          />

          {mode === 'register' && (
            <>
              <TextField
                label="Powtórz hasło"
                type={showPassword ? 'text' : 'password'}
                id="auth-password-repeat"
                autoComplete="new-password"
                placeholder="Wpisz hasło jeszcze raz"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }
                }}
                error={errors.confirmPassword}
                disabled={submitting}
              />

              <div className="flex flex-col gap-2.5 rounded-panel border border-border bg-surface p-3.5 px-4">
                <span className="text-caption font-semibold uppercase tracking-[0.06em] text-accent-light">
                  Przykładowy anonimowy alias
                </span>
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar alias={previewAlias} tone="accent" size="md" />
                    <span className="text-label-lg font-bold text-text">{previewAlias}</span>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<RotateCcw size={14} className="text-accent" />}
                    onClick={handleRerollAlias}
                    disabled={submitting}
                  >
                    Losuj
                  </Button>
                </div>
                <span className="text-caption leading-[1.45] text-muted">
                  To jest przykładowy podgląd formatu. Właściwy, unikalny alias zostanie
                  automatycznie wygenerowany i przydzielony przez system podczas rejestracji.
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-2.5 text-small leading-[1.45] text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked)
                      if (errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: undefined }))
                      }
                    }}
                    className="size-5 shrink-0 rounded-[4px] accent-accent cursor-pointer"
                    disabled={submitting}
                  />
                  <span>
                    Akceptuję{' '}
                    <span className="text-accent-light underline cursor-pointer">regulamin</span> i{' '}
                    <span className="text-accent-light underline cursor-pointer">
                      politykę prywatności
                    </span>
                    .
                  </span>
                </label>
                {errors.terms && <span className="text-caption text-danger">{errors.terms}</span>}
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            size="xl"
            block
            disabled={submitting}
            className="mt-1"
          >
            {submitting ? 'Proszę czekać...' : mode === 'login' ? 'Zaloguj się' : 'Załóż konto'}
          </Button>
        </form>

        <InfoNote>
          E-mail służy tylko do logowania. Nigdy nie pokazujemy go innym użytkownikom.
        </InfoNote>

        <p className="m-0 text-center text-ui text-muted">
          <span>{mode === 'login' ? 'Nie masz konta? ' : 'Masz już konto? '}</span>
          <button
            type="button"
            onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
            className="cursor-pointer font-semibold text-accent-light hover:text-accent-lighter p-1 inline-flex"
            disabled={submitting}
          >
            {mode === 'login' ? 'Załóż je' : 'Zaloguj się'}
          </button>
        </p>
      </div>
    </div>
  )
}
