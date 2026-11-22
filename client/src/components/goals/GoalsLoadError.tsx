import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button, Card } from '../ui'

interface GoalsLoadErrorProps {
  onRetry: () => void
  retrying?: boolean
}

/** Błąd wczytywania listy celów (stan S-cele-blad / SD-cele-blad). */
export function GoalsLoadError({ onRetry, retrying = false }: GoalsLoadErrorProps) {
  return (
    <Card className="items-center px-5 py-8 lg:px-6 lg:py-14" role="alert">
      <div className="flex max-w-[420px] flex-col items-center gap-3.5 text-center">
        <div
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-panel bg-danger-soft text-danger lg:size-16 lg:rounded-icon"
        >
          <AlertTriangle size={28} />
        </div>
        <h2 className="m-0 font-display text-title font-bold lg:text-[28px]">
          Nie udało się wczytać celów
        </h2>
        <p className="m-0 text-body text-muted">
          Sprawdź połączenie z internetem i spróbuj ponownie. Twoje serie są bezpieczne.
        </p>
        <Button
          variant="secondary"
          size="xl"
          block
          className="text-body lg:w-60"
          icon={<RotateCcw size={18} aria-hidden="true" />}
          onClick={onRetry}
          disabled={retrying}
        >
          Spróbuj ponownie
        </Button>
      </div>
    </Card>
  )
}
