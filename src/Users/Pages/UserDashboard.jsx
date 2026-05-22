import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const USER = {
  name:   'Ahmed',
  badge:  'Silver Guardian',
  points: 1250,
  img:    'https://randomuser.me/api/portraits/men/32.jpg',
}

const REPORTS = [
  { id: 1, title: 'Broken Street Lamp', location: 'Maadi, Cairo',     date: 'Oct 12, 2023', severity: 'CRITICAL SEVERITY', status: 'RESOLVED',    upvotes: 24, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop' },
  { id: 2, title: 'Pothole Repair',     location: 'Heliopolis, Cairo', date: 'Oct 14, 2023', severity: 'MEDIUM SEVERITY',   status: 'IN PROGRESS', upvotes: 18, img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=220&fit=crop' },
  { id: 3, title: 'Waste Overflow',     location: 'Dokki, Giza',       date: 'Oct 16, 2023', severity: 'LOW SEVERITY',      status: 'PENDING',     upvotes: 5,  img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=220&fit=crop' },
  { id: 4, title: 'Exposed Wiring',     location: 'Zamalek, Cairo',    date: 'Oct 10, 2023', severity: 'CRITICAL SEVERITY', status: 'ASSIGNED',    upvotes: 42, img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=220&fit=crop' },
]

const TABS = ['All Reports', 'Pending', 'In Progress', 'Resolved', 'Rejected']

const STATUS_STYLE = {
  'RESOLVED':    { background: '#16a34a', color: '#fff' },
  'IN PROGRESS': { background: '#f59e0b', color: '#fff' },
  'PENDING':     { background: '#64748b', color: '#fff' },
  'ASSIGNED':    { background: '#2563eb', color: '#fff' },
  'REJECTED':    { background: '#dc2626', color: '#fff' },
}

const SEV_STYLE = {
  'CRITICAL SEVERITY': { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  'MEDIUM SEVERITY':   { background: '#dbeafe', color: '#2563eb', border: '1px solid #93c5fd' },
  'LOW SEVERITY':      { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
  'HIGH SEVERITY':     { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
}

export default function UserDashboard() {
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState('All Reports')

  const filtered = REPORTS.filter(r => {
    if (activeTab === 'All Reports') return true
    return r.status.toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* ── User Header ── */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* Avatar */}
            <div
              className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 64, height: 64, background: '#16a34a' }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: '1.8rem' }} />
            </div>
            <div>
              <h4 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#0f172a' }}>
                Welcome, {USER.name}
              </h4>
              <div className="d-flex align-items-center gap-2">
                <span
                  className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                  style={{ background: '#dcfce7', color: '#15803d', fontSize: '.72rem', fontWeight: 600 }}
                >
                  <i className="bi bi-shield-fill-check" style={{ fontSize: '.7rem' }} />
                  {USER.badge}
                </span>
                <span className="text-secondary" style={{ fontSize: '.83rem' }}>{USER.points.toLocaleString()} Points</span>
              </div>
            </div>
          </div>

          {/* Share Stats */}
          <button
            className="btn d-flex align-items-center gap-2 fw-semibold"
            style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 8, fontSize: '.85rem' }}
          >
            <i className="bi bi-share" />
            Share Stats
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="d-flex gap-0 mb-4" style={{ borderBottom: '2px solid #e2e8f0' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              className="btn px-3 py-2 fw-semibold"
              style={{
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #16a34a' : '2px solid transparent',
                borderRadius: 0,
                color: activeTab === tab ? '#15803d' : '#64748b',
                background: 'none',
                fontSize: '.85rem',
                marginBottom: -2,
                transition: 'all .15s',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Report Cards Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', opacity: .4 }} />
            <div className="mt-2" style={{ fontSize: '.9rem' }}>No reports found</div>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(r => {
              const sev    = SEV_STYLE[r.severity]  || SEV_STYLE['LOW SEVERITY']
              const status = STATUS_STYLE[r.status] || STATUS_STYLE['PENDING']
              return (
                <div key={r.id} className="col-12 col-sm-6 col-md-4">
                  <div className="card border shadow-none h-100 overflow-hidden" style={{ borderRadius: 12 }}>

                    {/* Image + Status badge */}
                    <div className="position-relative">
                      <img
                        src={r.img}
                        alt={r.title}
                        style={{ width: '100%', height: 160, objectFit: 'cover' }}
                      />
                      <span
                        className="position-absolute top-0 end-0 m-2 badge fw-bold rounded-2"
                        style={{ fontSize: '.65rem', letterSpacing: '.04em', ...status }}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="card-body p-3">
                      {/* Title + Upvotes */}
                      <div className="d-flex align-items-start justify-content-between mb-1">
                        <div className="fw-bold" style={{ fontSize: '.95rem', color: '#0f172a' }}>{r.title}</div>
                        <div className="d-flex align-items-center gap-1 text-secondary flex-shrink-0 ms-2" style={{ fontSize: '.78rem' }}>
                          <i className="bi bi-hand-thumbs-up" />
                          <span>{r.upvotes}</span>
                        </div>
                      </div>

                      {/* Location + Date */}
                      <div className="d-flex align-items-center gap-1 text-secondary mb-2" style={{ fontSize: '.78rem' }}>
                        <i className="bi bi-geo-alt" />
                        <span>{r.location} • {r.date}</span>
                      </div>

                      {/* Severity badge */}
                      <span
                        className="badge fw-semibold rounded-pill mb-3 px-2 py-1"
                        style={{ fontSize: '.67rem', ...sev }}
                      >
                        {r.severity}
                      </span>

                      {/* View Details */}
                      <button
                        className="btn w-100 fw-semibold"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#16a34a', borderRadius: 8, fontSize: '.85rem' }}
                        onClick={() => navigate(`/user/reports/${r.id}`)}
                      >
                        View Details
                      </button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}