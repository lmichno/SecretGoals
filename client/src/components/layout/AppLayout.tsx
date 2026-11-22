import { NavLink, Outlet } from 'react-router'
import { Avatar, cn } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { DISABLED_NAV_HINT, NAV_ITEMS } from './navItems'

/**
 * Wspólny układ zalogowanej części aplikacji (UI_GUIDE, pkt 3.8):
 * desktop (od lg) pasek boczny 240 px, mobile dolna nawigacja 84 px przyklejona do dołu.
 */
export function AppLayout() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen bg-bg text-text lg:flex">
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col lg:gap-7 lg:border-r lg:border-border lg:bg-chrome lg:px-5 lg:py-7">
        <span className="font-display text-title font-extrabold tracking-[-0.01em]">
          Secret Goals
        </span>
        <nav aria-label="Główna nawigacja" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, disabled }) =>
            disabled ? (
              <span
                key={to}
                aria-disabled="true"
                title={DISABLED_NAV_HINT}
                className="flex h-11 cursor-not-allowed items-center gap-3 rounded-chip px-3 text-body font-medium text-text-secondary opacity-50"
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex h-11 items-center gap-3 rounded-chip px-3 text-body no-underline',
                    isActive
                      ? 'bg-accent-subtle font-semibold text-accent hover:text-accent'
                      : 'font-medium text-text-secondary hover:text-text'
                  )
                }
              >
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>
        <div className="mt-auto flex items-center gap-2.5 rounded-control bg-surface p-3">
          <Avatar alias={user.alias} className="size-9 rounded-chip" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-ui font-semibold">{user.alias}</span>
            <span className="text-caption text-muted">alias anonimowy</span>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-[84px] lg:pb-0">
        <Outlet />
      </div>

      <nav
        aria-label="Główna nawigacja"
        className="fixed inset-x-0 bottom-0 z-40 flex h-[84px] items-start justify-around border-t border-border bg-chrome pt-2 lg:hidden"
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon, disabled }) =>
          disabled ? (
            <span
              key={to}
              aria-disabled="true"
              title={DISABLED_NAV_HINT}
              className="flex min-h-12 min-w-[72px] cursor-not-allowed flex-col items-center gap-1 text-caption font-medium text-muted opacity-50"
            >
              <Icon size={24} aria-hidden="true" />
              <span>{label}</span>
            </span>
          ) : (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-12 min-w-[72px] flex-col items-center gap-1 text-caption no-underline',
                  isActive
                    ? 'font-semibold text-accent hover:text-accent'
                    : 'font-medium text-muted hover:text-text'
                )
              }
            >
              <Icon size={24} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          )
        )}
      </nav>
    </div>
  )
}
