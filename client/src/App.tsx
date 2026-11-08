import { useState, useEffect, useRef, useCallback } from 'react'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  LogOut,
  Plus,
  RotateCcw,
  Target,
} from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  GoalPill,
  IconButton,
  IconTile,
  Overline,
  ProgressBar,
  StatTile,
  cn,
} from './components/ui'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { useGoals } from './hooks/useGoals'
import { CATEGORY_LABELS, TYPE_LABELS } from './api/goals'
import { AddGoalModal } from './components/goals/AddGoalModal'
import { AuthPage } from './pages/AuthPage'

interface ServerStatus {
  status: 'ok' | 'error'
  message: string
}

function AppContent() {
  const {
    user,
    loading: authLoading,
    logout,
    sessionError,
    retrySessionCheck,
    loggingOut,
  } = useAuth()
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {
    goals,
    selectedGoal,
    selectedGoalId,
    loading: goalsLoading,
    setSelectedGoalId,
    handleGoalCreated,
  } = useGoals(!!user)

  const navRef = useRef<HTMLElement>(null)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const dragDistance = useRef(0)

  const updateScrollState = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const { scrollLeft, scrollWidth, clientWidth } = nav
    const overflow = scrollWidth > clientWidth + 2
    setHasOverflow(overflow)
    setCanScrollLeft(overflow && scrollLeft > 2)
    setCanScrollRight(overflow && scrollLeft < scrollWidth - clientWidth - 2)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav || goals.length === 0) return

    updateScrollState()
    const rafId = requestAnimationFrame(updateScrollState)

    const ro = new ResizeObserver(() => {
      updateScrollState()
    })
    ro.observe(nav)

    nav.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    const onWheel = (e: WheelEvent) => {
      if (nav.scrollWidth <= nav.clientWidth) return

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = nav.scrollWidth - nav.clientWidth
        const scrollsLeft = e.deltaY < 0 && nav.scrollLeft > 0
        const scrollsRight = e.deltaY > 0 && nav.scrollLeft < maxScroll

        if (scrollsLeft || scrollsRight) {
          e.preventDefault()
          nav.scrollLeft += e.deltaY
        }
      }
    }

    let isDown = false
    let startXPos = 0
    let scrollStart = 0

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      isDown = true
      dragDistance.current = 0
      startXPos = e.pageX
      scrollStart = nav.scrollLeft
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      const deltaX = e.pageX - startXPos
      dragDistance.current = Math.abs(deltaX)
      if (Math.abs(deltaX) > 3) {
        nav.scrollLeft = scrollStart - deltaX
      }
    }

    const onMouseUp = () => {
      isDown = false
    }

    nav.addEventListener('wheel', onWheel, { passive: false })
    nav.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      nav.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
      nav.removeEventListener('wheel', onWheel)
      nav.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [goals, updateScrollState])

  useEffect(() => {
    if (!selectedGoalId || !navRef.current) return
    const selectedEl = navRef.current.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (selectedEl) {
      selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }, [selectedGoalId])

  const handleScroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const amount = direction === 'left' ? -220 : 220
      navRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  const handlePillClick = (goalId: string) => {
    if (dragDistance.current > 5) return
    setSelectedGoalId(goalId)
  }

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data: ServerStatus) => {
        setServerStatus(data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        console.error('Error fetching API status:', err)
        setServerStatus({ status: 'error', message: 'Nie udało się połączyć z serwerem' })
        setLoading(false)
      })
  }, [])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-body text-muted">Sprawdzanie sesji użytkownika...</p>
      </div>
    )
  }

  if (sessionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-5 py-6 text-text">
        <div className="w-full max-w-md">
          <Card className="items-center text-center">
            <IconTile size="xl" className="border border-danger-border bg-surface-2 text-danger">
              <AlertTriangle size={32} />
            </IconTile>
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-sans text-title font-bold">Problem z połączeniem</h1>
              <p className="m-0 text-body text-muted">{sessionError}</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              block
              icon={<RotateCcw size={18} />}
              onClick={retrySessionCheck}
            >
              Spróbuj ponownie
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-4 px-5 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <IconTile>
            <Target size={24} />
          </IconTile>
          <div className="flex flex-col">
            <span className="font-display text-title font-extrabold">Secret Goals</span>
            <span className="text-caption text-muted">Twoje cele i nawyki</span>
          </div>
        </div>
        <IconButton label="Powiadomienia">
          <Bell size={20} />
        </IconButton>
      </header>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar alias={user.alias} tone="accent" size="md" />
            <div className="flex flex-col">
              <Overline accent>Twój anonimowy alias</Overline>
              <span className="text-label-lg font-bold">{user.alias}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<LogOut size={16} />}
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Wylogowywanie...' : 'Wyloguj'}
          </Button>
        </div>
      </Card>

      <Card>
        <Overline>Status połączenia z API</Overline>
        {loading ? (
          <p className="m-0 text-body text-muted">Sprawdzanie połączenia z serwerem...</p>
        ) : serverStatus?.status === 'ok' ? (
          <p className="m-0 flex items-center gap-2 text-body font-semibold text-accent-light">
            <Check size={18} />
            {serverStatus.message}
          </p>
        ) : (
          <p className="m-0 text-body font-semibold text-danger">
            {serverStatus?.message || 'Brak odpowiedzi serwera'}
          </p>
        )}
      </Card>

      {/* Nagłówek sekcji celów z licznikiem */}
      {goals.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <Overline>Twoje cele ({goals.length}/5)</Overline>
          {selectedGoal && (
            <span className="text-caption text-text-secondary">
              {goals.findIndex((g) => g.id === selectedGoalId) + 1} z {goals.length}
            </span>
          )}
        </div>
      )}

      {/* Nawigacja celów i przycisk dodawania */}
      {goals.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {hasOverflow && (
            <button
              type="button"
              aria-label="Przewiń cele w lewo"
              disabled={!canScrollLeft}
              onClick={() => handleScroll('left')}
              className={cn(
                'flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface text-muted transition',
                canScrollLeft
                  ? 'hover:border-border-strong hover:text-text cursor-pointer focus-visible:outline-2 focus-visible:outline-accent'
                  : 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          )}

          <nav
            ref={navRef}
            aria-label="Twoje cele"
            className="scrollbar-none flex flex-1 min-w-0 items-center gap-2 overflow-x-auto py-0.5 select-none cursor-grab active:cursor-grabbing"
          >
            {goals.map((g) => (
              <GoalPill
                key={g.id}
                selected={g.id === selectedGoalId}
                badge={g.isPublic ? 'Publiczny' : 'Prywatny'}
                onClick={() => handlePillClick(g.id)}
                title={g.title}
              >
                <span className="max-w-[140px] truncate sm:max-w-[220px]">{g.title}</span>
              </GoalPill>
            ))}
          </nav>

          {hasOverflow && (
            <button
              type="button"
              aria-label="Przewiń cele w prawo"
              disabled={!canScrollRight}
              onClick={() => handleScroll('right')}
              className={cn(
                'flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface text-muted transition',
                canScrollRight
                  ? 'hover:border-border-strong hover:text-text cursor-pointer focus-visible:outline-2 focus-visible:outline-accent'
                  : 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            aria-label="Dodaj nowy cel"
            onClick={() => setIsAddModalOpen(true)}
            className="flex size-11 shrink-0 items-center justify-center rounded-control border border-dashed border-border-strong bg-surface text-muted hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent cursor-pointer transition"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {goalsLoading ? (
        <Card className="items-center text-center py-6">
          <p className="m-0 text-body text-muted">Ładowanie Twoich celów...</p>
        </Card>
      ) : goals.length === 0 ? (
        /* Stan pustej listy celów */
        <Card className="items-center text-center py-8">
          <IconTile size="xl" className="bg-accent-soft text-accent">
            <Target size={32} />
          </IconTile>
          <div className="flex flex-col gap-1.5">
            <h2 className="m-0 font-sans text-heading font-bold">Brak aktywnych celów</h2>
            <p className="m-0 max-w-sm text-body text-muted">
              Nie masz jeszcze żadnego celu. Dodaj swój pierwszy cel, aby zaplanować realizację i
              zacząć budować serię!
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus size={18} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Dodaj pierwszy cel
          </Button>
        </Card>
      ) : selectedGoal ? (
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Overline>
                {CATEGORY_LABELS[selectedGoal.category]} · {TYPE_LABELS[selectedGoal.type]}
              </Overline>
              <h1 className="m-0 text-heading font-bold">{selectedGoal.title}</h1>
              {selectedGoal.description && (
                <p className="m-0 text-body text-muted">{selectedGoal.description}</p>
              )}
              {selectedGoal.targetDate && (
                <span className="text-caption text-text-secondary">
                  Termin: {selectedGoal.targetDate.slice(0, 10)}
                </span>
              )}
            </div>
            <Badge
              tone={selectedGoal.isPublic ? 'accent-soft' : 'neutral'}
              className="px-2.5 py-1.5 shrink-0"
            >
              {selectedGoal.isPublic ? 'Publiczny' : 'Prywatny'}
            </Badge>
          </div>
          <div className="flex items-end gap-3.5">
            <IconTile size="xl">
              <Flame size={34} />
            </IconTile>
            <div className="flex flex-col">
              <span className="font-display text-stat font-extrabold tabular-nums">0</span>
              <span className="mt-1 text-ui text-muted">dni serii (nowy cel)</span>
            </div>
          </div>
          <ProgressBar value={0} label="0 dni do pierwszego kamienia milowego" />
          <div className="grid grid-cols-3 gap-2">
            <StatTile value="0" label="najdłuższa seria" />
            <StatTile value="0/7" label="dni w tym tygodniu" />
            <StatTile value="Aktywny" label="status" />
          </div>
          <Button
            variant="secondary"
            size="lg"
            icon={<BookOpen size={18} className="text-accent" />}
          >
            Strategie i poradniki
          </Button>
        </Card>
      ) : null}

      <Card>
        <h2 className="m-0 font-sans text-body-lg font-semibold">Jak dziś idzie?</h2>
        <div className="flex gap-2">
          <Button className="flex-1" icon={<Check size={18} strokeWidth={2.5} />}>
            Zaliczone na dziś
          </Button>
          <Button variant="outline" icon={<RotateCcw size={16} />}>
            Potknięcie
          </Button>
        </div>
      </Card>

      <Card>
        <Overline>Nie jesteś sam</Overline>
        <div className="flex items-center gap-2.5">
          <Avatar alias="Anon_Sparrow24" />
          <div className="flex flex-col">
            <span className="text-label-lg font-semibold">Anon_Sparrow24</span>
            <span className="text-caption text-muted">Zero nikotyny · dzień 18</span>
          </div>
        </div>
        <Button variant="support" size="md" className="self-start" icon={<Heart size={18} />}>
          Wspieram
        </Button>
      </Card>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
