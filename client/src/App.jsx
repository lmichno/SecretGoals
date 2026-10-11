import { useState, useEffect } from 'react'
import { Shield, Sparkles, Server, CheckCircle2, AlertCircle } from 'lucide-react'

function App() {
  const [serverStatus, setServerStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching API status:', err)
        setServerStatus({ status: 'error', message: 'Nie udało się połączyć z serwerem' })
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              SecretGoals
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                dev
              </span>
            </h1>
            <p className="text-sm text-slate-400">Anonimowa platforma śledzenia nawyków i celów</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Stos technologiczny
            </h2>
            <ul className="text-sm text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>Frontend:</strong> React + Vite + Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span><strong>Backend:</strong> Express.js</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span><strong>Baza danych:</strong> SQLite + Prisma ORM</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              Status połączenia z API (/api/health)
            </h2>
            {loading ? (
              <p className="text-sm text-slate-400 animate-pulse">Sprawdzanie połączenia z serwerem...</p>
            ) : serverStatus?.status === 'ok' ? (
              <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>{serverStatus.message} (SQLite gotowe)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-400 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{serverStatus?.message || 'Brak odpowiedzi serwera'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-500">
            Gotowe do pracy – zmiany zapisują się automatycznie (HMR).
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
