import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const REPORTS = [
  { id:1, title:'Broken Street Lamp',  location:'Maadi, Cairo',      date:'Oct 12, 2023', severity:'CRITICAL', status:'RESOLVED',    upvotes:24, img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=80&h=80&fit=crop', token:'CZ-9928-X4' },
  { id:2, title:'Pothole Repair',       location:'Heliopolis, Cairo', date:'Oct 14, 2023', severity:'MEDIUM',   status:'IN PROGRESS', upvotes:18, img:'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=80&h=80&fit=crop', token:'CZ-1142-BM' },
  { id:3, title:'Waste Overflow',       location:'Dokki, Giza',       date:'Oct 16, 2023', severity:'LOW',      status:'PENDING',     upvotes:5,  img:'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=80&h=80&fit=crop', token:'CZ-3371-KP' },
  { id:4, title:'Exposed Wiring',       location:'Zamalek, Cairo',    date:'Oct 10, 2023', severity:'CRITICAL', status:'ASSIGNED',    upvotes:42, img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=80&h=80&fit=crop', token:'CZ-7751-XA' },
  { id:5, title:'Flooding on Road',     location:'Maadi, Cairo',      date:'Oct 8, 2023',  severity:'HIGH',     status:'RESOLVED',    upvotes:31, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',  token:'CZ-4412-FL' },
  { id:6, title:'Graffiti on Wall',     location:'Heliopolis, Cairo', date:'Oct 5, 2023',  severity:'LOW',      status:'REJECTED',    upvotes:3,  img:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&h=80&fit=crop', token:'CZ-8823-GR' },
]

const STATUS_STYLE = {
  'RESOLVED':    { bg:'#dcfce7', color:'#16a34a' },
  'IN PROGRESS': { bg:'#fef3c7', color:'#d97706' },
  'PENDING':     { bg:'#f1f5f9', color:'#64748b' },
  'ASSIGNED':    { bg:'#dbeafe', color:'#2563eb' },
  'REJECTED':    { bg:'#fee2e2', color:'#dc2626' },
}

const SEV_STYLE = {
  'CRITICAL': { bg:'#fee2e2', color:'#dc2626' },
  'HIGH':     { bg:'#fef3c7', color:'#d97706' },
  'MEDIUM':   { bg:'#dbeafe', color:'#2563eb' },
  'LOW':      { bg:'#dcfce7', color:'#16a34a' },
}

const TABS = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']

export default function UserMyReports() {
  const navigate   = useNavigate()
  const [tab,      setTab]      = useState('All')
  const [search,   setSearch]   = useState('')
  const [sortBy,   setSortBy]   = useState('newest')

  const filtered = REPORTS
    .filter(r => tab === 'All' || r.status.toLowerCase() === tab.toLowerCase())
    .filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'newest' ? b.id - a.id : sortBy === 'oldest' ? a.id - b.id : b.upvotes - a.upvotes)

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 860 }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0f172a' }}>My Reports</h4>
            <p className="text-secondary mb-0" style={{ fontSize: '.85rem' }}>
              {REPORTS.length} reports submitted • {REPORTS.filter(r => r.status === 'RESOLVED').length} resolved
            </p>
          </div>
          <button
            className="btn fw-semibold px-4 d-flex align-items-center gap-2"
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem' }}
            onClick={() => navigate('/user/report')}
          >
            <i className="bi bi-plus-lg" /> New Report
          </button>
        </div>

        {/* Search + Sort */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <div className="input-group flex-grow-1" style={{ maxWidth: 340 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-secondary" style={{ fontSize: '.82rem' }} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search reports..."
              style={{ fontSize: '.87rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 'auto', fontSize: '.85rem' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="upvotes">Sort: Most Upvoted</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="d-flex gap-0 mb-4" style={{ borderBottom: '2px solid #e2e8f0' }}>
          {TABS.map(t => (
            <button
              key={t}
              className="btn px-3 py-2 fw-semibold"
              style={{
                border: 'none', borderRadius: 0,
                borderBottom: tab === t ? '2px solid #16a34a' : '2px solid transparent',
                color: tab === t ? '#15803d' : '#64748b',
                background: 'none', fontSize: '.85rem', marginBottom: -2,
              }}
              onClick={() => setTab(t)}
            >
              {t}
              {t !== 'All' && (
                <span className="ms-1 badge rounded-pill" style={{ fontSize: '.62rem', background: tab===t?'#16a34a':'#e2e8f0', color: tab===t?'#fff':'#64748b' }}>
                  {REPORTS.filter(r => r.status.toLowerCase() === t.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Reports List */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', opacity: .3 }} />
            <div className="mt-2" style={{ fontSize: '.9rem' }}>No reports found</div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {filtered.map(r => {
              const sev    = SEV_STYLE[r.severity]  || SEV_STYLE.LOW
              const status = STATUS_STYLE[r.status] || STATUS_STYLE.PENDING
              return (
                <div
                  key={r.id}
                  className="card border shadow-none"
                  style={{ borderRadius: 12, cursor: 'pointer', transition: 'box-shadow .15s' }}
                  onClick={() => navigate(`/user/reports/${r.id}`)}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center gap-3">

                      {/* Thumbnail */}
                      <img
                        src={r.img}
                        alt={r.title}
                        className="rounded-2 flex-shrink-0"
                        style={{ width: 64, height: 64, objectFit: 'cover' }}
                      />

                      {/* Info */}
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                          <span className="fw-semibold" style={{ fontSize: '.9rem', color: '#0f172a' }}>{r.title}</span>
                          <span className="badge rounded-pill fw-semibold flex-shrink-0 px-2" style={{ fontSize: '.68rem', background: status.bg, color: status.color }}>
                            {r.status}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-1 text-secondary mb-2" style={{ fontSize: '.78rem' }}>
                          <i className="bi bi-geo-alt" style={{ fontSize: '.72rem' }} />
                          {r.location} • {r.date}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge rounded-pill px-2 py-1" style={{ fontSize: '.65rem', fontWeight: 600, background: sev.bg, color: sev.color }}>
                            {r.severity}
                          </span>
                          <span className="text-secondary d-flex align-items-center gap-1" style={{ fontSize: '.75rem' }}>
                            <i className="bi bi-hand-thumbs-up" /> {r.upvotes}
                          </span>
                          <span className="text-secondary" style={{ fontSize: '.75rem', fontFamily: 'monospace' }}>
                            {r.token}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <i className="bi bi-chevron-right text-secondary flex-shrink-0" style={{ fontSize: '.8rem' }} />

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