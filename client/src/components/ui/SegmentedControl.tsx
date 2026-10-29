import { cn } from './cn'

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}

/** Przełącznik zakładek na zielono (Logowanie / Rejestracja). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('grid gap-1 rounded-tile border border-border bg-surface p-1', className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-11 rounded-chip text-body cursor-pointer',
              selected ? 'bg-accent font-bold text-accent-ink' : 'font-medium text-text-secondary'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
