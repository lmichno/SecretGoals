import { useEffect, useRef, useState } from 'react'
import { X, Target } from 'lucide-react'
import { IconButton } from '../ui'
import { AddGoalForm } from './AddGoalForm'
import type { Goal } from '../../api/goals'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalCreated: (goal: Goal) => void
}

export function AddGoalModal({ isOpen, onClose, onGoalCreated }: AddGoalModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    previousActiveElement.current = document.activeElement as HTMLElement | null

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (submitting) {
          e.preventDefault()
          return
        }
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === 'function'
      ) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onClose, submitting])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      open
      aria-modal="true"
      aria-labelledby="add-goal-title"
      className="fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-end justify-center border-none bg-overlay p-0 text-text sm:items-center sm:p-4"
    >
      <div className="flex max-h-full sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-t-sheet border-t border-border bg-surface p-5 sm:rounded-sheet sm:border sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Target size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <h2 id="add-goal-title" className="m-0 font-display text-title font-bold text-text">
                Nowy cel
              </h2>
              <span className="text-caption text-muted">Zaplanuj swój kolejny krok lub nawyk</span>
            </div>
          </div>
          <IconButton
            label="Zamknij formularz"
            disabled={submitting}
            onClick={() => {
              if (!submitting) {
                onClose()
              }
            }}
          >
            <X size={20} aria-hidden="true" />
          </IconButton>
        </div>

        <AddGoalForm
          onSuccess={(newGoal) => {
            onGoalCreated(newGoal)
            onClose()
          }}
          onCancel={() => {
            if (!submitting) {
              onClose()
            }
          }}
          onSubmittingChange={setSubmitting}
        />
      </div>
    </dialog>
  )
}
