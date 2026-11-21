import { Plus } from 'lucide-react'
import { GoalPill } from '../ui'
import type { Goal } from '../../api/goals'

interface GoalSwitcherProps {
  goals: Goal[]
  selectedGoalId: string | null
  onSelectGoal: (id: string) => void
  onAddGoal: () => void
}

function getGoalBadge(goal: Goal): string {
  if (goal.type === 'daily_streak') {
    return '0 dni'
  }
  if (goal.type === 'amount') {
    return '0%'
  }
  return `0/${goal.targetValue ?? 3}`
}

/**
 * Przełącznik celów zgodny z prototypem v2 (Main.dc.html / DesktopGoals.dc.html).
 * Mobile: poziomy scroll z przyciskiem „+” na końcu.
 * Desktop: zawijane pigułki (flex-wrap) bez zbędnych strzałek.
 */
export function GoalSwitcher({
  goals,
  selectedGoalId,
  onSelectGoal,
  onAddGoal,
}: GoalSwitcherProps) {
  if (goals.length === 0) return null

  return (
    <nav
      aria-label="Twoje cele"
      className="scrollbar-none flex min-w-0 items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible py-0.5"
    >
      {goals.map((g) => (
        <GoalPill
          key={g.id}
          selected={g.id === selectedGoalId}
          badge={getGoalBadge(g)}
          onClick={() => onSelectGoal(g.id)}
          title={g.title}
        >
          <span className="max-w-[140px] truncate sm:max-w-[200px]">{g.title}</span>
        </GoalPill>
      ))}

      {/* Przycisk „+” na mobile na końcu przewijanego paska */}
      <button
        type="button"
        aria-label="Dodaj nowy cel"
        onClick={onAddGoal}
        className="flex size-11 shrink-0 items-center justify-center rounded-control border border-dashed border-border-strong bg-transparent text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent cursor-pointer transition sm:hidden"
      >
        <Plus size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}
