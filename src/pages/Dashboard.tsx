import { useNavigate } from 'react-router-dom'
import {
  IconUsers, IconArrowLeftRight, IconClock, IconArrowsExchange,
  IconCircleCheck, IconChevronRight,
} from '@tabler/icons-react'
import { useApi } from '../hooks/useApi'
import { usersApi, transactionsApi, ratesApi } from '../api'
import { KycStatus, KycStatusLabel, TransactionStatus, CurrencyLabel, Currency } from '../api/types'
import Spinner from '../components/Spinner'

function StatCard({ label, value, sub, icon, bg, color }: {
  label: string; value: string | number; sub?: string
  icon: React.ReactNode; bg: string; color: string
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.8px' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>{sub}</div>}
    </div>
  )
}

const KYC_BADGE: Record<KycStatus, { bg: string; color: string; border: string }> = {
  [KycStatus.NotSubmitted]: { bg: 'var(--ink-10)',    color: 'var(--ink-60)',  border: 'var(--ink-20)' },
  [KycStatus.Pending]:      { bg: 'var(--amber-light)',color: '#78350f',       border: '#fde68a' },
  [KycStatus.Approved]:     { bg: 'var(--green-light)',color: 'var(--green-text)', border: 'var(--green-mid)' },
  [KycStatus.Rejected]:     { bg: 'var(--red-light)',  color: '#7f1d1d',       border: '#fecaca' },
}

function fmtRate(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: users, loading: usersLoading } = useApi(() => usersApi.getAll(1, 100))
  const { data: transactions, loading: txLoading } = useApi(() => transactionsApi.getAll({ pageSize: 100 }))
  const { data: rates, loading: ratesLoading } = useApi(() => ratesApi.getAll())

  const totalUsers   = users?.length ?? 0
  const pendingKyc   = users?.filter(u => u.kycStatus === KycStatus.Pending) ?? []
  const pendingTx    = transactions?.filter(t => t.status === TransactionStatus.Pending) ?? []

  const loading = usersLoading || txLoading || ratesLoading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        <StatCard label="Total Users"   value={usersLoading ? '…' : totalUsers}   sub="Loaded from API"            icon={<IconUsers size={16} />}           bg="var(--green-light)"  color="var(--green)" />
        <StatCard label="Pending KYC"   value={usersLoading ? '…' : pendingKyc.length} sub="Awaiting review"      icon={<IconClock size={16} />}           bg="var(--amber-light)"  color="var(--amber)" />
        <StatCard label="Pending Txns"  value={txLoading    ? '…' : pendingTx.length}  sub="Needs settlement"     icon={<IconArrowLeftRight size={16} />}  bg="var(--blue-light)"   color="var(--blue)" />
        <StatCard label="Exchange Rates"value={ratesLoading ? '…' : (rates?.length ?? 0)}sub="Active currencies"  icon={<IconArrowsExchange size={16} />} bg="var(--indigo-light)" color="var(--indigo)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Pending KYC list */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Pending KYC Reviews</div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 2 }}>Users waiting for KYC approval</div>
            </div>
            <button onClick={() => navigate('/users')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--indigo)' }}>
              View All <IconChevronRight size={14} />
            </button>
          </div>

          {usersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>
          ) : pendingKyc.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>
              <IconCircleCheck size={32} style={{ color: 'var(--green)', marginBottom: 8 }} /><br />
              No pending KYC reviews
            </div>
          ) : (
            pendingKyc.slice(0, 8).map(u => {
              const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || `User #${u.telegramId}`
              const initials = [u.firstName?.[0], u.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U'
              const badge = KYC_BADGE[u.kycStatus]
              return (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--ink-5)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber-light)', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>{u.telegramUsername ? `@${u.telegramUsername}` : `ID: ${u.telegramId}`}</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {KycStatusLabel[u.kycStatus]}
                  </span>
                  <button onClick={() => navigate('/users')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--amber-light)', border: '1px solid #fde68a', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 11, fontWeight: 700, color: '#78350f', cursor: 'pointer' }}>
                    Review
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Exchange Rates */}
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Exchange Rates</div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 2 }}>Current market rates</div>
            </div>
            <button onClick={() => navigate('/exchange-rates')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--indigo)' }}>
              Edit <IconChevronRight size={14} />
            </button>
          </div>

          {ratesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
          ) : !rates?.length ? (
            <div style={{ fontSize: 13, color: 'var(--ink-40)', textAlign: 'center', padding: 20 }}>No rates configured</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([Currency.EUR, Currency.USD, Currency.CAD] as Currency[]).map(cur => {
                const rate = rates.find(r => r.currency === cur)
                if (!rate) return null
                return (
                  <div key={cur} style={{ background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{CurrencyLabel[cur]}</span>
                      {rate.updatedAt && <span style={{ fontSize: 10, color: 'var(--ink-40)' }}>{new Date(rate.updatedAt).toLocaleDateString()}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 2 }}>Market</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>{fmtRate(rate.marketRate)}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 2 }}>Instant</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--indigo)', fontFamily: "'DM Mono', monospace" }}>{fmtRate(rate.instantRate)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pending Transactions */}
      {!txLoading && pendingTx.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-5)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Pending Transactions</div>
            <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 2 }}>{pendingTx.length} transactions awaiting settlement</div>
          </div>
          {pendingTx.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--ink-5)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconClock size={18} color="var(--amber)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t.counterpartDisplayName}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>{CurrencyLabel[t.currency]} · {new Date(t.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{t.amount.toLocaleString()} {CurrencyLabel[t.currency]}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700, background: 'var(--amber-light)', color: '#78350f', border: '1px solid #fde68a' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                Pending
              </span>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Spinner /></div>
      )}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { label: 'Manage Users & KYC', sub: 'Review and approve user identities', to: '/users', icon: <IconUsers size={20} />, color: 'var(--green)' },
            { label: 'Update Exchange Rates', sub: 'Set market and instant rates for all currencies', to: '/exchange-rates', icon: <IconArrowsExchange size={20} />, color: 'var(--indigo)' },
            { label: 'Manual Match Requests', sub: 'Pair send and receive requests manually', to: '/admin-match', icon: <IconArrowLeftRight size={20} />, color: 'var(--blue)' },
          ].map(item => (
            <button key={item.to} onClick={() => navigate(item.to)} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '16px 18px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.15s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${item.color}18`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>{item.sub}</div>
              </div>
              <IconChevronRight size={16} style={{ color: 'var(--ink-20)', marginLeft: 'auto', flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
