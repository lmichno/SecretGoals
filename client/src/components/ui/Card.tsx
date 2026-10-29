import type { HTMLAttributes } from 'react'
import { cn } from './cn'

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Element HTML karty, domyślnie <section>. */
  as?: 'section' | 'div' | 'article'
}

/** Główna karta: tło surface, obramowanie, zaokrąglenie 24 px, padding 20 px. */
export function Card({ as: Tag = 'section', className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'flex flex-col gap-4 rounded-card border border-border bg-surface p-5',
        className
      )}
      {...rest}
    />
  )
}

/** Mały nadtytuł nad nagłówkiem: „NAŁÓG · SERIA DZIENNA”, „NIE JESTEŚ SAM”. */
export function Overline({
  accent = false,
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { accent?: boolean }) {
  return (
    <span
      className={cn(
        'text-caption font-semibold uppercase tracking-[0.06em]',
        accent ? 'text-accent-light' : 'text-muted',
        className
      )}
      {...rest}
    />
  )
}
