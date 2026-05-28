import { useState, useEffect } from 'react'
import { IconClock, IconDeviceFloppy } from '@tabler/icons-react'
import { settingsApi } from '../api'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'

export default function Settings() {
  const toast = useToast()
  const [hours, setHours] = useState<number | ''>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsApi.getMatchConfirmationHours()
      .then(res => setHours(res.hours))
      .catch(() => toast('error', 'Load failed', 'Could not fetch confirmation hours'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    const h = Number(hours)
    if (!hours || isNaN(h) || h < 1 || h > 168) {
      toast('error', 'Invalid value', 'Hours must be between 1 and 168')
      return
    }
    setSaving(true)
    try {
      await settingsApi.setMatchConfirmationHours(h)
      toast('success', 'Saved', `Match confirmation window set to ${h} hours`)
    } catch {
      toast('error', 'Save failed', 'Could not update setting')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560 }}>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--ink-10)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--indigo-light)', color: 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconClock size={18} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Match Confirmation Window</div>
            <div style={{ fontSize: 12, color: 'var(--ink-40)' }}>Time users have to confirm or reject a match</div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ink-40)', marginBottom: 6 }}>
                Hours (1–168)
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={hours}
                  onChange={e => setHours(e.target.value === '' ? '' : Number(e.target.value))}
                  style={{ flex: 1, height: 42, border: '1.5px solid var(--ink-20)', borderRadius: 'var(--radius-md)', padding: '0 14px', fontSize: 14, fontWeight: 600, color: 'var(--ink)', outline: 'none', background: '#fff', fontFamily: "'DM Mono', monospace" }}
                />
                <button
                  onClick={handleSave}
                  disabled={saving || hours === ''}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '0 20px', background: 'var(--ink)', color: '#fff',
                    border: 'none', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
                    cursor: saving || hours === '' ? 'not-allowed' : 'pointer',
                    opacity: saving || hours === '' ? 0.6 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {saving ? <Spinner size={14} color="#fff" /> : <IconDeviceFloppy size={15} />}
                  Save
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 6 }}>
                Current: <strong style={{ color: 'var(--ink)', fontFamily: "'DM Mono', monospace" }}>{hours}</strong> hours after match creation
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
