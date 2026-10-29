import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'support' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ikona z lucide-react, np. <Check size={18} />. */
  icon?: ReactNode
  /** Przycisk na całą szerokość rodzica. */
  block?: boolean
}

const variants: Record<ButtonVariant, string> = {
  // Jedna główna akcja na sekcję: Zaloguj się, Zaliczone na dziś, Nowy cel
  primary: 'bg-accent text-accent-ink font-bold hover:brightness-105',
  // Akcja pomocnicza na karcie: Strategie i poradniki, +100 zł
  secondary: 'bg-surface-2 text-text border border-border font-semibold hover:border-border-strong',
  // Akcja alternatywna obok głównej: Potknięcie
  outline: 'bg-transparent text-text-secondary border border-border-strong hover:text-text',
  ghost: 'bg-transparent text-muted hover:text-text',
  // Tylko wsparcie innych: Wspieram
  support: 'bg-support text-support-ink font-semibold hover:brightness-105',
  // Wyloguj, usuń
  danger: 'bg-transparent text-danger border border-danger-border font-semibold',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3 rounded-chip text-small gap-1.5',
  md: 'h-11 px-4 rounded-control text-ui gap-2',
  lg: 'h-12 px-5 rounded-control text-body gap-2',
  xl: 'h-[52px] px-6 rounded-control text-body-lg gap-2',
}

/** Przycisk w stylu prototypu v2. Nie twórz własnych przycisków z klas Tailwinda. */
export function Button({
  variant = 'primary',
  size = 'lg',
  icon,
  block = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap font-sans cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Wymagany opis dla czytników ekranu, np. „Powiadomienia”. */
  label: string
  children: ReactNode
}

/** Kwadratowy przycisk z samą ikoną (44 × 44 px), np. dzwonek, zamknij. */
export function IconButton({
  label,
  className,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface text-text cursor-pointer hover:border-border-strong',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
