import { CalendarCheck, Flame, PiggyBank, type LucideIcon } from 'lucide-react'
import { Badge, Card, IconTile, Overline, ProgressBar, StatTile, cn } from '../ui'
import { CATEGORY_LABELS, TYPE_LABELS, type Goal, type GoalType } from '../../api/goals'

interface GoalCardProps {
  goal: Goal
}

interface Stat {
  value: string
  label: string
}

interface CardContent {
  icon: LucideIcon
  big: string
  bigLabel: string
  progressLabel: string
  /** Podpowiedź pod paskiem, gdy cel nie ma terminu (null = brak). */
  defaultHint: string | null
  stats: Stat[]
}

/** Próg pierwszego kamienia milowego serii (prototyp: „18 / 21 dni do kamienia milowego”). */
const STREAK_MILESTONE_DAYS = 21

const PRIVATE_HINT =
  'Cel prywatny: nie pojawia się w społeczności, ale możesz go upublicznić w każdej chwili.'

/** „8 000 zł” (w pl-PL domyślnie liczby 4-cyfrowe nie mają separatora tysięcy). */
const formatPln = (value: number) =>
  `${value
    .toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, '\u00a0')
    .replace('.', ',')} zł`

/** „2027-03-01T00:00:00.000Z” → „1 marca 2027” (kontrakt: termin to północ UTC). */
function formatTargetDate(targetDate: string): string {
  return new Date(targetDate).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Treść karty zależna od typu, wg `goals` w Main.dc.html. Postęp (US03) jeszcze nie istnieje,
 * więc liczby są zerowe, a z prototypu bierzemy tylko etykiety, które pasują do każdego celu.
 */
function contentFor(type: GoalType, targetValue: number | null): CardContent {
  switch (type) {
    case 'daily_streak':
      return {
        icon: Flame,
        big: '0',
        bigLabel: 'dni z rzędu',
        progressLabel: `0 / ${STREAK_MILESTONE_DAYS} dni do kamienia milowego`,
        defaultHint: `Po ${STREAK_MILESTONE_DAYS} dniach w społeczności pojawi się automatyczny post z Twoim kamieniem milowym.`,
        stats: [
          { value: '0', label: 'najdłuższa seria' },
          { value: '0/7', label: 'dni w tym tygodniu' },
        ],
      }
    case 'amount': {
      const target = targetValue ?? 0
      return {
        icon: PiggyBank,
        big: formatPln(0),
        bigLabel: `z ${formatPln(target)}`,
        progressLabel: `Kamień milowy przy ${formatPln(Math.round(target / 2))}`,
        defaultHint: 'Zapisuj wpłaty, aby zbliżać się do kwoty docelowej.',
        stats: [
          { value: '0', label: 'wpłat w tym miesiącu' },
          { value: formatPln(0), label: 'średnia wpłata' },
          { value: '0 tyg.', label: 'aktywności' },
        ],
      }
    }
    case 'weekly_count': {
      const target = targetValue ?? 3
      return {
        icon: CalendarCheck,
        big: `0/${target}`,
        bigLabel: 'w tym tygodniu',
        progressLabel: 'Tydzień kończy się w niedzielę',
        defaultHint: null,
        stats: [
          { value: '0', label: 'tygodnie z rzędu' },
          { value: '0', label: 'łącznie' },
        ],
      }
    }
  }
}

/** Główna karta celu (Main.dc.html / DesktopGoals.dc.html, makieta 04). */
export function GoalCard({ goal }: GoalCardProps) {
  const content = contentFor(goal.type, goal.targetValue)
  const Icon = content.icon
  const hint = goal.targetDate
    ? `Termin: ${formatTargetDate(goal.targetDate)}.`
    : goal.isPublic
      ? content.defaultHint
      : PRIVATE_HINT

  return (
    <Card aria-label="Wybrany cel" className="gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Overline>
            {CATEGORY_LABELS[goal.category]} · {TYPE_LABELS[goal.type]}
          </Overline>
          <h2 className="m-0 font-display text-heading font-bold break-words lg:text-heading-lg">
            {goal.title}
          </h2>
          {goal.description && (
            <p className="m-0 text-small leading-[1.45] text-muted">{goal.description}</p>
          )}
        </div>
        <Badge className="shrink-0 px-2.5 py-1.5">{goal.isPublic ? 'Publiczny' : 'Prywatny'}</Badge>
      </div>

      <div className="flex items-center gap-3.5">
        <IconTile size="xl">
          <Icon size={30} />
        </IconTile>
        <div className="flex min-w-0 flex-col">
          <span className="font-display text-stat font-extrabold tabular-nums lg:text-stat-lg">
            {content.big}
          </span>
          <span className="mt-1 text-ui text-muted">{content.bigLabel}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <ProgressBar value={0} label={content.progressLabel} />
        {hint && <span className="text-caption leading-[1.4] text-muted">{hint}</span>}
      </div>

      <div className={cn('grid gap-2', content.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
        {content.stats.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </Card>
  )
}
