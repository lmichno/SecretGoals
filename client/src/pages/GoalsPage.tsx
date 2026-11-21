import { useState } from 'react'
import { Bell, Check, Heart, LogOut, Plus, RotateCcw, Target } from 'lucide-react'
import { Avatar, Button, Card, IconButton, IconTile, Overline } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useGoals } from '../hooks/useGoals'
import { GoalSwitcher } from '../components/goals/GoalSwitcher'
import { GoalCard } from '../components/goals/GoalCard'
import { EmptyGoalsState } from '../components/goals/EmptyGoalsState'
import { AddGoalModal } from '../components/goals/AddGoalModal'

/**
 * Główny widok celów (US02, ADR-013).
 * Odwzorowuje prototyp v2 (Main.dc.html / DesktopGoals.dc.html oraz stany S-cele-pusto / SD-cele-pusto).
 */
export function GoalsPage() {
  const { user, logout, loggingOut } = useAuth()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {
    goals,
    selectedGoal,
    selectedGoalId,
    loading: goalsLoading,
    setSelectedGoalId,
    handleGoalCreated,
  } = useGoals(!!user)

  if (!user) return null

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-5 py-6">
      {/* Nagłówek aplikacji */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IconTile>
            <Target size={24} aria-hidden="true" />
          </IconTile>
          <div className="flex flex-col">
            <span className="font-display text-title font-extrabold text-text">Secret Goals</span>
            <span className="text-caption text-muted">Twoje cele i nawyki</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="Powiadomienia">
            <Bell size={20} aria-hidden="true" />
          </IconButton>
        </div>
      </header>

      {/* Pasek profilu użytkownika */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar alias={user.alias} tone="accent" size="md" />
            <div className="flex flex-col">
              <Overline accent>Twój anonimowy alias</Overline>
              <span className="text-label-lg font-bold text-text">{user.alias}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<LogOut size={16} aria-hidden="true" />}
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Wylogowywanie...' : 'Wyloguj'}
          </Button>
        </div>
      </Card>

      {/* Tytuł sekcji celów i przycisk Nowy cel na desktopie */}
      {goals.length > 0 && (
        <div className="flex items-center justify-between pt-1">
          <h1 className="m-0 font-display text-title sm:text-page font-bold text-text">
            Twoje cele
          </h1>
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={18} aria-hidden="true" />}
            onClick={() => setIsAddModalOpen(true)}
            className="hidden sm:inline-flex"
          >
            Nowy cel
          </Button>
        </div>
      )}

      {/* Przełącznik celów (GoalSwitcher) */}
      {goals.length > 0 && (
        <GoalSwitcher
          goals={goals}
          selectedGoalId={selectedGoalId}
          onSelectGoal={setSelectedGoalId}
          onAddGoal={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Główna treść: ładowanie / pusty stan / wybrany cel */}
      {goalsLoading ? (
        <Card className="items-center text-center py-6">
          <p className="m-0 text-body text-muted">Ładowanie Twoich celów...</p>
        </Card>
      ) : goals.length === 0 ? (
        <EmptyGoalsState alias={user.alias} onAddGoal={() => setIsAddModalOpen(true)} />
      ) : selectedGoal ? (
        <>
          <GoalCard goal={selectedGoal} />

          {/* Sekcja postępu dzisiejszego („Jak dziś idzie?”) */}
          <Card className="p-4 sm:p-5 flex flex-col gap-3">
            <h3 className="m-0 font-sans text-body-lg font-semibold text-text">Jak dziś idzie?</h3>
            {selectedGoal.type === 'daily_streak' && (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  icon={<Check size={18} strokeWidth={2.5} aria-hidden="true" />}
                >
                  Zaliczone na dziś
                </Button>
                <Button variant="outline" icon={<RotateCcw size={16} aria-hidden="true" />}>
                  Potknięcie
                </Button>
              </div>
            )}
            {selectedGoal.type === 'amount' && (
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  +100 zł
                </Button>
                <Button variant="secondary" className="flex-1">
                  +500 zł
                </Button>
                <Button className="flex-1">Inna kwota</Button>
              </div>
            )}
            {selectedGoal.type === 'weekly_count' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-12 h-12 text-title">
                  −
                </Button>
                <div className="flex-1 text-center font-display text-heading font-bold text-text">
                  0/{selectedGoal.targetValue ?? 3}
                </div>
                <Button className="flex-1">+1</Button>
              </div>
            )}
          </Card>

          {/* Sekcja „Nie jesteś sam” */}
          <Card className="p-4 sm:p-5 flex flex-col gap-3">
            <Overline>Nie jesteś sam</Overline>
            <div className="flex items-center gap-2.5">
              <Avatar alias="Anon_Sparrow24" />
              <div className="flex flex-col">
                <span className="text-label-lg font-semibold text-text">Anon_Sparrow24</span>
                <span className="text-caption text-muted">Zero nikotyny · dzień 18</span>
              </div>
            </div>
            <Button
              variant="support"
              size="md"
              className="self-start"
              icon={<Heart size={18} aria-hidden="true" />}
            >
              Wspieram
            </Button>
          </Card>
        </>
      ) : null}

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  )
}
