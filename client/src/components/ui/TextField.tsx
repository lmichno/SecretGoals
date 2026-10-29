import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  /** Podpowiedź pod polem, np. „Co najmniej 8 znaków, w tym cyfra.” */
  hint?: string
  error?: string
  /** Element po prawej stronie etykiety, np. link „Nie pamiętasz hasła?”. */
  labelAside?: ReactNode
  /** Element wewnątrz pola po prawej, np. przycisk pokaż hasło. */
  trailing?: ReactNode
}

/** Pole formularza: etykieta 13 px, pole 50 px, zielony obrys przy focusie. */
export function TextField({
  label,
  hint,
  error,
  labelAside,
  trailing,
  id,
  className,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={inputId} className="text-small font-semibold text-text-secondary">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            'h-[50px] w-full rounded-control border bg-surface px-3.5 text-body text-text placeholder:text-muted',
            'focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-accent',
            error ? 'border-danger-border' : 'border-border',
            trailing ? 'pr-13' : undefined
          )}
          {...rest}
        />
        {trailing && <div className="absolute top-[3px] right-[3px]">{trailing}</div>}
      </div>
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : (
        hint && <span className="text-caption text-muted">{hint}</span>
      )}
    </div>
  )
}
