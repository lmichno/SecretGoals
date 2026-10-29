import { cn } from './cn'

interface StatTileProps {
  value: string
  label: string
  /** support: niebieski kafelek z liczbą wspierających. */
  tone?: 'neutral' | 'support'
  className?: string
}

/** Kafelek statystyki: duża liczba (Bricolage) i podpis pod nią. */
export function StatTile({ value, label, tone = 'neutral', className }: StatTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-control px-3 py-2.5',
        tone === 'support' ? 'bg-support-soft' : 'bg-surface-2',
        className
      )}
    >
      <span className="font-display text-[20px] font-bold tabular-nums">{value}</span>
      <span
        className={cn(
          'text-tiny leading-[1.3]',
          tone === 'support' ? 'text-support-muted' : 'text-muted'
        )}
      >
        {label}
      </span>
    </div>
  )
}
