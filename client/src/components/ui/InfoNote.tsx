import type { ReactNode } from 'react'
import { Shield } from 'lucide-react'
import { cn } from './cn'

interface InfoNoteProps {
  children: ReactNode
  className?: string
}

/** Niebieski boks o prywatności: „E-mail służy tylko do logowania…”. */
export function InfoNote({ children, className }: InfoNoteProps) {
  return (
    <div
      className={cn('flex items-start gap-2.5 rounded-tile bg-support-soft px-4 py-3.5', className)}
    >
      <Shield size={20} className="mt-px shrink-0 text-support" aria-hidden="true" />
      <span className="text-small leading-[1.45] text-support-text">{children}</span>
    </div>
  )
}
