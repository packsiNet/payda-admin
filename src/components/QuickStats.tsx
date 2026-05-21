import {
  IconTrendingUp,
  IconTrendingDown,
  IconActivity,
  IconAlertTriangle,
} from '@tabler/icons-react'
import StatCard from './StatCard'

export default function QuickStats() {
  return (
    <div style={styles.grid}>
      <StatCard
        label="Total Revenue"
        value="$24,850"
        change="↑ +18.2%"
        changeType="up"
        sub="vs last month"
        icon={<IconTrendingUp size={16} />}
        iconBg="var(--green-light)"
        iconColor="var(--green)"
        accent
      />
      <StatCard
        label="Total Sent"
        value="$6,400"
        change="↑ +12%"
        changeType="up"
        sub="this month"
        icon={<IconTrendingUp size={16} />}
        iconBg="var(--green-light)"
        iconColor="var(--green)"
      />
      <StatCard
        label="Transactions"
        value="128"
        change="↑ +24"
        changeType="up"
        sub="this week"
        icon={<IconActivity size={16} />}
        iconBg="var(--blue-light)"
        iconColor="var(--blue)"
      />
      <StatCard
        label="Failed"
        value="3"
        change="↓ -2"
        changeType="down"
        sub="vs last month"
        icon={<IconAlertTriangle size={16} />}
        iconBg="var(--red-light)"
        iconColor="var(--red)"
      />
      <StatCard
        label="Avg. Amount"
        value="$50.0"
        changeType="neutral"
        sub="per transaction"
        icon={<IconTrendingDown size={16} />}
        iconBg="var(--indigo-light)"
        iconColor="var(--indigo)"
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: 14,
  },
}
