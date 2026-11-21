import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button, Card, IconTile } from './components/ui'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './hooks/useAuth'
import { AuthPage } from './pages/AuthPage'
import { GoalsPage } from './pages/GoalsPage'

function AppContent() {
  const { user, loading: authLoading, sessionError, retrySessionCheck } = useAuth()

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

  return <GoalsPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
