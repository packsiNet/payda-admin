import {
  IconArrowUpRight,
  IconArrowDownLeft,
  IconClock,
  IconX,
  IconCopy,
} from '@tabler/icons-react'

interface Transaction {
  id: string
  name: string
  date: string
  amount: string
  type: 'credit' | 'debit'
  status: 'success' | 'pending' | 'failed'
  icon: 'send' | 'receive' | 'pending' | 'failed'
}

const transactions: Transaction[] = [
  { id: 'TXN-2024-8164', name: 'OVO Top Up — Tanjiro', date: '18 May · 08:16', amount: '-$180.05', type: 'debit', status: 'success', icon: 'send' },
  { id: 'TXN-2024-8163', name: 'Salary Deposit', date: '15 May · 09:00', amount: '+$2,400.00', type: 'credit', status: 'success', icon: 'receive' },
  { id: 'TXN-2024-8162', name: 'Bill Payment — PLN', date: '14 May · 14:32', amount: '-$45.00', type: 'debit', status: 'pending', icon: 'pending' },
  { id: 'TXN-2024-8161', name: 'Transfer — Nezuko', date: '12 May · 18:55', amount: '-$60.00', type: 'debit', status: 'failed', icon: 'failed' },
  { id: 'TXN-2024-8160', name: 'Cashback Reward', date: '10 May · 11:00', amount: '+$12.50', type: 'credit', status: 'success', icon: 'receive' },
  { id: 'TXN-2024-8159', name: 'Netflix Subscription', date: '09 May · 07:00', amount: '-$15.99', type: 'debit', status: 'success', icon: 'send' },
]

const iconConfig = {
  send: { bg: 'var(--green-light)', color: 'var(--green)', Icon: IconArrowUpRight },
  receive: { bg: 'var(--blue-light)', color: 'var(--blue)', Icon: IconArrowDownLeft },
  pending: { bg: 'var(--amber-light)', color: 'var(--amber)', Icon: IconClock },
  failed: { bg: 'var(--red-light)', color: 'var(--red)', Icon: IconX },
}

const statusBadge: Record<Transaction['status'], { bg: string; color: string; border: string; label: string }> = {
  success: { bg: 'var(--green-light)', color: 'var(--green-text)', border: 'var(--green-mid)', label: 'Done' },
  pending: { bg: 'var(--amber-light)', color: '#78350f', border: '#fde68a', label: 'Pending' },
  failed: { bg: 'var(--red-light)', color: '#7f1d1d', border: '#fecaca', label: 'Failed' },
}

const chipFilters = ['All', 'Top Up', 'Transfer', 'Payment', 'Deposit']

export default function TransactionList() {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardTitle}>Recent Transactions</div>
          <div style={styles.cardSub}>Last 30 days activity</div>
        </div>
        <div style={styles.chips}>
          {chipFilters.map((f, i) => (
            <button key={f} style={{ ...styles.chip, ...(i === 0 ? styles.chipActive : {}) }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tableHeader}>
        <span style={{ ...styles.col, flex: 2.5 }}>Transaction</span>
        <span style={{ ...styles.col, flex: 1.5 }}>Reference</span>
        <span style={{ ...styles.col, flex: 1, textAlign: 'center' }}>Status</span>
        <span style={{ ...styles.col, flex: 1, textAlign: 'right' }}>Amount</span>
      </div>

      {transactions.map((txn) => {
        const { bg, color, Icon } = iconConfig[txn.icon]
        const badge = statusBadge[txn.status]

        return (
          <div key={txn.id} style={styles.row}>
            <div style={{ ...styles.rowCell, flex: 2.5 }}>
              <div style={{ ...styles.txnIcon, background: bg }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={styles.txnName}>{txn.name}</div>
                <div style={styles.txnDate}>{txn.date}</div>
              </div>
            </div>

            <div style={{ ...styles.rowCell, flex: 1.5 }}>
              <span style={styles.refCode}>{txn.id}</span>
              <button style={styles.copyBtn} title="Copy">
                <IconCopy size={12} />
              </button>
            </div>

            <div style={{ ...styles.rowCell, flex: 1, justifyContent: 'center' }}>
              <span style={{
                ...styles.badge,
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
              }}>
                <span style={{ ...styles.badgeDot, background: badge.color }} />
                {badge.label}
              </span>
            </div>

            <div style={{ ...styles.rowCell, flex: 1, justifyContent: 'flex-end' }}>
              <span style={{
                ...styles.amount,
                color: txn.type === 'credit' ? 'var(--green)' : 'var(--ink)',
              }}>
                {txn.amount}
              </span>
            </div>
          </div>
        )
      })}

      <div style={styles.footer}>
        <span style={styles.footerText}>Showing 6 of 128 transactions</span>
        <button style={styles.viewAllBtn}>View All</button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--ink-10)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '18px 20px 14px',
    borderBottom: '1px solid var(--ink-5)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--ink)',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: 'var(--ink-40)',
  },
  chips: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: 'var(--ink-10)',
    color: 'var(--ink-60)',
    transition: 'background 0.15s',
  },
  chipActive: {
    background: 'var(--ink)',
    color: '#fff',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: 'var(--ink-5)',
    borderBottom: '1px solid var(--ink-10)',
  },
  col: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    color: 'var(--ink-40)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '13px 20px',
    borderBottom: '1px solid var(--ink-5)',
    transition: 'background 0.1s',
  },
  rowCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  txnIcon: {
    width: 38,
    height: 38,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txnName: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--ink)',
    marginBottom: 2,
  },
  txnDate: {
    fontSize: 11,
    color: 'var(--ink-40)',
  },
  refCode: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 11.5,
    color: 'var(--ink-60)',
    letterSpacing: '0.3px',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--ink-10)',
    background: '#fff',
    color: 'var(--ink-40)',
    cursor: 'pointer',
    padding: 0,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: 10,
    fontWeight: 700,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    display: 'inline-block',
  },
  amount: {
    fontSize: 13.5,
    fontWeight: 700,
    letterSpacing: '-0.2px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
  },
  footerText: {
    fontSize: 11,
    color: 'var(--ink-40)',
  },
  viewAllBtn: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--indigo)',
    background: 'var(--indigo-light)',
    border: '1px solid #c7d2fe',
    borderRadius: 'var(--radius-sm)',
    padding: '6px 14px',
    cursor: 'pointer',
  },
}
