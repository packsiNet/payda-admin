import { NavLink, useNavigate } from 'react-router-dom'
import {
  IconLayoutDashboard, IconUsers, IconArrowsExchange,
  IconCategory, IconArrowLeftRight, IconSettings,
  IconLogout, IconStack2, IconIdBadge2,
} from '@tabler/icons-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: IconLayoutDashboard, label: 'Dashboard',       to: '/' },
  { icon: IconUsers,           label: 'Users',           to: '/users' },
  { icon: IconIdBadge2,        label: 'KYC Review',      to: '/kyc' },
  { icon: IconArrowsExchange,  label: 'Exchange Rates',  to: '/exchange-rates' },
  { icon: IconCategory,        label: 'Tiers',           to: '/tiers' },
  { icon: IconArrowLeftRight,  label: 'Admin Match',     to: '/admin-match' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'AD'
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Admin'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.logoIcon}><IconStack2 size={20} color="#fff" /></div>
        <div>
          <div style={S.logoName}>Payda</div>
          <div style={S.logoSub}>Admin Panel</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={S.navLabel}>Main Menu</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navItemActive : {}) })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 500 }}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <div style={S.divider} />
        <NavLink to="/settings" style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navItemActive : {}) })}>
          <IconSettings size={18} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 500 }}>Settings</span>
        </NavLink>
        <button onClick={handleLogout} style={{ ...S.navItem, color: 'var(--red)', width: '100%', textAlign: 'left' }}>
          <IconLogout size={18} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Logout</span>
        </button>

        <div style={S.userCard}>
          <div style={S.userAvatar}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.userName}>{displayName}</div>
            <div style={S.userEmail}>{user?.telegramUsername ? `@${user.telegramUsername}` : 'Admin'}</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  )
}

const S: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 240, minWidth: 240, background: '#fff',
    borderRight: '1px solid var(--ink-10)',
    display: 'flex', flexDirection: 'column',
    padding: '20px 12px', gap: 4,
    position: 'sticky', top: 0, height: '100svh', overflowY: 'auto',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '4px 8px 20px',
    borderBottom: '1px solid var(--ink-10)', marginBottom: 8,
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 'var(--radius-md)',
    background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoName: { fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' },
  logoSub:  { fontSize: 10, fontWeight: 600, color: 'var(--ink-40)', letterSpacing: '0.3px' },
  navLabel: {
    fontSize: 9, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase',
    color: 'var(--ink-40)', padding: '0 10px', marginBottom: 6,
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 10px', borderRadius: 'var(--radius-md)',
    color: 'var(--ink-60)', border: 'none', background: 'transparent',
    cursor: 'pointer', textDecoration: 'none', transition: 'background 0.15s, color 0.15s',
  },
  navItemActive: { background: 'var(--ink)', color: '#fff' },
  divider: { height: 1, background: 'var(--ink-10)', margin: '8px 0' },
  userCard: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: 10, marginTop: 8,
    background: 'var(--ink-5)', borderRadius: 'var(--radius-md)',
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: '50%', background: 'var(--ink)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },
  userName:  { fontSize: 12, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { fontSize: 10, color: 'var(--ink-40)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
}
