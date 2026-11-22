import { useId, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { cn } from './cn'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  /** Podpowiedź pod polem, np. „Maksymalnie 1000 znaków.” */
  hint?: string
  error?: string
  labelAside?: ReactNode
}

/** Wielowierszowe pole formularza: etykieta 13 px, zielony obrys przy focusie. */
export function TextArea({
  label,
  hint,
  error,
  labelAside,
  id,
  className,
  rows = 3,
  ...rest
}: TextAreaProps) {
  const autoId = useId()
  const textareaId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={textareaId} className="text-small font-semibold text-text-secondary">
          {label}
        </label>
        {labelAside}
      </div>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          'min-h-[88px] w-full resize-y rounded-control border bg-surface p-3.5 text-body text-text placeholder:text-muted',
          'focus:border-transparent focus:outline-2 focus:outline-offset-1 focus:outline-accent',
          error ? 'border-danger-border' : 'border-border'
        )}
        {...rest}
      />
      {error ? (
        <span className="text-caption text-danger">{error}</span>
      ) : (
        hint && <span className="text-caption text-muted">{hint}</span>
      )}
    </div>
  )
}
