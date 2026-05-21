import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Dec', revenue: 3200, transactions: 42 },
  { month: 'Jan', revenue: 4100, transactions: 58 },
  { month: 'Feb', revenue: 3800, transactions: 51 },
  { month: 'Mar', revenue: 5200, transactions: 74 },
  { month: 'Apr', revenue: 4700, transactions: 63 },
  { month: 'May', revenue: 6400, transactions: 89 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={styles.tooltip}>
      <div style={styles.tooltipLabel}>{label}</div>
      <div style={styles.tooltipRow}>
        <span style={styles.tooltipDotGreen} />
        <span style={styles.tooltipKey}>Revenue</span>
        <span style={styles.tooltipVal}>${payload[0]?.value?.toLocaleString()}</span>
      </div>
      <div style={styles.tooltipRow}>
        <span style={styles.tooltipDotBlue} />
        <span style={styles.tooltipKey}>Transactions</span>
        <span style={styles.tooltipVal}>{payload[1]?.value}</span>
      </div>
    </div>
  )
}

export default function RevenueChart() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Revenue Overview</div>
          <div style={styles.sub}>Monthly revenue & transaction volume</div>
        </div>
        <div style={styles.legend}>
          <span style={styles.legendItem}><span style={styles.dotGreen} /> Revenue</span>
          <span style={styles.legendItem}><span style={styles.dotBlue} /> Transactions</span>
        </div>
      </div>

      <div style={{ height: 220, marginTop: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b95a" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#10b95a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.14} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontFamily: "'DM Sans'", fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fontFamily: "'DM Sans'", fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b95a"
              strokeWidth={2}
              fill="url(#gradGreen)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b95a', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradBlue)"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
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
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  legend: {
    display: 'flex',
    gap: 14,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--ink-60)',
  },
  dotGreen: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--green)',
  },
  dotBlue: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--blue)',
  },
  tooltip: {
    background: '#fff',
    border: '1px solid var(--ink-10)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    boxShadow: 'var(--shadow-md)',
    minWidth: 160,
  },
  tooltipLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--ink-40)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tooltipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tooltipDotGreen: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--green)',
  },
  tooltipDotBlue: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--blue)',
  },
  tooltipKey: {
    flex: 1,
    fontSize: 12,
    color: 'var(--ink-60)',
  },
  tooltipVal: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ink)',
  },
}
