import type { ReactNode } from 'react'
import { cn } from './cn'

interface IconTileProps {
  children: ReactNode
  size?: 'md' | 'lg' | 'xl'
  className?: string
}

/** Zielony kafelek z ikoną: logo, płomień serii, ikony w liście zalet. */
export function IconTile({ children, size = 'md', className }: IconTileProps) {
  const sizes = {
    md: 'size-11 rounded-control',
    lg: 'size-14 rounded-panel',
    xl: 'size-16 rounded-icon',
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center bg-accent-soft text-accent',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
