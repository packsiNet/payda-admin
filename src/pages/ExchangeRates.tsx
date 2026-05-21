import { useState } from 'react'
import { IconEdit, IconRefresh, IconCheck } from '@tabler/icons-react'
import { useApi } from '../hooks/useApi'
import { ratesApi } from '../api'
import { Currency, CurrencyLabel, type ExchangeRate } from '../api/types'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

const CURRENCY_FLAG: Record<Currency, string> = {
  [Currency.EUR]: '🇪🇺',
  [Currency.USD]: '🇺🇸',
  [Currency.CAD]: '🇨🇦',
}

function EditRateModal({ rate, onClose, onSaved }: { rate: ExchangeRate; onClose: () => void; onSaved: () => void }) {
  const toast = useToast()
  const [marketRate, setMarketRate] = useState(String(rate.marketRate))
  const [instantRate, setInstantRate] = useState(String(rate.instantRate))
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    const mRate = parseFloat(marketRate)
    const iRate = parseFloat(instantRate)
    if (isNaN(mRate) || isNaN(iRate) || mRate <= 0 || iRate <= 0) {
      toast('error', 'Invalid values', 'Please enter positive numbers for both rates')
      return
    }
    setLoading(true)
    try {
      await ratesApi.update(rate.currency, mRate, iRate)
      toast('success', 'Rate updated', `${CurrencyLabel[rate.currency]} rates saved successfully`)
      onSaved()
      onClose()
    } catch (err: unknown) {
      const e = err as Record<string, string>
      toast('error', 'Update failed', e?.detail ?? e?.title ?? 'Unknown error')
    } finally { setLoading(false) }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${CURRENCY_FLAG[rate.currency]} ${CurrencyLabel[rate.currency]} Rates`}
      width={420}
      footer={
        <>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-60)' }}>Cancel</button>
          <button onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Spinner size={14} color="#fff" /> : <IconCheck size={15} />}
            Save Changes
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontSize: 12.5, color: 'var(--ink-60)' }}>
          Last updated: {rate.updatedAt ? new Date(rate.updatedAt).toLocaleString() : 'Never'}
        </div>

        {[
          { label: 'Market Rate', value: marketRate, setter: setMarketRate, hint: 'The standard market exchange rate' },
          { label: 'Instant Rate', value: instantRate, setter: setInstantRate, hint: 'The instant/premium exchange rate' },
        ].map(({ label, value, setter, hint }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink-60)', letterSpacing: '0.2px' }}>{label}</label>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={e => setter(e.target.value)}
              style={{ height: 42, padding: '0 13px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', fontSize: 16, fontFamily: "'DM Mono', monospace", fontWeight: 600, color: 'var(--ink)', outline: 'none' }}
            />
            <span style={{ fontSize: 10.5, color: 'var(--ink-40)' }}>{hint}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default function ExchangeRates() {
  const toast = useToast()
  const [editRate, setEditRate] = useState<ExchangeRate | null>(null)
  const { data: rates, loading, error, refetch } = useApi(() => ratesApi.getAll())

  const allCurrencies = [Currency.EUR, Currency.USD, Currency.CAD]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', background: '#fff', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}>
          <IconRefresh size={14} /> Refresh
        </button>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner /></div>}
      {error   && <div style={{ padding: 24, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>Error: {error}</div>}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
          {allCurrencies.map(cur => {
            const rate = rates?.find(r => r.currency === cur)
            return (
              <div key={cur} style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', padding: '22px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', top: -30, right: -20, pointerEvents: 'none' }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{CURRENCY_FLAG[cur]}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{CurrencyLabel[cur]}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 1 }}>
                        {rate?.updatedAt ? `Updated ${new Date(rate.updatedAt).toLocaleDateString()}` : 'Not configured'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => rate ? setEditRate(rate) : toast('warning', 'Rate not found', 'This rate has not been configured yet')}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}
                  >
                    <IconEdit size={13} /> Edit
                  </button>
                </div>

                {rate ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1, background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 6 }}>Market Rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px', fontFamily: "'DM Mono', monospace" }}>
                        {rate.marketRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--indigo-light)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--indigo)', marginBottom: 6 }}>Instant Rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--indigo)', letterSpacing: '-0.5px', fontFamily: "'DM Mono', monospace" }}>
                        {rate.instantRate.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', color: 'var(--ink-40)', fontSize: 12.5 }}>
                    Rate not configured
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* History table */}
      {!loading && rates && rates.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ink-5)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>All Rates Summary</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 2fr', padding: '10px 20px', background: 'var(--ink-5)', borderBottom: '1px solid var(--ink-10)' }}>
            {['Currency', 'Market Rate', 'Instant Rate', 'Last Updated'].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{h}</span>
            ))}
          </div>
          {allCurrencies.map(cur => {
            const rate = rates.find(r => r.currency === cur)
            return (
              <div key={cur} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 2fr 2fr', padding: '14px 20px', borderBottom: '1px solid var(--ink-5)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{CURRENCY_FLAG[cur]}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{CurrencyLabel[cur]}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>
                  {rate ? rate.marketRate.toLocaleString() : <span style={{ color: 'var(--ink-40)', fontSize: 12 }}>—</span>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--indigo)', fontFamily: "'DM Mono', monospace" }}>
                  {rate ? rate.instantRate.toLocaleString() : <span style={{ color: 'var(--ink-40)', fontSize: 12 }}>—</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>
                  {rate?.updatedAt ? new Date(rate.updatedAt).toLocaleString() : 'Never'}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editRate && <EditRateModal rate={editRate} onClose={() => setEditRate(null)} onSaved={refetch} />}
    </div>
  )
}
