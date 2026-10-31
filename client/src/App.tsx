import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Check,
  Flame,
  Heart,
  LogOut,
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
} from './components/ui'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
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
  const [goal, setGoal] = useState(0)

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

  const goals = [
    { name: 'Bez nikotyny', badge: '18 dni' },
    { name: 'Spłata długu', badge: '40%' },
    { name: 'Wysyłanie CV', badge: '1/3' },
  ]

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

      <nav aria-label="Twoje cele" className="scrollbar-none flex gap-2 overflow-x-auto">
        {goals.map((g, i) => (
          <GoalPill key={g.name} selected={i === goal} badge={g.badge} onClick={() => setGoal(i)}>
            {g.name}
          </GoalPill>
        ))}
      </nav>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Overline>Nałóg · seria dzienna</Overline>
            <h1 className="m-0 text-heading font-bold">Zero nikotyny</h1>
          </div>
          <Badge className="px-2.5 py-1.5">Publiczny</Badge>
        </div>
        <div className="flex items-end gap-3.5">
          <IconTile size="xl">
            <Flame size={34} />
          </IconTile>
          <div className="flex flex-col">
            <span className="font-display text-stat font-extrabold tabular-nums">18</span>
            <span className="mt-1 text-ui text-muted">dni z rzędu bez nikotyny</span>
          </div>
        </div>
        <ProgressBar value={86} label="18 / 21 dni do kamienia milowego" />
        <div className="grid grid-cols-3 gap-2">
          <StatTile value="18" label="najdłuższa seria" />
          <StatTile value="6/7" label="dni w tym tygodniu" />
          <StatTile value="+360 zł" label="zaoszczędzone" />
        </div>
        <Button variant="secondary" size="lg" icon={<BookOpen size={18} className="text-accent" />}>
          Strategie i poradniki
        </Button>
      </Card>

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
