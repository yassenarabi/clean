import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsService } from '../../services/api'

// ── Constants ────────────────────────────────────────
const TABS = ['All Reports', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected']

const TAB_TO_STATUS = {
  'Pending':     'pending',
  'Assigned':    'assigned',
  'In Progress': 'in_progress',
  'Resolved':    'resolved',
  'Rejected':    'rejected',
}

const STATUS_STYLE = {
  pending:     { background: '#64748b', color: '#fff' },
  assigned:    { background: '#2563eb', color: '#fff' },
  in_progress: { background: '#f59e0b', color: '#fff' },
  resolved:    { background: '#16a34a', color: '#fff' },
  rejected:    { background: '#dc2626', color: '#fff' },
}

const SEV_STYLE = {
  critical: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  high:     { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
  medium:   { background: '#dbeafe', color: '#2563eb', border: '1px solid #93c5fd' },
  low:      { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
}

const BADGE_THRESHOLDS = [
  { min: 5000, label: 'Platinum Guardian', icon: 'bi-shield-fill-check', color: '#6366f1' },
  { min: 2000, label: 'Gold Guardian',     icon: 'bi-shield-fill-check', color: '#f59e0b' },
  { min: 500,  label: 'Silver Guardian',   icon: 'bi-shield-fill-check', color: '#94a3b8' },
  { min: 0,    label: 'Community Member',  icon: 'bi-person-check',       color: '#16a34a' },
]

const IMG_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:8000'

function getBadge(points) {
  return BADGE_THRESHOLDS.find(b => (points || 0) >= b.min) || BADGE_THRESHOLDS[3]
}

function getImageUrl(report) {
  if (report.images?.length > 0) {
    return `${IMG_BASE}/storage/${report.images[0].image_path}`
  }
  return null
}

// ── Component ────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate()

  // User from localStorage (set on login)
  const [user] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {} }
    catch { return {} }
  })

  const [reports, setReports]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState('All Reports')

  // summary counts (from full list, fetched once)
  const [summary, setSummary] = useState({ total: 0, resolved: 0, pending: 0 })

  useEffect(() => {
    fetchAllReports()
  }, [])

  const fetchAllReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await reportsService.getMyReports({ per_page: 100 })

      /*
        paginated response shape:
        res.data = { success, message, data: { data: [...], total, ... } }
      */
      const payload = res.data?.data ?? res.data ?? {}
      const items   = payload.data ?? payload ?? []
      const arr     = Array.isArray(items) ? items : []

      setReports(arr)
      setSummary({
        total:    payload.total ?? arr.length,
        resolved: arr.filter(r => r.status === 'resolved').length,
        pending:  arr.filter(r => r.status === 'pending').length,
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  // Filter by tab
  const filtered = reports.filter(r => {
    if (activeTab === 'All Reports') return true
    return r.status === TAB_TO_STATUS[activeTab]
  })

  const badge = getBadge(user.points)

  // ── Loading ────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" />
          <div className="text-secondary" style={{ fontSize: '.88rem' }}>Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────
  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: '60vh', background: '#f8f9fa' }}>
        <div className="text-danger mb-3">⚠️ {error}</div>
        <button className="btn btn-success" onClick={fetchAllReports}>Retry</button>
      </div>
    )
  }

  // ── Main ───────────────────────────────────────────
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* ── User Header ─────────────────────────────── */}
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
                Welcome, {user.name || 'Citizen'}
              </h4>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span
                  className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                  style={{ background: '#dcfce7', color: badge.color, fontSize: '.72rem', fontWeight: 600 }}
                >
                  <i className={`bi ${badge.icon}`} style={{ fontSize: '.7rem' }} />
                  {badge.label}
                </span>
                {user.points != null && (
                  <span className="text-secondary" style={{ fontSize: '.83rem' }}>
                    {Number(user.points).toLocaleString()} Points
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Summary pills */}
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge px-3 py-2 rounded-pill" style={{ background: '#f1f5f9', color: '#334155', fontSize: '.8rem' }}>
              {summary.total} Total
            </span>
            <span className="badge px-3 py-2 rounded-pill" style={{ background: '#dcfce7', color: '#15803d', fontSize: '.8rem' }}>
              {summary.resolved} Resolved
            </span>
            <span className="badge px-3 py-2 rounded-pill" style={{ background: '#fef9c3', color: '#854d0e', fontSize: '.8rem' }}>
              {summary.pending} Pending
            </span>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────── */}
        <div className="d-flex gap-0 mb-4" style={{ borderBottom: '2px solid #e2e8f0', overflowX: 'auto' }}>
          {TABS.map(tab => {
            const statusKey = TAB_TO_STATUS[tab]
            const count = tab === 'All Reports'
              ? reports.length
              : reports.filter(r => r.status === statusKey).length
            return (
              <button
                key={tab}
                className="btn px-3 py-2 fw-semibold flex-shrink-0"
                style={{
                  border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #16a34a' : '2px solid transparent',
                  borderRadius: 0,
                  color: activeTab === tab ? '#15803d' : '#64748b',
                  background: 'none',
                  fontSize: '.85rem',
                  marginBottom: -2,
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {tab !== 'All Reports' && (
                  <span
                    className="ms-1 badge rounded-pill"
                    style={{
                      fontSize: '.62rem',
                      background: activeTab === tab ? '#16a34a' : '#e2e8f0',
                      color: activeTab === tab ? '#fff' : '#64748b',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Report Cards Grid ───────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', opacity: .4 }} />
            <div className="mt-2" style={{ fontSize: '.9rem' }}>No reports found</div>
            {activeTab === 'All Reports' && (
              <button
                className="btn btn-link text-success fw-semibold mt-2 text-decoration-none"
                onClick={() => navigate('/user/report')}
              >
                + Submit your first report
              </button>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(r => {
              const sev    = SEV_STYLE[r.severity]  || SEV_STYLE.low
              const status = STATUS_STYLE[r.status] || STATUS_STYLE.pending
              const imgUrl = getImageUrl(r)

              return (
                <div key={r.id} className="col-12 col-sm-6 col-md-4">
                  <div
                    className="card border shadow-none h-100 overflow-hidden"
                    style={{ borderRadius: 12, cursor: 'pointer', transition: 'box-shadow .15s' }}
                    onClick={() => navigate(`/user/reports/${r.id}`)}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.1)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Image + Status badge */}
                    <div className="position-relative">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={r.title}
                          style={{ width: '100%', height: 160, objectFit: 'cover' }}
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div
                        style={{
                          width: '100%', height: 160,
                          background: '#e2e8f0',
                          display: imgUrl ? 'none' : 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <i className="bi bi-image text-secondary" style={{ fontSize: '2rem', opacity: .4 }} />
                      </div>

                      <span
                        className="position-absolute top-0 end-0 m-2 badge fw-bold rounded-2"
                        style={{ fontSize: '.65rem', letterSpacing: '.04em', ...status }}
                      >
                        {r.status?.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="card-body p-3">
                      {/* Title + Upvotes */}
                      <div className="d-flex align-items-start justify-content-between mb-1">
                        <div className="fw-bold text-truncate" style={{ fontSize: '.95rem', color: '#0f172a' }}>
                          {r.title}
                        </div>
                        <div className="d-flex align-items-center gap-1 text-secondary flex-shrink-0 ms-2" style={{ fontSize: '.78rem' }}>
                          <i className="bi bi-hand-thumbs-up" />
                          <span>{r.upvotes_count || 0}</span>
                        </div>
                      </div>

                      {/* Location + Date */}
                      <div className="d-flex align-items-center gap-1 text-secondary mb-2" style={{ fontSize: '.78rem' }}>
                        <i className="bi bi-geo-alt" />
                        <span className="text-truncate">
                          {r.address || r.city?.name || 'Unknown'} • {new Date(r.created_at).toLocaleDateString('en-EG')}
                        </span>
                      </div>

                      {/* Severity badge */}
                      <span
                        className="badge fw-semibold rounded-pill mb-3 px-2 py-1"
                        style={{ fontSize: '.67rem', ...sev }}
                      >
                        {r.severity?.toUpperCase()} SEVERITY
                      </span>

                      {/* Assigned company */}
                      {r.assigned_company && (
                        <div className="d-flex align-items-center gap-1 text-secondary mb-2" style={{ fontSize: '.75rem' }}>
                          <i className="bi bi-building" />
                          <span className="text-truncate">{r.assigned_company.name}</span>
                        </div>
                      )}

                      {/* View Details button */}
                      <button
                        className="btn w-100 fw-semibold"
                        style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#16a34a', borderRadius: 8, fontSize: '.85rem' }}
                        onClick={e => { e.stopPropagation(); navigate(`/user/reports/${r.id}`) }}
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

        {/* Quick action - submit new */}
        {reports.length > 0 && (
          <div className="text-center mt-5">
            <button
              className="btn fw-semibold px-5 py-2"
              style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.9rem' }}
              onClick={() => navigate('/user/report')}
            >
              <i className="bi bi-plus-lg me-2" />
              Submit New Report
            </button>
          </div>
        )}

      </div>
    </div>
  )
}