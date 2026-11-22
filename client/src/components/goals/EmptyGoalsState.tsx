import { Plus, Target } from 'lucide-react'
import { Button, Card } from '../ui'
import { initialsFromAlias } from '../ui/alias'

interface EmptyGoalsStateProps {
  alias: string
  onAddGoal: () => void
  onExplore?: () => void
}

/**
 * Pusty stan ekranu celów powitanie po rejestracji (stan S-cele-pusto / SD-cele-pusto).
 */
export function EmptyGoalsState({ alias, onAddGoal, onExplore }: EmptyGoalsStateProps) {
  const initials = initialsFromAlias(alias)

  return (
    <Card className="max-w-[570px] mx-auto w-full p-6 lg:p-7 flex flex-col gap-4.5">
      <div className="size-14 rounded-panel bg-accent-soft text-accent flex items-center justify-center shrink-0">
        <Target size={28} aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption font-semibold tracking-wider uppercase text-accent-light">
          Konto gotowe
        </span>
        <h2 className="m-0 font-display text-heading lg:text-[32px] font-bold text-text leading-tight">
          Witaj w Secret Goals
        </h2>
        <p className="m-0 text-body text-text-secondary leading-relaxed">
          Od teraz jesteś tu jako:
        </p>
      </div>

      <div className="flex items-center gap-3 p-3.5 lg:p-4 rounded-panel bg-surface-2">
        <div className="size-11 rounded-control bg-accent-soft text-accent flex items-center justify-center font-bold text-ui shrink-0">
          {initials}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-label-lg font-bold text-text">{alias}</span>
          <span className="text-caption text-muted">
            Tylko to widzą inni. E-mail zostaje u nas.
          </span>
        </div>
      </div>

      <p className="m-0 text-body text-text-secondary leading-relaxed">
        Nie musisz niczego ustawiać od razu. Na początek wystarczy jeden mały cel, resztę odkryjesz
        po drodze.
      </p>

      <div className="flex flex-col gap-2 pt-1">
        <Button
          variant="primary"
          size="lg"
          block
          icon={<Plus size={18} aria-hidden="true" />}
          onClick={onAddGoal}
        >
          Dodaj pierwszy cel
        </Button>
        {/* Link prowadzi do Społeczności; zanim powstanie, nie pokazujemy martwego przycisku. */}
        {onExplore && (
          <button
            type="button"
            onClick={onExplore}
            className="self-center py-2.5 px-3 text-ui font-semibold text-accent-light hover:text-accent-lighter transition cursor-pointer"
          >
            Najpierw się rozejrzę
          </button>
        )}
      </div>
    </Card>
  )
}
