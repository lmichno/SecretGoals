import { Users } from 'lucide-react'
import { Card, Overline } from '../ui'
import { CATEGORY_LABELS, type Goal } from '../../api/goals'

/**
 * „Nie jesteś sam” w stanie bez rówieśnika (S-cele-brak-rowiesnika).
 * Dopasowywanie osób z podobnym celem to dalsze US, więc nie pokazujemy zmyślonego aliasu.
 */
export function PeerCard({ goal }: { goal: Goal }) {
  return (
    <Card aria-label="Ktoś z podobnym celem" className="gap-3 px-5 py-[18px]">
      <Overline>Nie jesteś sam</Overline>
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-control bg-support-soft text-support"
        >
          <Users size={22} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-body font-semibold">Szukamy kogoś z podobnym celem</span>
          <span className="text-small leading-[1.45] text-muted">
            Gdy ktoś zacznie publiczny cel z kategorii {CATEGORY_LABELS[goal.category]}, zobaczysz
            go tutaj.
          </span>
        </div>
      </div>
    </Card>
  )
}
