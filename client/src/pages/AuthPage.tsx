import { Flame, Heart, Shield, Target } from 'lucide-react'
import { AuthForm } from '../components/auth/AuthForm'
import type { AuthUser } from '../api/auth'

interface AuthPageProps {
  onSuccess?: (user: AuthUser) => void
}

/**
 * Widok uwierzytelniania i rejestracji (US01).
 * Implementuje responsywny układ łączący Auth.dc.html (mobile)
 * oraz DesktopAuth.dc.html (desktop z lewym panelem informacyjnym).
 */
export function AuthPage({ onSuccess }: AuthPageProps) {
  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* Lewy panel informacyjny (tylko desktop >= 1024 px) */}
      <section
        aria-label="O aplikacji"
        className="hidden lg:flex lg:flex-[1_1_480px] flex-col justify-center gap-10 border-r border-border bg-chrome p-12 xl:p-20"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-tile bg-accent-soft text-accent">
            <Target size={26} aria-hidden="true" />
          </div>
          <span className="font-display text-24 font-extrabold text-text">Secret Goals</span>
        </div>

        <h1 className="m-0 max-w-[560px] font-display text-[clamp(36px,4vw,56px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-text">
          Walcz o swoje cele. Nikt nie musi wiedzieć, kim jesteś.
        </h1>

        <div className="flex max-w-[520px] flex-col gap-5.5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Shield size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-label-lg font-semibold text-text">Pełna anonimowość</span>
              <span className="text-body leading-[1.5] text-muted">
                Inni widzą tylko losowy alias. E-mail służy wyłącznie do logowania.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Flame size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-label-lg font-semibold text-text">Serie i kamienie milowe</span>
              <span className="text-body leading-[1.5] text-muted">
                Zaznaczaj postępy jednym kliknięciem i patrz, jak rośnie Twoja seria.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Heart size={22} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-label-lg font-semibold text-text">
                Wsparcie ludzi z tym samym celem
              </span>
              <span className="text-body leading-[1.5] text-muted">
                Każdy publiczny cel to post, pod którym inni mogą Cię wspierać.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Prawy panel formularza (wyśrodkowany na mobile i desktopie) */}
      <main className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 lg:py-16">
        <div className="flex w-full max-w-[420px] flex-col gap-7">
          {/* Nagłówek widoczny tylko na mobile */}
          <header className="flex flex-col gap-3.5 lg:hidden">
            <div className="flex size-14 items-center justify-center rounded-panel bg-accent-soft text-accent">
              <Target size={30} aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-display text-[32px] font-extrabold leading-[1.05] tracking-[-0.01em] text-text">
                Secret Goals
              </h1>
              <p className="m-0 text-body leading-[1.45] text-muted">
                Twoje cele i nawyki. Wsparcie innych. Pełna anonimowość.
              </p>
            </div>
          </header>

          <AuthForm onSuccess={onSuccess} />
        </div>
      </main>
    </div>
  )
}
