import { Bell } from 'lucide-react'
import { Avatar, IconButton } from '../ui'

/** Nagłówek ekranu Cele na telefonie: alias + dzwonek (UI_GUIDE, pkt 5). Na desktopie alias jest w pasku bocznym. */
export function MobileHeader({ alias }: { alias: string }) {
  return (
    <header className="flex items-center justify-between lg:hidden">
      <div className="flex items-center gap-2.5">
        <Avatar alias={alias} className="size-9 rounded-chip" />
        <div className="flex flex-col">
          <span className="text-caption text-muted">Twój alias</span>
          <span className="text-body font-semibold">{alias}</span>
        </div>
      </div>
      {/* Powiadomienia to osobna funkcja (poza US02): przycisk jak w makiecie, ale nieaktywny. */}
      <IconButton label="Powiadomienia (dostępne wkrótce)" disabled>
        <Bell size={20} aria-hidden="true" />
      </IconButton>
    </header>
  )
}
