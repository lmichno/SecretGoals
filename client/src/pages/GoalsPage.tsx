import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Card } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useGoals } from '../hooks/useGoals'
import { MobileHeader } from '../components/layout/MobileHeader'
import { GoalSwitcher } from '../components/goals/GoalSwitcher'
import { GoalCard } from '../components/goals/GoalCard'
import { TodayProgressCard } from '../components/goals/TodayProgressCard'
import { PeerCard } from '../components/goals/PeerCard'
import { EmptyGoalsState } from '../components/goals/EmptyGoalsState'
import { GoalsLoadError } from '../components/goals/GoalsLoadError'
import { AddGoalModal } from '../components/goals/AddGoalModal'

/**
 * Ekran Cele (US02, ADR-013): makiety 03 (powitanie) i 04 (cele),
 * stany S-cele-ladowanie, S-cele-blad, S-cele-pusto. Układ (sidebar / dolna nawigacja) daje AppLayout.
 */
export function GoalsPage() {
  const { user } = useAuth()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const {
    goals,
    selectedGoal,
    selectedGoalId,
    loading,
    loadFailed,
    setSelectedGoalId,
    handleGoalCreated,
    refreshGoals,
  } = useGoals()

  if (!user) return null

  const openAddModal = () => setIsAddModalOpen(true)
  const showNewGoalButton = !loading && (loadFailed || goals.length > 0)

  return (
    <main className="flex flex-col gap-3.5 px-5 pt-[18px] pb-6 lg:gap-6 lg:px-[clamp(16px,4vw,48px)] lg:pt-8 lg:pb-12">
      <MobileHeader alias={user.alias} />

      {/* Tytuł widoczny od lg; na telefonie makieta zaczyna się od nagłówka z aliasem. */}
      <div className="sr-only lg:not-sr-only lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-4">
        <h1 className="m-0 font-display text-page font-bold">Twoje cele</h1>
        {showNewGoalButton && (
          <Button
            size="md"
            className="hidden px-[18px] lg:inline-flex"
            icon={<Plus size={18} aria-hidden="true" />}
            onClick={openAddModal}
          >
            Nowy cel
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="items-center py-6 text-center" aria-busy="true">
          <p className="m-0 text-body text-muted">Ładowanie Twoich celów...</p>
        </Card>
      ) : loadFailed ? (
        <GoalsLoadError onRetry={() => void refreshGoals()} />
      ) : goals.length === 0 ? (
        <EmptyGoalsState alias={user.alias} onAddGoal={openAddModal} />
      ) : (
        <>
          <GoalSwitcher
            goals={goals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
            onAddGoal={openAddModal}
          />
          {selectedGoal && (
            <div className="grid items-start gap-3.5 lg:grid-cols-2 lg:gap-5">
              <GoalCard goal={selectedGoal} />
              <div className="flex flex-col gap-3.5 lg:gap-5">
                <TodayProgressCard goal={selectedGoal} />
                <PeerCard goal={selectedGoal} />
              </div>
            </div>
          )}
        </>
      )}

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGoalCreated={handleGoalCreated}
      />
    </main>
  )
}
