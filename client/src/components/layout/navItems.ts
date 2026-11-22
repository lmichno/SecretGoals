import { Target, User, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Ekran jeszcze niezrobiony (US04+): pozycja widoczna jak w makiecie, ale nieaktywna. */
  disabled?: boolean
}

/** Główna nawigacja: pasek boczny (desktop) i dolna nawigacja (mobile). */
export const NAV_ITEMS: NavItem[] = [
  { to: '/cele', label: 'Cele', icon: Target },
  { to: '/spolecznosc', label: 'Społeczność', icon: Users, disabled: true },
  { to: '/profil', label: 'Profil', icon: User },
]

export const DISABLED_NAV_HINT = 'Dostępne wkrótce'
