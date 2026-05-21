const users = [
  { initials: 'TJ', name: 'Tanjiro K.', email: 'tanjiro@mail.com', amount: '$4,200', txns: 32, color: '#ecfdf5', textColor: '#065f46' },
  { initials: 'AR', name: 'Ariana R.', email: 'ariana@mail.com', amount: '$3,850', txns: 27, color: '#eef2ff', textColor: '#3730a3' },
  { initials: 'BS', name: 'Bruno S.', email: 'bruno@mail.com', amount: '$3,100', txns: 21, color: '#fffbeb', textColor: '#78350f' },
  { initials: 'NZ', name: 'Nezuko M.', email: 'nezuko@mail.com', amount: '$2,740', txns: 18, color: '#fef2f2', textColor: '#7f1d1d' },
  { initials: 'KA', name: 'Kage A.', email: 'kage@mail.com', amount: '$2,100', txns: 15, color: '#eff6ff', textColor: '#1e3a8a' },
]

const progressColors = ['var(--green)', 'var(--indigo)', 'var(--amber)', 'var(--red)', 'var(--blue)']
const maxAmount = 4200

export default function TopUsers() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Top Users</div>
        <div style={styles.sub}>By transaction volume</div>
      </div>

      <div style={styles.list}>
        {users.map((u, i) => (
          <div key={u.name} style={styles.row}>
            <div style={{ ...styles.avatar, background: u.color, color: u.textColor }}>
              {u.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.name}>{u.name}</div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${(parseInt(u.amount.replace(/[$,]/g, '')) / maxAmount) * 100}%`,
                    background: progressColors[i],
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={styles.amount}>{u.amount}</div>
              <div style={styles.txnCount}>{u.txns} txns</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--ink-10)',
    padding: '18px 20px',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--ink)',
    marginBottom: 2,
  },
  sub: {
    fontSize: 11,
    color: 'var(--ink-40)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  name: {
    fontSize: 12.5,
    fontWeight: 600,
    color: 'var(--ink)',
    marginBottom: 5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  progressBar: {
    height: 5,
    background: 'var(--ink-10)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease',
  },
  amount: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--ink)',
    marginBottom: 1,
  },
  txnCount: {
    fontSize: 10.5,
    color: 'var(--ink-40)',
    textAlign: 'right',
  },
}
