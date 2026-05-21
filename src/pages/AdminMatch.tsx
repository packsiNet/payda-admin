import { useState } from 'react'
import {
  IconSearch, IconArrowRight, IconArrowUp, IconArrowDown,
  IconShield, IconCircleCheck, IconX,
} from '@tabler/icons-react'
import { requestsApi, matchesApi } from '../api'
import { Currency, CurrencyLabel, RequestType, type RequestSearchResult } from '../api/types'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

function RequestCard({ req, selected, onSelect }: { req: RequestSearchResult; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${selected ? 'var(--green)' : 'var(--ink-10)'}`,
        borderRadius: 'var(--radius-lg)', padding: '14px', cursor: 'pointer',
        background: selected ? 'var(--green-light)' : '#fff',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: selected ? 'var(--green)' : 'var(--ink-10)', color: selected ? '#fff' : 'var(--ink-60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          {req.userInitials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{req.userDisplayName}</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-40)' }}>Level {req.userLevel} · {req.userLevelTitle}</div>
        </div>
        {req.isTrusted && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 'var(--radius-full)', fontSize: 9.5, fontWeight: 700, background: 'var(--green-light)', color: 'var(--green-text)', border: '1px solid var(--green-mid)' }}>
            <IconShield size={10} /> Trusted
          </span>
        )}
        {selected && <IconCircleCheck size={18} style={{ color: 'var(--green)', flexShrink: 0 }} />}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: selected ? 'rgba(255,255,255,0.6)' : 'var(--ink-5)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 3 }}>Amount</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>{req.amount.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, background: selected ? 'rgba(255,255,255,0.6)' : 'var(--ink-5)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 3 }}>Rate</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--indigo)', fontFamily: "'DM Mono', monospace" }}>{req.rateValue.toLocaleString()}</div>
        </div>
      </div>

      {req.paymentMethods.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {req.paymentMethods.map(m => (
            <span key={m} style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 600, background: 'var(--indigo-light)', color: 'var(--indigo)', border: '1px solid #c7d2fe' }}>{m}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchPanel({
  title, type, currency, onSelect, selected,
}: {
  title: string; type: RequestType; currency: Currency
  onSelect: (r: RequestSearchResult | null) => void; selected: RequestSearchResult | null
}) {
  const [amount, setAmount] = useState('')
  const [results, setResults] = useState<RequestSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true); setSearched(true)
    try {
      const data = await requestsApi.search(type, currency, amount ? parseFloat(amount) : undefined)
      setResults(data)
      if (selected && !data.find(r => r.requestId === selected.requestId)) onSelect(null)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  const isGreen = type === RequestType.Send

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: isGreen ? 'var(--green-light)' : 'var(--blue-light)', color: isGreen ? 'var(--green)' : 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isGreen ? <IconArrowUp size={15} /> : <IconArrowDown size={15} />}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="Filter by amount (optional)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, height: 38, border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: 13, color: 'var(--ink)', outline: 'none', background: '#fff' }}
          />
          <button onClick={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? <Spinner size={14} color="#fff" /> : <><IconSearch size={13} /> Search</>}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
        {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}><Spinner /></div>}

        {!loading && searched && results.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: 30, textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>
            No matching requests found
          </div>
        )}

        {!loading && !searched && (
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: 30, textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>
            Click Search to find {title.toLowerCase()}
          </div>
        )}

        {!loading && results.map(r => (
          <RequestCard
            key={r.requestId}
            req={r}
            selected={selected?.requestId === r.requestId}
            onSelect={() => onSelect(selected?.requestId === r.requestId ? null : r)}
          />
        ))}
      </div>
    </div>
  )
}

export default function AdminMatch() {
  const toast = useToast()
  const [currency, setCurrency] = useState<Currency>(Currency.EUR)
  const [senderReq,   setSenderReq]   = useState<RequestSearchResult | null>(null)
  const [receiverReq, setReceiverReq] = useState<RequestSearchResult | null>(null)
  const [isAgentInvolved, setIsAgentInvolved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleCreateMatch = async () => {
    if (!senderReq || !receiverReq) {
      toast('error', 'Selection required', 'Please select both a sender and a receiver request')
      return
    }
    setSubmitting(true)
    try {
      const res = await matchesApi.createAdmin(senderReq.requestId, receiverReq.requestId, isAgentInvolved)
      toast('success', 'Match Created', `Match ID: ${res.id}`)
      setSenderReq(null)
      setReceiverReq(null)
    } catch (err: unknown) {
      const e = err as Record<string, string>
      toast('error', 'Match failed', e?.detail ?? e?.title ?? 'Unknown error')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Currency selector */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Currency:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {([Currency.EUR, Currency.USD, Currency.CAD] as Currency[]).map(cur => (
            <button
              key={cur}
              onClick={() => setCurrency(cur)}
              style={{
                padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${currency === cur ? 'var(--ink)' : 'var(--ink-20)'}`,
                background: currency === cur ? 'var(--ink)' : '#fff',
                color: currency === cur ? '#fff' : 'var(--ink-60)',
                transition: 'all 0.15s',
              }}
            >
              {CurrencyLabel[cur]}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--ink-40)', marginLeft: 'auto' }}>
          Search in both panels, then select one from each to create a match
        </span>
      </div>

      {/* Two-panel search */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <SearchPanel title="Sender Requests (Send)" type={RequestType.Send} currency={currency} selected={senderReq} onSelect={setSenderReq} />

        {/* Center divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, gap: 8, flexShrink: 0 }}>
          <div style={{ width: 1, height: 40, background: 'var(--ink-20)' }} />
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink-5)', border: '2px solid var(--ink-20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconArrowRight size={14} color="var(--ink-40)" />
          </div>
          <div style={{ width: 1, height: 40, background: 'var(--ink-20)' }} />
        </div>

        <SearchPanel title="Receiver Requests (Receive)" type={RequestType.Receive} currency={currency} selected={receiverReq} onSelect={setReceiverReq} />
      </div>

      {/* Match preview and submit */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: `2px solid ${senderReq && receiverReq ? 'var(--green)' : 'var(--ink-10)'}`, padding: '20px', boxShadow: 'var(--shadow-sm)', transition: 'border-color 0.2s' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 14 }}>Match Preview</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 18 }}>
          {/* Sender */}
          <div style={{ background: senderReq ? 'var(--green-light)' : 'var(--ink-5)', borderRadius: 'var(--radius-lg)', padding: '14px', border: `1px solid ${senderReq ? 'var(--green-mid)' : 'var(--ink-10)'}` }}>
            {senderReq ? (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--green-text)', marginBottom: 6 }}>Sender</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{senderReq.userDisplayName}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-text)', marginTop: 4 }}>{senderReq.amount.toLocaleString()} {CurrencyLabel[currency]}</div>
                <button onClick={() => setSenderReq(null)} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--ink-40)' }}>
                  <IconX size={12} /> Clear
                </button>
              </>
            ) : (
              <div style={{ fontSize: 12.5, color: 'var(--ink-40)', textAlign: 'center', padding: '8px 0' }}>
                Select a sender request
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: senderReq && receiverReq ? 'var(--green)' : 'var(--ink-10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconArrowRight size={15} color={senderReq && receiverReq ? '#fff' : 'var(--ink-40)'} />
            </div>
          </div>

          {/* Receiver */}
          <div style={{ background: receiverReq ? 'var(--blue-light)' : 'var(--ink-5)', borderRadius: 'var(--radius-lg)', padding: '14px', border: `1px solid ${receiverReq ? '#bfdbfe' : 'var(--ink-10)'}` }}>
            {receiverReq ? (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1e3a8a', marginBottom: 6 }}>Receiver</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{receiverReq.userDisplayName}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e3a8a', marginTop: 4 }}>{receiverReq.amount.toLocaleString()} {CurrencyLabel[currency]}</div>
                <button onClick={() => setReceiverReq(null)} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--ink-40)' }}>
                  <IconX size={12} /> Clear
                </button>
              </>
            ) : (
              <div style={{ fontSize: 12.5, color: 'var(--ink-40)', textAlign: 'center', padding: '8px 0' }}>
                Select a receiver request
              </div>
            )}
          </div>
        </div>

        {/* Agent toggle + submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div
            onClick={() => setIsAgentInvolved(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 26, borderRadius: 'var(--radius-full)', background: isAgentInvolved ? 'var(--green)' : 'var(--ink-20)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', width: 20, height: 20, borderRadius: '50%', background: '#fff', top: 3, left: isAgentInvolved ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Agent Involved</div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)' }}>Mark if an agent facilitated this match</div>
            </div>
          </div>

          <button
            onClick={handleCreateMatch}
            disabled={!senderReq || !receiverReq || submitting}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', background: 'var(--green)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-lg)', fontSize: 14, fontWeight: 700,
              cursor: !senderReq || !receiverReq ? 'not-allowed' : 'pointer',
              opacity: !senderReq || !receiverReq || submitting ? 0.5 : 1,
              boxShadow: senderReq && receiverReq ? '0 4px 12px rgba(16,185,90,0.3)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {submitting ? <Spinner size={16} color="#fff" /> : <IconCircleCheck size={18} />}
            Create Match
          </button>
        </div>
      </div>
    </div>
  )
}
