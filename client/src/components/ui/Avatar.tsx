import { cn } from './cn'
import { initialsFromAlias } from './alias'

interface AvatarProps {
  /** Alias, np. „Anon_Falcon92”. Inicjały liczone są z części przed i po „_”. */
  alias: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'neutral' | 'accent' | 'support'
  className?: string
}

/**
 * Awatar z inicjałami aliasu. W aplikacji NIE MA zdjęć profilowych (anonimowość),
 * więc nie dodawaj <img> ani losowych avatarów z internetu.
 */
export function Avatar({ alias, size = 'md', tone = 'neutral', className }: AvatarProps) {
  const sizes = {
    sm: 'size-8 rounded-[10px] text-tiny',
    md: 'size-10 rounded-[13px] text-small',
    lg: 'size-14 rounded-panel text-label-lg',
  }
  const tones = {
    neutral: 'bg-surface-3 text-accent-light',
    accent: 'bg-accent-soft text-accent',
    support: 'bg-support-soft text-support',
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center font-bold',
        sizes[size],
        tones[tone],
        className
      )}
    >
      {initialsFromAlias(alias)}
    </div>
  )
}
