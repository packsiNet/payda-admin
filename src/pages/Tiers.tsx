import { useState } from 'react'
import { IconPlus, IconEdit, IconRefresh, IconCheck, IconArrowUp } from '@tabler/icons-react'
import { useApi } from '../hooks/useApi'
import { tiersApi } from '../api'
import type { Tier } from '../api/types'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

type TierForm = Omit<Tier, 'id'>

const EMPTY_FORM: TierForm = {
  name: '', order: 1,
  maxActiveRequests: 3, maxAmountPerRequest: 1000,
  requiredCompletedTransactions: 0,
}

const TIER_COLORS = ['var(--amber)', 'var(--ink-40)', 'var(--green)', 'var(--indigo)', 'var(--blue)']
const TIER_BG    = ['var(--amber-light)', 'var(--ink-10)', 'var(--green-light)', 'var(--indigo-light)', 'var(--blue-light)']

function TierModal({ tier, onClose, onSaved }: { tier: Tier | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState<TierForm>(tier ? { name: tier.name, order: tier.order, maxActiveRequests: tier.maxActiveRequests, maxAmountPerRequest: tier.maxAmountPerRequest, requiredCompletedTransactions: tier.requiredCompletedTransactions } : EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof TierForm>(k: K, v: TierForm[K]) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) { toast('error', 'Name required', 'Please enter a tier name'); return }
    setLoading(true)
    try {
      if (tier) {
        await tiersApi.update(tier.id, form)
        toast('success', 'Tier updated', `${form.name} has been updated`)
      } else {
        await tiersApi.create(form)
        toast('success', 'Tier created', `${form.name} has been created`)
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      const e = err as Record<string, string>
      toast('error', 'Save failed', e?.detail ?? e?.title ?? 'Unknown error')
    } finally { setLoading(false) }
  }

  const fields: Array<{ label: string; key: keyof TierForm; type: string; hint: string; min?: number }> = [
    { label: 'Tier Name',                       key: 'name',                           type: 'text',   hint: 'e.g. Bronze, Silver, Gold' },
    { label: 'Order',                            key: 'order',                          type: 'number', hint: 'Display order (lower = lower tier)', min: 1 },
    { label: 'Max Active Requests',              key: 'maxActiveRequests',              type: 'number', hint: 'Maximum concurrent open requests', min: 1 },
    { label: 'Max Amount Per Request',           key: 'maxAmountPerRequest',            type: 'number', hint: 'Maximum amount allowed per single request', min: 1 },
    { label: 'Required Completed Transactions',  key: 'requiredCompletedTransactions',  type: 'number', hint: 'Transactions needed to reach this tier', min: 0 },
  ]

  return (
    <Modal
      open
      onClose={onClose}
      title={tier ? `Edit Tier: ${tier.name}` : 'Create New Tier'}
      width={460}
      footer={
        <>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-60)' }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Spinner size={14} color="#fff" /> : <IconCheck size={15} />}
            {tier ? 'Save Changes' : 'Create Tier'}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {fields.map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', letterSpacing: '0.2px' }}>{f.label}</label>
            <input
              type={f.type}
              min={f.min}
              value={form[f.key] as string | number}
              onChange={e => set(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value as TierForm[typeof f.key])}
              style={{ height: 40, padding: '0 13px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--ink)', outline: 'none', background: '#fff' }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--ink-40)' }}>{f.hint}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default function Tiers() {
  const [modalTier, setModalTier] = useState<Tier | null | 'new'>(null)
  const { data: tiers, loading, error, refetch } = useApi(() => tiersApi.getAll())

  const sorted = [...(tiers ?? [])].sort((a, b) => a.order - b.order)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', background: '#fff', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}>
          <IconRefresh size={14} /> Refresh
        </button>
        <button onClick={() => setModalTier('new')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
          <IconPlus size={14} /> New Tier
        </button>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>}
      {error   && <div style={{ padding: 24, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>Error: {error}</div>}

      {/* Tier cards */}
      {!loading && sorted.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {sorted.map((tier, i) => {
            const color = TIER_COLORS[i % TIER_COLORS.length]
            const bg    = TIER_BG[i % TIER_BG.length]
            return (
              <div key={tier.id} style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                      {tier.order}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{tier.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 1 }}>Order #{tier.order}</div>
                    </div>
                  </div>
                  <button onClick={() => setModalTier(tier)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 11.5, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}>
                    <IconEdit size={13} /> Edit
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Max Active Requests',     value: tier.maxActiveRequests },
                    { label: 'Max Amount / Request',     value: tier.maxAmountPerRequest.toLocaleString() },
                    { label: 'Required Transactions',    value: tier.requiredCompletedTransactions },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--ink-5)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: 11.5, color: 'var(--ink-60)' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary table */}
      {!loading && sorted.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--ink-5)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Tier Progression</div>
            <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 2 }}>Ordered by level from lowest to highest</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1.5fr 1.5fr', padding: '10px 20px', background: 'var(--ink-5)', borderBottom: '1px solid var(--ink-10)' }}>
            {['Order', 'Name', 'Max Requests', 'Max Amount', 'Required Txns'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{h}</span>
            ))}
          </div>
          {sorted.map((tier, i) => {
            const color = TIER_COLORS[i % TIER_COLORS.length]
            const bg    = TIER_BG[i % TIER_BG.length]
            return (
              <div key={tier.id} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr 1.5fr 1.5fr 1.5fr', padding: '13px 20px', borderBottom: '1px solid var(--ink-5)', alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-sm)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{tier.order}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {tier.name}
                  {i > 0 && <IconArrowUp size={12} style={{ color: 'var(--green)' }} />}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{tier.maxActiveRequests}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>{tier.maxAmountPerRequest.toLocaleString()}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{tier.requiredCompletedTransactions}</div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && sorted.length === 0 && !error && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', padding: 60, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>No Tiers Configured</div>
          <div style={{ fontSize: 13, color: 'var(--ink-40)', marginBottom: 20 }}>Create your first tier level to get started</div>
          <button onClick={() => setModalTier('new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <IconPlus size={15} /> Create First Tier
          </button>
        </div>
      )}

      {modalTier !== null && (
        <TierModal
          tier={modalTier === 'new' ? null : modalTier}
          onClose={() => setModalTier(null)}
          onSaved={refetch}
        />
      )}
    </div>
  )
}
