import { useLocation, useNavigate } from 'react-router-dom'
import { IconSearch, IconBell, IconPlus } from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'

const PAGE_META: Record<string, { title: string; subtitle: string; action?: string; actionTo?: string }> = {
  '/':              { title: 'Dashboard',      subtitle: 'Platform overview and key metrics' },
  '/users':         { title: 'User Management',subtitle: 'Manage users, KYC and roles', action: 'Add User' },
  '/exchange-rates':{ title: 'Exchange Rates', subtitle: 'Manage currency exchange rates' },
  '/tiers':         { title: 'Tiers',          subtitle: 'Manage user tier levels', action: 'New Tier', actionTo: '/tiers?new=1' },
  '/admin-match':   { title: 'Admin Match',    subtitle: 'Manually match send and receive requests' },
  '/settings':      { title: 'Settings',       subtitle: 'System configuration' },
}

export default function Header() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const meta = PAGE_META[pathname] ?? PAGE_META['/']

  return (
    <header style={S.header}>
      <div>
        <div style={S.title}>{meta.title}</div>
        <div style={S.subtitle}>{meta.subtitle}</div>
      </div>

      <div style={S.right}>
        <div style={S.searchBox}>
          <IconSearch size={15} color="var(--ink-40)" />
          <input style={S.searchInput} type="text" placeholder="Search..." />
          <span style={S.kbd}>⌘K</span>
        </div>

        {meta.action && (
          <button style={S.primaryBtn} onClick={() => meta.actionTo && navigate(meta.actionTo)}>
            <IconPlus size={14} />
            {meta.action}
          </button>
        )}

        <div style={S.notifBtn}>
          <IconBell size={18} color="var(--ink-60)" />
          <span style={S.notifDot} />
        </div>

        <div style={S.avatar}>
          {([user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') || 'AD').toUpperCase()}
        </div>
      </div>
    </header>
  )
}

const S: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 28px', background: '#fff',
    borderBottom: '1px solid var(--ink-10)', position: 'sticky', top: 0, zIndex: 10,
  },
  title:    { fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.4px' },
  subtitle: { fontSize: 12, color: 'var(--ink-40)', marginTop: 2 },
  right:    { display: 'flex', alignItems: 'center', gap: 10 },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--ink-5)', border: '1.5px solid var(--ink-10)',
    borderRadius: 'var(--radius-md)', padding: '7px 12px', width: 220,
  },
  searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, color: 'var(--ink)', flex: 1 },
  kbd: { fontSize: 10, color: 'var(--ink-40)', background: 'var(--ink-10)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 },
  primaryBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'var(--ink)', color: '#fff', border: 'none',
    borderRadius: 'var(--radius-md)', padding: '8px 16px',
    fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
  },
  notifBtn: {
    width: 36, height: 36, borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--ink-10)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer',
  },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: '50%',
    background: 'var(--red)', border: '1.5px solid #fff',
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
  },
}
