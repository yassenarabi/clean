import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { citiesService, notificationsService } from './../../services/api.js'

// ── Relative time helper ──
const relativeTime = (dateStr) => {
  if (!dateStr) return ''
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'Just now'
  if (mins  < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days  < 7)  return days === 1 ? 'Yesterday' : `${days} days ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Notification type → icon/color ──
const NOTIF_META = {
  report_assigned:    { icon: 'bi-arrow-repeat',        bg: '#ede9fe', color: '#7c3aed', pts: ''      },
  report_in_progress: { icon: 'bi-tools',               bg: '#dbeafe', color: '#2563eb', pts: ''      },
  report_resolved:    { icon: 'bi-check-circle-fill',   bg: '#dcfce7', color: '#16a34a', pts: '+50 pts' },
  report_rejected:    { icon: 'bi-x-circle-fill',       bg: '#fee2e2', color: '#dc2626', pts: ''      },
  points_earned:      { icon: 'bi-star-fill',           bg: '#fef3c7', color: '#d97706', pts: '+pts'  },
  upvote:             { icon: 'bi-hand-thumbs-up-fill', bg: '#dbeafe', color: '#2563eb', pts: '+10 pts' },
  general:            { icon: 'bi-bell-fill',           bg: '#f1f5f9', color: '#64748b', pts: ''      },
}
const getNotifMeta = (type) => NOTIF_META[type] || NOTIF_META.general

const BADGES = [
  { icon: 'bi-lightning-charge-fill', label: 'Eco Warrior',    color: '#16a34a', bg: '#dcfce7', minReports: 1  },
  { icon: 'bi-stars',                 label: 'Problem Solver', color: '#d97706', bg: '#fef3c7', minReports: 5  },
  { icon: 'bi-people-fill',           label: 'Neighborly',     color: '#2563eb', bg: '#dbeafe', minReports: 10 },
  { icon: 'bi-shield-fill',           label: 'Master Steward', color: '#94a3b8', bg: '#f1f5f9', minReports: 25 },
  { icon: 'bi-building',              label: 'City Guardian',  color: '#94a3b8', bg: '#f1f5f9', minReports: 50 },
  { icon: 'bi-megaphone-fill',        label: 'Local Voice',    color: '#94a3b8', bg: '#f1f5f9', minReports: 100 },
]

export default function UserProfile() {
  const navigate  = useNavigate()
  const avatarRef = useRef(null)

  const [user,         setUser]         = useState(null)
  const [cities,       setCities]       = useState([])
  const [activity,     setActivity]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [error,        setError]        = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarFile,   setAvatarFile]   = useState(null)

  const [form, setForm] = useState({ name: '', email: '', city_id: '', lang: 'English' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // ── Fetch user data + cities + recent activity ──
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [meRes, citiesRes, notifsRes] = await Promise.all([
          api.get('/auth/me'),
          citiesService.getAll(),
          notificationsService.getAll({ page: 1 }),
        ])

        const u = meRes.data.data ?? meRes.data
        setUser(u)
        setForm({
          name:    u.name    || '',
          email:   u.email   || '',
          city_id: u.city_id || u.city?.id || '',
          lang:    'English',
        })

        const cityList = citiesRes.data.data ?? citiesRes.data ?? []
        setCities(Array.isArray(cityList) ? cityList : Object.values(cityList))

        const notifData = notifsRes.data.data?.data ?? notifsRes.data.data ?? notifsRes.data ?? []
        setActivity(Array.isArray(notifData) ? notifData.slice(0, 4) : [])
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ── Save profile ──
  const handleSave = async () => {
    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('name',    form.name)
      formData.append('email',   form.email)
      formData.append('city_id', form.city_id)
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await api.post('/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const updated = res.data.data ?? res.data
      setUser(updated)
      // Update localStorage user if stored
      const stored = localStorage.getItem('user')
      if (stored) localStorage.setItem('user', JSON.stringify({ ...JSON.parse(stored), ...updated }))

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (e) => {
    const f = e.target.files[0]
    if (f) {
      setAvatarFile(f)
      setAvatarPreview(URL.createObjectURL(f))
    }
  }

  const avatarSrc = avatarPreview || user?.avatar
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '?')}&background=16a34a&color=fff`

  const resolvedCount = user?.resolved_reports_count ?? 0
  const totalReports  = user?.reports_count ?? 0
  const totalPoints   = user?.total_points ?? 0
  const cityRank      = user?.rank ?? '—'
  const memberSince   = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—'

  if (loading) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status" />
        <p className="text-secondary">Loading profile...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }} />
        <h5 className="mt-3 text-danger">{error}</h5>
        <button className="btn btn-success mt-3" onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* ── Profile Header ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">

              <div className="d-flex align-items-center gap-4">
                {/* Avatar */}
                <div className="position-relative flex-shrink-0">
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: 90, height: 90, objectFit: 'cover', border: '3px solid #16a34a' }}
                  />
                  <button
                    className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center border-0"
                    style={{ width: 28, height: 28, background: '#16a34a', cursor: 'pointer' }}
                    onClick={() => avatarRef.current.click()}
                  >
                    <i className="bi bi-pencil-fill text-white" style={{ fontSize: '.65rem' }} />
                  </button>
                  <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={handleAvatarChange} />
                </div>

                {/* Info */}
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '1.3rem', color: '#0f172a' }}>{user?.name}</h4>
                    {totalPoints >= 1000 && (
                      <span className="badge rounded-pill fw-semibold px-2 py-1" style={{ background: '#16a34a', color: '#fff', fontSize: '.72rem' }}>
                        Pro Contributor
                      </span>
                    )}
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary mb-1" style={{ fontSize: '.82rem' }}>
                    <i className="bi bi-calendar3" style={{ fontSize: '.75rem' }} /> Member since {memberSince}
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '.82rem' }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: '.75rem' }} />
                    {user?.city?.name || cities.find(c => c.id == form.city_id)?.name || 'Not set'}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn fw-bold px-4"
                  style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem' }}
                  onClick={() => navigate('/user/report')}
                >
                  Report Now
                </button>
                <button
                  className="btn fw-semibold px-4"
                  style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, fontSize: '.88rem' }}
                  onClick={() => navigate('/user/my-reports')}
                >
                  My Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="row g-2 mb-3">
          {[
            { icon: 'bi-star-fill',      color: '#16a34a', label: 'Total Points', value: totalPoints.toLocaleString() },
            { icon: 'bi-bar-chart-fill', color: '#2563eb', label: 'City Rank',    value: cityRank !== '—' ? `#${cityRank}` : '—' },
            { icon: 'bi-file-earmark',   color: '#d97706', label: 'Reports',      value: totalReports },
            { icon: 'bi-check-circle',   color: '#16a34a', label: 'Resolved',     value: resolvedCount },
          ].map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border shadow-none h-100">
                <div className="card-body p-3">
                  <i className={`bi ${s.icon} mb-2`} style={{ fontSize: '1.1rem', color: s.color }} />
                  <div className="text-secondary mb-1" style={{ fontSize: '.72rem' }}>{s.label}</div>
                  <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#0f172a' }}>{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">

          {/* ── LEFT ── */}
          <div className="col-lg-7">

            {/* Civic Badges */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold" style={{ fontSize: '.95rem' }}>Civic Badges</span>
                </div>
                <div className="d-flex gap-3 flex-wrap">
                  {BADGES.map((b, i) => {
                    const unlocked = totalReports >= b.minReports
                    return (
                      <div key={i} className="d-flex flex-column align-items-center gap-1" style={{ opacity: unlocked ? 1 : .4 }}>
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 52, height: 52, background: b.bg }}
                        >
                          <i className={`bi ${b.icon}`} style={{ fontSize: '1.3rem', color: unlocked ? b.color : '#94a3b8' }} />
                        </div>
                        <span className="text-center" style={{ fontSize: '.68rem', color: '#475569', maxWidth: 56, lineHeight: 1.2 }}>{b.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="card border shadow-none">
              <div className="card-body p-4">
                <div className="fw-bold mb-4" style={{ fontSize: '.95rem' }}>Profile Settings</div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '.82rem' }}>Full Name</label>
                    <input className="form-control" style={{ fontSize: '.87rem' }}
                      value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '.82rem' }}>Email Address</label>
                    <input type="email" className="form-control" style={{ fontSize: '.87rem' }}
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '.82rem' }}>City</label>
                    <select className="form-select" style={{ fontSize: '.87rem' }}
                      value={form.city_id} onChange={e => set('city_id', e.target.value)}>
                      <option value="">Select city...</option>
                      {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" style={{ fontSize: '.82rem' }}>Notification Language</label>
                    <div className="d-flex align-items-center gap-4 mt-2">
                      {['English', 'العربية'].map(l => (
                        <div key={l} className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => set('lang', l)}>
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%',
                            border: `2px solid ${form.lang === l ? '#16a34a' : '#cbd5e1'}`,
                            background: form.lang === l ? '#16a34a' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {form.lang === l && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                          </div>
                          <span style={{ fontSize: '.85rem', color: '#334155' }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn fw-bold px-4"
                    style={{ background: saved ? '#15803d' : '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.9rem' }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT ── */}
          <div className="col-lg-5">
            <div className="card border shadow-none">
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-clock-history text-success" />
                  <span className="fw-bold" style={{ fontSize: '.95rem' }}>Recent Activity</span>
                </div>

                {activity.length === 0 ? (
                  <div className="text-center py-4 text-secondary" style={{ fontSize: '.85rem' }}>
                    <i className="bi bi-clock-history" style={{ fontSize: '2rem', opacity: .3 }} />
                    <div className="mt-2">No activity yet</div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {activity.map((a, i) => {
                      const meta = getNotifMeta(a.type)
                      return (
                        <div key={i} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: 36, height: 36, background: meta.bg }}
                          >
                            <i className={`bi ${meta.icon}`} style={{ fontSize: '.85rem', color: meta.color }} />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="fw-semibold" style={{ fontSize: '.85rem', color: '#0f172a' }}>{a.title}</span>
                              {meta.pts && <span className="fw-bold" style={{ fontSize: '.78rem', color: '#16a34a' }}>{meta.pts}</span>}
                            </div>
                            <div className="text-secondary mb-1" style={{ fontSize: '.78rem' }}>{a.message}</div>
                            <div className="text-secondary" style={{ fontSize: '.68rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                              {relativeTime(a.created_at)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {activity.length > 0 && (
                  <button
                    className="btn w-100 mt-3 fw-semibold"
                    style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, fontSize: '.85rem' }}
                    onClick={() => navigate('/user/notifications')}
                  >
                    View All Activity
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}