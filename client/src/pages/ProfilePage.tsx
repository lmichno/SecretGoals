import { LogOut } from 'lucide-react'
import { Avatar, Button, Card } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

/**
 * Profil (Profile.dc.html / DesktopProfile.dc.html), na razie tylko tożsamość i wylogowanie.
 * Statystyki, mapa aktywności i lista celów dojdą razem z postępem (US03+).
 */
export function ProfilePage() {
  const { user, logout, loggingOut } = useAuth()
  if (!user) return null

  return (
    <main className="flex max-w-2xl flex-col gap-3.5 px-5 pt-[18px] pb-6 lg:gap-6 lg:px-[clamp(16px,4vw,48px)] lg:pt-8 lg:pb-12">
      <h1 className="m-0 font-display text-heading font-bold lg:text-page">Profil</h1>

      <Card aria-label="Tożsamość" className="gap-3.5">
        <div className="flex items-center gap-3.5">
          <Avatar
            alias={user.alias}
            tone="accent"
            className="size-15 rounded-icon font-display text-title font-extrabold"
          />
          <span className="text-[20px] font-bold">{user.alias}</span>
        </div>
        <p className="m-0 text-small leading-[1.45] text-text-secondary">
          Inni widzą tylko Twój alias. Adres e-mail służy wyłącznie do logowania i nigdy nie jest
          pokazywany.
        </p>
        <Button
          variant="danger"
          size="md"
          icon={<LogOut size={18} aria-hidden="true" />}
          onClick={() => void logout()}
          disabled={loggingOut}
        >
          {loggingOut ? 'Wylogowywanie…' : 'Wyloguj'}
        </Button>
      </Card>
    </main>
  )
}
