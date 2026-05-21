import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { IconCircleCheck, IconCircleX, IconAlertTriangle, IconX } from '@tabler/icons-react'

type ToastType = 'success' | 'error' | 'warning'
interface Toast { id: string; type: ToastType; title: string; message?: string }
interface ToastCtx { toast: (type: ToastType, title: string, message?: string) => void }

const Ctx = createContext<ToastCtx | null>(null)

const ICON = { success: IconCircleCheck, error: IconCircleX, warning: IconAlertTriangle }
const COLOR = { success: 'var(--green)', error: 'var(--red)', warning: 'var(--amber)' }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(p => [...p, { id, type, title, message }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800)
  }, [])

  const dismiss = (id: string) => setToasts(p => p.filter(t => t.id !== id))

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999, width: 320 }}>
        {toasts.map(t => {
          const Icon = ICON[t.type]
          return (
            <div key={t.id} style={{
              background: '#fff', borderRadius: 'var(--radius-lg)', padding: '13px 16px',
              display: 'flex', alignItems: 'flex-start', gap: 12,
              boxShadow: 'var(--shadow-md)', borderLeft: `3.5px solid ${COLOR[t.type]}`,
            }}>
              <Icon size={18} style={{ color: COLOR[t.type], flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{t.title}</div>
                {t.message && <div style={{ fontSize: 11.5, color: 'var(--ink-40)' }}>{t.message}</div>}
              </div>
              <button onClick={() => dismiss(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-40)', padding: 2 }}>
                <IconX size={13} />
              </button>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx.toast
}
