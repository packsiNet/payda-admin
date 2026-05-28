import { useState } from 'react'
import {
  IconCircleCheck, IconCircleX, IconChevronLeft, IconChevronRight,
  IconShield, IconShieldOff, IconUserCheck, IconRefresh, IconEye,
} from '@tabler/icons-react'
import { useApi } from '../hooks/useApi'
import { usersApi } from '../api'
import { KycStatus, KycStatusLabel, UserRole, UserRoleLabel, type User } from '../api/types'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'

const KYC_STYLE: Record<KycStatus, { bg: string; color: string; border: string }> = {
  [KycStatus.NotSubmitted]: { bg: 'var(--ink-10)',     color: 'var(--ink-60)',       border: 'var(--ink-20)' },
  [KycStatus.Pending]:      { bg: 'var(--amber-light)',color: '#78350f',             border: '#fde68a' },
  [KycStatus.Approved]:     { bg: 'var(--green-light)',color: 'var(--green-text)',   border: 'var(--green-mid)' },
  [KycStatus.Rejected]:     { bg: 'var(--red-light)',  color: '#7f1d1d',             border: '#fecaca' },
}

const ROLE_STYLE: Record<UserRole, { bg: string; color: string; border: string }> = {
  [UserRole.User]:  { bg: 'var(--ink-10)',     color: 'var(--ink-60)',  border: 'var(--ink-20)' },
  [UserRole.Agent]: { bg: 'var(--blue-light)', color: '#1e3a8a',        border: '#bfdbfe' },
  [UserRole.Admin]: { bg: 'var(--indigo-light)',color: '#3730a3',       border: '#c7d2fe' },
}

function Badge({ children, bg, color, border, dot }: { children: React.ReactNode; bg: string; color: string; border: string; dot?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700, background: bg, color, border: `1px solid ${border}` }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />}
      {children}
    </span>
  )
}

function UserDetailModal({ user, onClose, onRefresh }: { user: User; onClose: () => void; onRefresh: () => void }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [newRole, setNewRole] = useState(user.role)
  const [imgError, setImgError] = useState<Record<string, boolean>>({})

  const act = async (action: () => Promise<void>, successMsg: string) => {
    setLoading(true)
    try {
      await action()
      toast('success', successMsg)
      onRefresh()
      onClose()
    } catch (err: unknown) {
      const e = err as Record<string, string>
      toast('error', 'Action failed', e?.detail ?? e?.title ?? 'Unknown error')
    } finally { setLoading(false) }
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || `User #${user.telegramId}`

  return (
    <Modal
      open
      onClose={onClose}
      title={`User: ${name}`}
      width={580}
      footer={
        <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--ink-20)', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-60)' }}>
          Close
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Basic info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Name',     name],
            ['Telegram', user.telegramUsername ? `@${user.telegramUsername}` : `ID: ${user.telegramId}`],
            ['Tier',     user.tierName],
            ['Joined',   new Date(user.createdAt).toLocaleDateString()],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--ink-5)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* KYC Images */}
        {(user.selfieImageUrl || user.documentImageUrl) && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>KYC Documents</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {user.selfieImageUrl && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-60)', marginBottom: 6 }}>Selfie</div>
                  {imgError['selfie'] ? (
                    <div style={{ height: 180, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', background: 'var(--ink-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', fontSize: 12 }}>Failed to load</div>
                  ) : (
                    <img
                      src={user.selfieImageUrl}
                      alt="Selfie"
                      onError={() => setImgError(p => ({ ...p, selfie: true }))}
                      onClick={() => window.open(user.selfieImageUrl!, '_blank')}
                      style={{ width: '100%', height: 180, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                    />
                  )}
                </div>
              )}
              {user.documentImageUrl && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-60)', marginBottom: 6 }}>Document</div>
                  {imgError['document'] ? (
                    <div style={{ height: 180, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', background: 'var(--ink-5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)', fontSize: 12 }}>Failed to load</div>
                  ) : (
                    <img
                      src={user.documentImageUrl}
                      alt="Document"
                      onError={() => setImgError(p => ({ ...p, document: true }))}
                      onClick={() => window.open(user.documentImageUrl!, '_blank')}
                      style={{ width: '100%', height: 180, borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-10)', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                    />
                  )}
                </div>
              )}
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-40)', marginTop: 6 }}>Click image to open full size</div>
          </div>
        )}

        {/* KYC Actions */}
        {user.kycStatus === KycStatus.Pending && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>KYC Review</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                disabled={loading}
                onClick={() => act(() => usersApi.approveKyc(user.id), 'KYC Approved successfully')}
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
            </div>
          </div>
        )}

        {/* Change Role */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>Change Role</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              value={newRole}
              onChange={e => setNewRole(Number(e.target.value) as UserRole)}
              style={{ flex: 1, height: 40, border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: 13, color: 'var(--ink)', outline: 'none', background: '#fff' }}
            >
              {Object.entries(UserRoleLabel).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button
              disabled={loading || newRole === user.role}
              onClick={() => act(() => usersApi.setRole(user.id, newRole), `Role changed to ${UserRoleLabel[newRole]}`)}
              style={{ padding: '0 18px', background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: (loading || newRole === user.role) ? 0.5 : 1 }}
            >
              <IconUserCheck size={15} />
            </button>
          </div>
        </div>

        {/* Toggle Trusted */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>Trust Status</div>
          <button
            disabled={loading}
            onClick={() => act(() => usersApi.setTrusted(user.id, !user.isTrusted), user.isTrusted ? 'User marked as untrusted' : 'User marked as trusted')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: user.isTrusted ? 'var(--red-light)' : 'var(--green-light)', color: user.isTrusted ? 'var(--red)' : 'var(--green-text)', border: `1.5px solid ${user.isTrusted ? '#fecaca' : 'var(--green-mid)'}`, borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {user.isTrusted ? <><IconShieldOff size={16} /> Remove Trusted</> : <><IconShield size={16} /> Mark as Trusted</>}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function Users() {
  const toast = useToast()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [kycFilter, setKycFilter] = useState<KycStatus | -1>(-1)
  const [roleFilter, setRoleFilter] = useState<UserRole | -1>(-1)
  const [trustedFilter, setTrustedFilter] = useState<boolean | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const { data: users, loading, error, refetch } = useApi(
    () => usersApi.getAll(page, pageSize),
    [page, pageSize]
  )

  const filtered = (users ?? []).filter(u => {
    if (kycFilter !== -1 && u.kycStatus !== kycFilter) return false
    if (roleFilter !== -1 && u.role !== roleFilter) return false
    if (trustedFilter !== null && u.isTrusted !== trustedFilter) return false
    return true
  })

  const quickAct = async (_u: User, action: () => Promise<void>, msg: string) => {
    try { await action(); toast('success', msg); refetch() }
    catch (err: unknown) { const e = err as Record<string, string>; toast('error', 'Failed', e?.detail ?? '') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--ink-10)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-40)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Filter:</span>

        <select value={kycFilter} onChange={e => { setKycFilter(Number(e.target.value) as KycStatus | -1); setPage(1) }}
          style={{ border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12.5, color: 'var(--ink)', background: '#fff', outline: 'none' }}>
          <option value={-1}>All KYC</option>
          {Object.entries(KycStatusLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select value={roleFilter} onChange={e => { setRoleFilter(Number(e.target.value) as UserRole | -1); setPage(1) }}
          style={{ border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12.5, color: 'var(--ink)', background: '#fff', outline: 'none' }}>
          <option value={-1}>All Roles</option>
          {Object.entries(UserRoleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        <select value={trustedFilter === null ? '' : String(trustedFilter)} onChange={e => { setTrustedFilter(e.target.value === '' ? null : e.target.value === 'true'); setPage(1) }}
          style={{ border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12.5, color: 'var(--ink)', background: '#fff', outline: 'none' }}>
          <option value="">All Trust</option>
          <option value="true">Trusted</option>
          <option value="false">Untrusted</option>
        </select>

        <button onClick={refetch} style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', padding: '6px 12px', border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-sm)', background: '#fff', fontSize: 12, fontWeight: 600, color: 'var(--ink-60)', cursor: 'pointer' }}>
          <IconRefresh size={14} /> Refresh
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 0.8fr 1fr 1fr', gap: 0, padding: '10px 20px', background: 'var(--ink-5)', borderBottom: '1px solid var(--ink-10)' }}>
          {['User', 'Telegram', 'KYC', 'Role', 'Trusted', 'Tier', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--ink-40)' }}>{h}</span>
          ))}
        </div>

        {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>}
        {error  && <div style={{ padding: 24, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>Error: {error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-40)', fontSize: 13 }}>No users match the selected filters</div>
        )}

        {!loading && filtered.map(user => {
          const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || `User #${user.telegramId}`
          const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U'
          const kycS = KYC_STYLE[user.kycStatus]
          const roleS = ROLE_STYLE[user.role]

          return (
            <div key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 0.8fr 1fr 1fr', gap: 0, padding: '13px 20px', borderBottom: '1px solid var(--ink-5)', alignItems: 'center' }}>
              {/* User */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ink-10)', color: 'var(--ink-60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-40)', fontFamily: "'DM Mono', monospace" }}>{user.id.slice(0, 8)}…</div>
                </div>
              </div>
              {/* Telegram */}
              <div style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>
                {user.telegramUsername ? `@${user.telegramUsername}` : <span style={{ color: 'var(--ink-40)', fontStyle: 'italic' }}>No username</span>}
              </div>
              {/* KYC */}
              <div><Badge bg={kycS.bg} color={kycS.color} border={kycS.border} dot>{KycStatusLabel[user.kycStatus]}</Badge></div>
              {/* Role */}
              <div><Badge bg={roleS.bg} color={roleS.color} border={roleS.border}>{UserRoleLabel[user.role]}</Badge></div>
              {/* Trusted */}
              <div>
                {user.isTrusted
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--green)' }}><IconShield size={13} /> Yes</span>
                  : <span style={{ fontSize: 11, color: 'var(--ink-40)' }}>—</span>}
              </div>
              {/* Tier */}
              <div style={{ fontSize: 12.5, color: 'var(--ink-60)' }}>{user.tierName}</div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 5 }}>
                {user.kycStatus === KycStatus.Pending && (
                  <>
                    <button title="Approve KYC" onClick={() => quickAct(user, () => usersApi.approveKyc(user.id), 'KYC Approved')}
                      style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid var(--green-mid)', background: 'var(--green-light)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <IconCircleCheck size={14} />
                    </button>
                    <button title="Reject KYC" onClick={() => quickAct(user, () => usersApi.rejectKyc(user.id), 'KYC Rejected')}
                      style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', background: 'var(--red-light)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <IconCircleX size={14} />
                    </button>
                  </>
                )}
                <button title="View Details" onClick={() => setSelectedUser(user)}
                  style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--ink-20)', background: '#fff', color: 'var(--ink-60)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <IconEye size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-40)' }}>
            Page {page} · {filtered.length} users shown
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

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRefresh={refetch}
        />
      )}
    </div>
  )
}
