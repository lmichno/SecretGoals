import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

interface GoalPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
  /** Krótka wartość po prawej: „18 dni”, „40%”, „1/3”. */
  badge?: ReactNode
}

/** Przycisk w przełączniku celów u góry ekranu Cele. */
export function GoalPill({ selected, badge, className, children, ...rest }: GoalPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex h-11 shrink-0 items-center gap-2 rounded-control border px-3.5 text-ui cursor-pointer',
        selected
          ? 'border-accent bg-accent-subtle font-semibold text-text'
          : 'border-border bg-surface font-medium text-text-secondary',
        className
      )}
      {...rest}
    >
      <span>{children}</span>
      {badge !== undefined && <Badge tone={selected ? 'accent' : 'neutral'}>{badge}</Badge>}
    </button>
  )
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'accent' | 'accent-soft'
}

/** Mała pigułka z liczbą lub etykietą. */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  const tones = {
    neutral: 'bg-surface-3 text-text-secondary',
    accent: 'bg-accent text-accent-ink font-bold',
    'accent-soft': 'bg-accent-subtle text-accent-light font-semibold',
  }
  return (
    <span
      className={cn('rounded-full px-2 py-0.5 text-caption', tones[tone], className)}
      {...rest}
    />
  )
}

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

/** Filtr feedu Społeczności: Dla Ciebie, Podobne cele, Kamienie milowe, Poradniki. */
export function FilterChip({ selected, className, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={cn(
        'h-9 shrink-0 rounded-full px-3 text-small cursor-pointer',
        selected
          ? 'bg-text font-bold text-bg'
          : 'border border-text/20 bg-bg/60 font-medium text-text-soft',
        className
      )}
      {...rest}
    />
  )
}
