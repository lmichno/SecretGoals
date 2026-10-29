import { cn } from './cn'

interface ProgressBarProps {
  /** Postęp w procentach, 0–100. */
  value: number
  label?: string
  className?: string
}

/** Pasek postępu do kamienia milowego: tor 8 px, zielone wypełnienie. */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex justify-between text-small">
          <span className="text-text-secondary">{label}</span>
          <span className="font-semibold text-accent-light">{pct}%</span>
        </div>
      )}
      <span className="sr-only">Postęp: {pct}%</span>
      <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
