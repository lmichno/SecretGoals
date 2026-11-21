import { BookOpen, Calendar, Flame, Target } from 'lucide-react'
import { Badge, Button, Card, IconTile, Overline, ProgressBar, StatTile } from '../ui'
import { CATEGORY_LABELS, TYPE_LABELS, type Goal } from '../../api/goals'

interface GoalCardProps {
  goal: Goal
  onTipsClick?: () => void
}

/**
 * Główna karta celu (US02 / US03).
 * Wygląd i statystyki dostosowane do typu celu (seria dzienna / kwota / licznik) wg prototypu v2.
 */
export function GoalCard({ goal, onTipsClick }: GoalCardProps) {
  const categoryLabel = CATEGORY_LABELS[goal.category] ?? goal.category
  const typeLabel = TYPE_LABELS[goal.type] ?? goal.type

  return (
    <Card className="flex flex-col gap-4 sm:gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Overline>
            {categoryLabel} · {typeLabel}
          </Overline>
          <h2 className="m-0 font-display text-heading lg:text-heading-lg font-bold text-text leading-tight">
            {goal.title}
          </h2>
          {goal.description && (
            <p className="m-0 text-body text-muted leading-relaxed">{goal.description}</p>
          )}
          {goal.targetDate && (
            <span className="text-caption text-text-secondary">
              Termin: {goal.targetDate.slice(0, 10)}
            </span>
          )}
        </div>
        <Badge tone={goal.isPublic ? 'accent-soft' : 'neutral'} className="px-2.5 py-1.5 shrink-0">
          {goal.isPublic ? 'Publiczny' : 'Prywatny'}
        </Badge>
      </div>

      {goal.type === 'daily_streak' && (
        <>
          <div className="flex items-end gap-3.5">
            <IconTile size="xl" className="bg-accent-soft text-accent">
              <Flame size={34} aria-hidden="true" />
            </IconTile>
            <div className="flex flex-col">
              <span className="font-display text-stat lg:text-stat-lg font-extrabold tabular-nums leading-none">
                0
              </span>
              <span className="mt-1 text-ui text-muted">dni z rzędu</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <ProgressBar value={0} label="0 / 21 dni do kamienia milowego" />
            <span className="text-caption text-muted leading-relaxed">
              Po 21 dniach w społeczności pojawi się automatyczny post z Twoim kamieniem milowym.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatTile value="0" label="najdłuższa seria" />
            <StatTile value="0/7" label="dni w tym tygodniu" />
            <StatTile value="0" label="kamieni milowych" />
          </div>
        </>
      )}

      {goal.type === 'amount' && (
        <>
          <div className="flex items-end gap-3.5">
            <IconTile size="xl" className="bg-accent-soft text-accent">
              <Target size={34} aria-hidden="true" />
            </IconTile>
            <div className="flex flex-col">
              <span className="font-display text-stat lg:text-stat-lg font-extrabold tabular-nums leading-none">
                0 zł
              </span>
              <span className="mt-1 text-ui text-muted">
                z {goal.targetValue !== null ? Number(goal.targetValue).toLocaleString('pl-PL') : 0}{' '}
                zł
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <ProgressBar
              value={0}
              label={`0 zł z ${goal.targetValue !== null ? Number(goal.targetValue).toLocaleString('pl-PL') : 0} zł`}
            />
            <span className="text-caption text-muted leading-relaxed">
              {goal.targetDate
                ? `Termin: ${goal.targetDate.slice(0, 10)}.`
                : 'Zapisuj wpłaty, aby zbliżać się do kwoty docelowej.'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatTile value="0" label="wpłat" />
            <StatTile value="0 zł" label="średnia wpłata" />
            <StatTile value="0%" label="realizacji" />
          </div>
        </>
      )}

      {goal.type === 'weekly_count' && (
        <>
          <div className="flex items-end gap-3.5">
            <IconTile size="xl" className="bg-accent-soft text-accent">
              <Calendar size={34} aria-hidden="true" />
            </IconTile>
            <div className="flex flex-col">
              <span className="font-display text-stat lg:text-stat-lg font-extrabold tabular-nums leading-none">
                0/{goal.targetValue ?? 3}
              </span>
              <span className="mt-1 text-ui text-muted">w tym tygodniu</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <ProgressBar
              value={0}
              label={`0 / ${goal.targetValue ?? 3} powtórzeń w tym tygodniu`}
            />
            <span className="text-caption text-muted leading-relaxed">
              Tydzień kończy się w niedzielę.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatTile value="0" label="tygodni z rzędu" />
            <StatTile value="0" label="łącznie" />
            <StatTile value="0" label="w tym tygodniu" />
          </div>
        </>
      )}

      <Button
        variant="secondary"
        size="lg"
        icon={<BookOpen size={18} className="text-accent" />}
        onClick={onTipsClick}
        className="self-start"
      >
        Strategie i poradniki
      </Button>
    </Card>
  )
}
