import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconStack2 } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api'
import Spinner from '../components/Spinner'

const BOT_USERNAME = (import.meta.env.VITE_TELEGRAM_BOT_USERNAME as string | undefined) ?? ''

interface TelegramUser {
  id: number
  auth_date: number
  hash: string
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
}

export default function Login() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const widgetRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (token) navigate('/') }, [token, navigate])

  useEffect(() => {
    if (!widgetRef.current || !BOT_USERNAME) return

    const handleAuth = async (user: TelegramUser) => {
      setLoading(true)
      setError('')
      try {
        const res = await authApi.adminLogin({
          id:        String(user.id),
          authDate:  String(user.auth_date),
          hash:      user.hash,
          firstName: user.first_name  ?? null,
          lastName:  user.last_name   ?? null,
          username:  user.username    ?? null,
          photoUrl:  user.photo_url   ?? null,
        })
        await login(res.token)
        navigate('/')
      } catch (err: unknown) {
        const e = err as Record<string, unknown>
        if (e?.status === 403) {
          setError('شما دسترسی ادمین ندارید.')
        } else {
          setError('خطا در احراز هویت. دوباره تلاش کنید.')
        }
      } finally {
        setLoading(false)
      }
    }

    // expose callback on window so Telegram widget can call it
    ;(window as unknown as Record<string, unknown>)['onTelegramAuth'] = handleAuth

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    script.async = true

    widgetRef.current.innerHTML = ''
    widgetRef.current.appendChild(script)

    return () => {
      delete (window as unknown as Record<string, unknown>)['onTelegramAuth']
    }
  }, [login, navigate])

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={S.logoRow}>
          <div style={S.logoIcon}><IconStack2 size={24} color="#fff" /></div>
          <div>
            <div style={S.logoName}>Payda Admin</div>
            <div style={S.logoSub}>Secure Admin Panel</div>
          </div>
        </div>

        <p style={S.guide}>
          برای ورود، با اکانت تلگرام ادمین خود وارد شوید
        </p>

        {error && <div style={S.error}>{error}</div>}

        <div style={S.widgetWrap}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', color: 'var(--ink-60)', fontSize: 13 }}>
              <Spinner size={18} /> در حال ورود…
            </div>
          ) : !BOT_USERNAME ? (
            <div style={S.warning}>
              VITE_TELEGRAM_BOT_USERNAME is not set in .env
            </div>
          ) : (
            <div ref={widgetRef} />
          )}
        </div>

        <div style={S.footer}>
          Only users with Admin role can access this panel.
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100svh', background: 'var(--ink-5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  card: {
    background: '#fff', borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--ink-10)', padding: '36px 32px',
    width: '100%', maxWidth: 400,
    boxShadow: 'var(--shadow-md)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, width: '100%',
  },
  logoIcon: {
    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
    background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoName: { fontSize: 18, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.4px' },
  logoSub:  { fontSize: 11, color: 'var(--ink-40)', marginTop: 2 },
  guide: {
    fontSize: 13, color: 'var(--ink-60)', textAlign: 'center',
    marginBottom: 24, lineHeight: 1.6,
  },
  error: {
    width: '100%', background: 'var(--red-light)', border: '1px solid #fecaca',
    borderRadius: 'var(--radius-md)', padding: '10px 14px',
    fontSize: 13, color: '#7f1d1d', marginBottom: 16, textAlign: 'center',
  },
  widgetWrap: {
    minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  warning: {
    background: 'var(--amber-light)', border: '1px solid #fde68a',
    borderRadius: 'var(--radius-md)', padding: '10px 14px',
    fontSize: 12, color: '#78350f', textAlign: 'center',
  },
  footer: { marginTop: 16, fontSize: 11, color: 'var(--ink-40)', textAlign: 'center' },
}
