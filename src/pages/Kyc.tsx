import { useState } from 'react'
import { IconCircleCheck, IconCircleX, IconRefresh, IconChevronLeft, IconChevronRight, IconClock } from '@tabler/icons-react'
import { useApi } from '../hooks/useApi'
import { usersApi } from '../api'
import type { PendingKycUser } from '../api/types'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

function KycDetailModal({ user, onClose, onDone }: { user: PendingKycUser; onClose: () => void; onDone: () => void }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState<Record<string, boolean>>({})

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || `User #${user.telegramId}`

  const act = async (action: () => Promise<void>, successMsg: string) => {
    setLoading(true)
    try {
      await action()
      toast('success', successMsg)
      onDone()
      onClose()
    } catch (err: unknown) {
      const e = err as Record<string, string>
      toast('error', 'Action failed', e?.detail ?? e?.title ?? 'Unknown error')
    } finally { setLoading(false) }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`KYC Review: ${name}`}
      width={600}
      footer={
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button
            disabled={loading}
            onClick={() => act(() => usersApi.approveKyc(user.id), 'KYC Approved')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            <IconCircleCheck size={16} /> Approve KYC
          </button>
          <button
            disabled={loading}
            onClick={() => act(() => usersApi.rejectKyc(user.id), 'KYC Rejected')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', background: 'var(--red-light)', color: 'var(--red)', border: '1.5px solid #fecaca', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            <IconCircleX size={16} /> Reject KYC
          </button>
          <button
            onClick={onClose}
            style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-60)' }}
          >
            Cancel
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* User info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Name',         name],
            ['Telegram',     user.telegramUsername ? `@${user.telegramUsername}` : `ID: ${user.telegramId}`],
            ['Date of Birth',user.dateOfBirth ?? '—'],
            ['Phone',        user.phoneNumber ?? '—'],
            ['Submitted',    new Date(user.kycSubmittedAt).toLocaleString()],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* KYC Images */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>KYC Documents</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-60)', marginBottom: 6 }}>Selfie</div>
              {imgError['selfie'] ? (
                <div style={{ height: 200, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', background: 'var(--ink-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', fontSize: 12 }}>
                  Failed to load
                </div>
              ) : (
                <img
                  src={user.selfieImageUrl}
                  alt="Selfie"
                  onError={() => setImgError(p => ({ ...p, selfie: true }))}
                  style={{ width: '100%', height: 200, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                  onClick={() => window.open(user.selfieImageUrl, '_blank')}
                />
              )}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-60)', marginBottom: 6 }}>Document</div>
              {imgError['document'] ? (
                <div style={{ height: 200, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', background: 'var(--ink-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', fontSize: 12 }}>
                  Failed to load
                </div>
              ) : (
                <img
                  src={user.documentImageUrl}
                  alt="Document"
                  onError={() => setImgError(p => ({ ...p, document: true }))}
                  style={{ width: '100%', height: 200, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                  onClick={() => window.open(user.documentImageUrl, '_blank')}
                />
              )}
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-40)', marginTop: 6 }}>Click image to open full size</div>
        </div>

      </div>
    </Modal>
  )
}

export default function Kyc() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [selected, setSelected] = useState<PendingKycUser | null>(null)

  const { data: users, loading, error, refetch } = useApi(
    () => usersApi.getPendingKyc(page, pageSize),
    [page, pageSize]
  )

  const quickAct = async (user: PendingKycUser, action: () => Promise<void>, msg: string) => {
    try { await action(); toast('success', msg); refetch() }
    catch (err: unknown) { const e = err as Record<string, string>; toast('error', 'Failed', e?.detail ?? '') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>KYC Review Queue</div>
          <div style={{ fontSize: 12, color: 'var(--ink-40)', marginTop: 2 }}>Pending requests sorted oldest first (FIFO)</div>
        </div>
        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', padding: '6px 12px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}>
          <IconRefresh size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr', gap: 0, padding: '10px 20px', background: 'var(--ink-5)', borderBottom: '1px solid var(--ink-10)' }}>
          {['User', 'Telegram', 'Phone', 'Submitted', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{h}</span>
          ))}
        </div>

        {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>}
        {error   && <div style={{ padding: 24, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>Error: {error}</div>}

        {!loading && !error && (users ?? []).length === 0 && (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>
            <IconClock size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 10px' }} />
            No pending KYC requests
          </div>
        )}

        {!loading && (users ?? []).map(user => {
          const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || `User #${user.telegramId}`
          const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U'
          const submittedAt = new Date(user.kycSubmittedAt)
          const hoursAgo = Math.round((Date.now() - submittedAt.getTime()) / 3600000)

          return (
            <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr', gap: 0, padding: '13px 20px', borderBottom: '1px solid var(--ink-5)', alignItems: 'center' }}>
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--amber-light)', color: '#78350f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-40)', fontFamily: "'DM Mono', monospace" }}>{user.id.slice(0, 8)}…</div>
                </div>
              </div>
              {/* Telegram */}
              <div style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>
                {user.telegramUsername ? `@${user.telegramUsername}` : <span style={{ color: 'var(--ink-40)', fontStyle: 'italic' }}>No username</span>}
              </div>
              {/* Phone */}
              <div style={{ fontSize: 12.5, color: 'var(--ink-60)', fontFamily: "'DM Mono', monospace" }}>
                {user.phoneNumber ?? <span style={{ color: 'var(--ink-40)', fontStyle: 'italic' }}>—</span>}
              </div>
              {/* Submitted */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--ink)' }}>{submittedAt.toLocaleDateString()}</div>
                <div style={{ fontSize: 10.5, color: hoursAgo > 24 ? 'var(--red)' : 'var(--ink-40)' }}>{hoursAgo}h ago</div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 5 }}>
                <button
                  title="Approve KYC"
                  onClick={() => quickAct(user, () => usersApi.approveKyc(user.id), 'KYC Approved')}
                  style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--green-mid)', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <IconCircleCheck size={14} />
                </button>
                <button
                  title="Reject KYC"
                  onClick={() => quickAct(user, () => usersApi.rejectKyc(user.id), 'KYC Rejected')}
                  style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', background: 'var(--red-light)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <IconCircleX size={14} />
                </button>
                <button
                  title="Review Details"
                  onClick={() => setSelected(user)}
                  style={{ padding: '0 10px', height: 28, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--ink-20)', background: '#fff', color: 'var(--ink-60)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  Review
                </button>
              </div>
            </div>
          )
        })}

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-40)' }}>
            Page {page} · {(users ?? []).length} pending
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
              <IconChevronLeft size={14} /> Prev
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={(users?.length ?? 0) < pageSize}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer', opacity: (users?.length ?? 0) < pageSize ? 0.4 : 1 }}>
              Next <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <KycDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onDone={refetch}
        />
      )}
    </div>
  )
}
