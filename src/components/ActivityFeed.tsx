import {
  IconUserPlus,
  IconCircleCheck,
  IconAlertTriangle,
  IconShieldCheck,
  IconCreditCard,
} from '@tabler/icons-react'

interface FeedItem {
  id: number
  icon: typeof IconUserPlus
  iconBg: string
  iconColor: string
  text: string
  time: string
}

const feed: FeedItem[] = [
  { id: 1, icon: IconUserPlus, iconBg: 'var(--green-light)', iconColor: 'var(--green)', text: 'New user registered: tanjiro@mail.com', time: '2m ago' },
  { id: 2, icon: IconCircleCheck, iconBg: 'var(--blue-light)', iconColor: 'var(--blue)', text: 'Transaction TXN-8164 confirmed', time: '14m ago' },
  { id: 3, icon: IconAlertTriangle, iconBg: 'var(--amber-light)', iconColor: 'var(--amber)', text: 'Monthly quota at 90% for user #241', time: '1h ago' },
  { id: 4, icon: IconShieldCheck, iconBg: 'var(--indigo-light)', iconColor: 'var(--indigo)', text: 'Security review passed for batch #12', time: '3h ago' },
  { id: 5, icon: IconCreditCard, iconBg: 'var(--red-light)', iconColor: 'var(--red)', text: 'Failed payment from nezuko@mail.com', time: '5h ago' },
]

export default function ActivityFeed() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>Activity Feed</div>
        <div style={styles.sub}>Real-time system events</div>
      </div>

      <div style={styles.list}>
        {feed.map((item, i) => {
          const Icon = item.icon
          return (
            <div key={item.id} style={styles.item}>
              <div style={styles.lineWrap}>
                <div style={{ ...styles.iconBox, background: item.iconBg, color: item.iconColor }}>
                  <Icon size={14} />
                </div>
                {i < feed.length - 1 && <div style={styles.line} />}
              </div>
              <div style={styles.content}>
                <div style={styles.text}>{item.text}</div>
                <div style={styles.time}>{item.time}</div>
              </div>
            </div>
          )
        })}
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
  },
  item: {
    display: 'flex',
    gap: 12,
  },
  lineWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  line: {
    width: 1.5,
    flex: 1,
    background: 'var(--ink-10)',
    margin: '4px 0',
    minHeight: 16,
  },
  content: {
    paddingBottom: 14,
    flex: 1,
  },
  text: {
    fontSize: 12.5,
    color: 'var(--ink)',
    lineHeight: 1.5,
    marginBottom: 3,
  },
  time: {
    fontSize: 10.5,
    color: 'var(--ink-40)',
  },
}
