import { useState, useRef } from 'react'

export default function Setting() {
  const logoRef = useRef(null)

  const [logo,     setLogo]     = useState(null)
  const [company,  setCompany]  = useState({ name: 'CleanCity Metro Operations', email: 'ops@cleancity.metro', zone: 'Greater Metropolitan Area, Central District' })
  const [notifs,   setNotifs]   = useState({ critical: true, daily: true, assignment: false })
  const [password, setPassword] = useState({ current: '••••••••', newPass: '', confirm: '' })
  const [saved,    setSaved]    = useState(false)

  const toggleNotif = (key) => setNotifs(n => ({ ...n, [key]: !n[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 sticky-top" style={{ height: 56, zIndex: 100 }}>
        <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#0f172a' }}>Portal Settings</span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width: 7, height: 7, top: 2, right: 2 }} />
          </button>
          <div className="rounded-circle overflow-hidden border" style={{ width: 32, height: 32 }}>
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold" style={{ background: 'linear-gradient(135deg,#0d6efd,#6f42c1)', fontSize: '.72rem' }}>CP</div>
          </div>
        </div>
      </div>

      <div className="p-4" style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Company Profile ── */}
        <div className="card border shadow-none mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0d6efd" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
              </svg>
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Company Profile</span>
            </div>

            {/* Logo */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="border rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 80, height: 80, background: '#f8f9fa', cursor: 'pointer' }}
                onClick={() => logoRef.current.click()}
              >
                {logo
                  ? <img src={logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                  : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                    </svg>
                }
              </div>
              <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files[0]; if (f) setLogo(URL.createObjectURL(f)) }} />
              <div>
                <div className="fw-semibold mb-1" style={{ fontSize: '.88rem' }}>Company Logo</div>
                <div className="text-secondary mb-2" style={{ fontSize: '.78rem' }}>Upload your company brand asset. Max 2MB, PNG or SVG preferred.</div>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => logoRef.current.click()}>Change Logo</button>
              </div>
            </div>

            {/* Fields */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Company Name</label>
                <input className="form-control" style={{ fontSize: '.87rem' }}
                  value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Contact Email</label>
                <input type="email" className="form-control" style={{ fontSize: '.87rem' }}
                  value={company.email} onChange={e => setCompany(c => ({ ...c, email: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Coverage Zone</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </span>
                <input className="form-control" style={{ fontSize: '.87rem' }}
                  value={company.zone} onChange={e => setCompany(c => ({ ...c, zone: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Notification Preferences ── */}
        <div className="card border shadow-none mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0d6efd" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
              </svg>
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Notification Preferences</span>
            </div>

            {[
              { key: 'critical',   label: 'Email on Critical Reports',    desc: 'Instant alerts for missed pickups or hazardous waste alerts.' },
              { key: 'daily',      label: 'Daily Performance Summary',    desc: 'A consolidated report of route efficiency and team completion rates.' },
              { key: 'assignment', label: 'New Assignment Alerts',        desc: 'Push notifications when new route tasks are assigned to the portal.' },
            ].map((n, i, arr) => (
              <div
                key={n.key}
                className="d-flex align-items-center gap-3 p-3 rounded-3"
                style={{ border: '1px solid #e2e8f0', marginBottom: i < arr.length - 1 ? 10 : 0, cursor: 'pointer', background: '#fff' }}
                onClick={() => toggleNotif(n.key)}
              >
                <input
                  type="checkbox"
                  className="form-check-input flex-shrink-0 mt-0"
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                  checked={notifs[n.key]}
                  onChange={() => toggleNotif(n.key)}
                />
                <div>
                  <div className="fw-semibold" style={{ fontSize: '.88rem', color: '#1e293b' }}>{n.label}</div>
                  <div className="text-secondary" style={{ fontSize: '.78rem' }}>{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Account Security ── */}
        <div className="card border shadow-none mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0d6efd" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Account Security</span>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Current Password</label>
              <input type="password" className="form-control" style={{ fontSize: '.87rem' }}
                value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>New Password</label>
                <input type="password" className="form-control" placeholder="Enter new password" style={{ fontSize: '.87rem' }}
                  value={password.newPass} onChange={e => setPassword(p => ({ ...p, newPass: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Confirm New Password</label>
                <input type="password" className="form-control" placeholder="Re-type new password" style={{ fontSize: '.87rem' }}
                  value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: '#f8f9fa', border: '1px solid #e2e8f0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              <span className="text-secondary" style={{ fontSize: '.78rem' }}>Password must be at least 12 characters and include a mix of symbols and numbers.</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Buttons ── */}
        <div className="d-flex justify-content-end gap-3 pb-4">
          <button className="btn btn-outline-secondary px-4">Discard</button>
          <button className="btn btn-primary fw-bold px-4 d-flex align-items-center gap-2" onClick={handleSave}>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.146-.354l-3-3A.5.5 0 0 0 11.5 1H2zm0 1h9.293L14 4.707V14H2V2zm1 9v1h10v-1H3zm0-2v1h10v-1H3zm0-2v1h6V7H3z"/>
            </svg>
            {saved ? 'Saved ✓' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}