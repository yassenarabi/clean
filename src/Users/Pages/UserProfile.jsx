import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const BADGES = [
  { icon: 'bi-lightning-charge-fill', label: 'Eco Warrior',    color: '#16a34a', bg: '#dcfce7', unlocked: true  },
  { icon: 'bi-stars',                 label: 'Problem Solver', color: '#d97706', bg: '#fef3c7', unlocked: true  },
  { icon: 'bi-people-fill',           label: 'Neighborly',     color: '#2563eb', bg: '#dbeafe', unlocked: true  },
  { icon: 'bi-shield-fill',           label: 'Master Steward', color: '#94a3b8', bg: '#f1f5f9', unlocked: false },
  { icon: 'bi-building',              label: 'City Guardian',  color: '#94a3b8', bg: '#f1f5f9', unlocked: false },
  { icon: 'bi-megaphone-fill',        label: 'Local Voice',    color: '#94a3b8', bg: '#f1f5f9', unlocked: false },
]

const ACTIVITY = [
  { icon: 'bi-check-circle-fill', color: '#16a34a', bg: '#dcfce7', title: 'Report Resolved',  pts: '+50 pts',  desc: 'Street cleaning report in Maadi completed.',  time: '2 HOURS AGO'  },
  { icon: 'bi-hand-thumbs-up-fill',color:'#d97706', bg: '#fef3c7', title: 'Upvote Received',  pts: '+10 pts',  desc: 'Others confirmed your lighting report.',       time: 'YESTERDAY'    },
  { icon: 'bi-person-plus-fill',  color: '#2563eb', bg: '#dbeafe', title: 'Referral Join',    pts: '+100 pts', desc: 'Nadia joined via your link.',                  time: '3 DAYS AGO'   },
  { icon: 'bi-file-earmark-fill', color: '#7c3aed', bg: '#ede9fe', title: 'First Report',     pts: '+200 pts', desc: 'Achievement unlocked: Active Citizen.',        time: 'OCT 12, 2023' },
]

const CITIES = ['Maadi, Cairo', 'Zamalek, Cairo', 'Heliopolis, Cairo', 'Giza', 'Alexandria', 'Mansoura']

export default function UserProfile() {
  const navigate  = useNavigate()
  const avatarRef = useRef(null)

  const [avatar,   setAvatar]   = useState('https://randomuser.me/api/portraits/men/32.jpg')
  const [form,     setForm]     = useState({ name: 'Ahmed El-Sayed', email: 'ahmed.e@example.com', city: 'Maadi, Cairo', lang: 'English' })
  const [saved,    setSaved]    = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    // TODO: API call
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

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
                    src={avatar}
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
                    onChange={e => { const f = e.target.files[0]; if (f) setAvatar(URL.createObjectURL(f)) }} />
                </div>

                {/* Info */}
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h4 className="fw-bold mb-0" style={{ fontSize: '1.3rem', color: '#0f172a' }}>Ahmed El-Sayed</h4>
                    <span className="badge rounded-pill fw-semibold px-2 py-1" style={{ background: '#16a34a', color: '#fff', fontSize: '.72rem' }}>
                      Pro Contributor
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary mb-1" style={{ fontSize: '.82rem' }}>
                    <i className="bi bi-calendar3" style={{ fontSize: '.75rem' }} /> Member since Oct 2023
                  </div>
                  <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '.82rem' }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: '.75rem' }} /> Maadi, Cairo
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
                >
                  View Impact Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="row g-2 mb-3">
          {[
            { icon: 'bi-star-fill',       color: '#16a34a', label: 'Total Points', value: '2,450' },
            { icon: 'bi-bar-chart-fill',  color: '#2563eb', label: 'City Rank',    value: '#12'   },
            { icon: 'bi-file-earmark',    color: '#d97706', label: 'Reports',      value: '48'    },
            { icon: 'bi-check-circle',    color: '#16a34a', label: 'Resolved',     value: '42'    },
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
                  <button className="btn btn-link p-0 fw-semibold text-decoration-none" style={{ color: '#16a34a', fontSize: '.83rem' }}>View All</button>
                </div>
                <div className="d-flex gap-3 flex-wrap">
                  {BADGES.map((b, i) => (
                    <div key={i} className="d-flex flex-column align-items-center gap-1" style={{ opacity: b.unlocked ? 1 : .4 }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 52, height: 52, background: b.bg }}
                      >
                        <i className={`bi ${b.icon}`} style={{ fontSize: '1.3rem', color: b.color }} />
                      </div>
                      <span className="text-center" style={{ fontSize: '.68rem', color: '#475569', maxWidth: 56, lineHeight: 1.2 }}>{b.label}</span>
                    </div>
                  ))}
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
                    <label className="form-label fw-semibold" style={{ fontSize: '.82rem' }}>City / District</label>
                    <select className="form-select" style={{ fontSize: '.87rem' }}
                      value={form.city} onChange={e => set('city', e.target.value)}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
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
                  >
                    {saved ? '✓ Saved!' : 'Save Changes'}
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

                <div className="d-flex flex-column gap-2">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="d-flex align-items-start gap-3 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 36, height: 36, background: a.bg }}
                      >
                        <i className={`bi ${a.icon}`} style={{ fontSize: '.85rem', color: a.color }} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-semibold" style={{ fontSize: '.85rem', color: '#0f172a' }}>{a.title}</span>
                          <span className="fw-bold" style={{ fontSize: '.78rem', color: '#16a34a' }}>{a.pts}</span>
                        </div>
                        <div className="text-secondary mb-1" style={{ fontSize: '.78rem' }}>{a.desc}</div>
                        <div className="text-secondary" style={{ fontSize: '.68rem', letterSpacing: '.05em' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn w-100 mt-3 fw-semibold"
                  style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, fontSize: '.85rem' }}
                >
                  Load More Activity
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}