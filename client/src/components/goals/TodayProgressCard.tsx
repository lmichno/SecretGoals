import { Check, RotateCcw } from 'lucide-react'
import { Button, Card } from '../ui'
import type { Goal } from '../../api/goals'

/**
 * „Jak dziś idzie?” (Main.dc.html). Zapisywanie postępu to US03, więc przyciski są widoczne
 * jak w makiecie, ale zablokowane, z krótką informacją zamiast martwych kliknięć.
 */
export function TodayProgressCard({ goal }: { goal: Goal }) {
  const target = goal.targetValue ?? 3

  return (
    <Card aria-label="Aktualizacja postępu" className="gap-3 px-5 py-[18px]">
      <h2 className="m-0 font-sans text-body-lg font-semibold">Jak dziś idzie?</h2>

      {goal.type === 'daily_streak' && (
        <div className="flex gap-2">
          <Button
            disabled
            className="min-w-0 flex-1 whitespace-normal text-center leading-tight"
            icon={<Check size={18} strokeWidth={2.5} aria-hidden="true" />}
          >
            Zaliczone na dziś
          </Button>
          <Button
            variant="outline"
            disabled
            className="shrink-0 gap-1.5 px-3.5 text-ui"
            icon={<RotateCcw size={16} aria-hidden="true" />}
          >
            Potknięcie
          </Button>
        </div>
      )}

      {goal.type === 'amount' && (
        <div className="flex gap-2">
          <Button variant="secondary" disabled className="min-w-0 flex-1 px-2">
            +100 zł
          </Button>
          <Button variant="secondary" disabled className="min-w-0 flex-1 px-2">
            +500 zł
          </Button>
          <Button disabled className="min-w-0 flex-1 px-2">
            Inna kwota
          </Button>
        </div>
      )}

      {goal.type === 'weekly_count' && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled
            aria-label="Odejmij jeden"
            className="w-12 px-0 text-title"
          >
            −
          </Button>
          <div className="flex-1 text-center font-display text-[28px] font-bold">0/{target}</div>
          <Button disabled className="px-[18px]">
            +1
          </Button>
        </div>
      )}

      <p className="m-0 text-small text-muted">Zapisywanie postępu będzie dostępne wkrótce.</p>
    </Card>
  )
}
