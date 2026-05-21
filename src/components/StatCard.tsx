import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  sub?: string
  icon?: ReactNode
  iconBg?: string
  iconColor?: string
  accent?: boolean
}

export default function StatCard({
  label,
  value,
  change,
  changeType = 'up',
  sub,
  icon,
  iconBg = 'var(--green-light)',
  iconColor = 'var(--green)',
  accent = false,
}: StatCardProps) {
  const changeColor =
    changeType === 'up' ? 'var(--green)' : changeType === 'down' ? 'var(--red)' : 'var(--ink-40)'

  if (accent) {
    return (
      <div style={styles.accentCard}>
        <div style={styles.accentCardBg} />
        <div style={styles.accentLabel}>{label}</div>
        <div style={styles.accentValue}>{value}</div>
        <div style={styles.accentFooter}>
          {change && (
            <div style={styles.accentBadge}>
              <span style={styles.accentBadgeDot} />
              <span style={styles.accentBadgeText}>{change}</span>
            </div>
          )}
          {sub && <span style={styles.accentSince}>{sub}</span>}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={styles.labelRow}>
          <span style={styles.label}>{label}</span>
        </div>
        {icon && (
          <div style={{ ...styles.iconBox, background: iconBg, color: iconColor }}>
            {icon}
          </div>
        )}
      </div>
      <div style={styles.value}>{value}</div>
      {(change || sub) && (
        <div style={styles.footer}>
          {change && (
            <span style={{ ...styles.change, color: changeColor }}>
              {change}
            </span>
          )}
          {sub && <span style={styles.subText}>{sub}</span>}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--ink-10)',
    padding: '18px 20px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: 'var(--ink-40)',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--ink)',
    letterSpacing: '-0.8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    color: 'var(--ink-40)',
  },
  change: {
    fontWeight: 600,
    fontSize: 11,
  },
  subText: {
    fontSize: 11,
    color: 'var(--ink-40)',
  },

  // Accent (dark) card
  accentCard: {
    background: 'var(--ink)',
    borderRadius: 'var(--radius-xl)',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
  },
  accentCardBg: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.15)',
    top: -30,
    right: -20,
  },
  accentLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 10,
  },
  accentValue: {
    fontSize: 30,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-1.2px',
    marginBottom: 16,
    fontFamily: "'DM Sans', sans-serif",
  },
  accentFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accentBadge: {
    background: 'rgba(16,185,90,0.18)',
    border: '1px solid rgba(16,185,90,0.3)',
    borderRadius: 'var(--radius-sm)',
    padding: '5px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  accentBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--green)',
    display: 'inline-block',
  },
  accentBadgeText: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--green)',
  },
  accentSince: {
    fontSize: 11,
    color: '#64748b',
  },
}
