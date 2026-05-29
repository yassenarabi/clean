import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsService } from '../../services/api'

const STATUS_STYLE = {
  resolved:    { bg: '#dcfce7', color: '#16a34a' },
  in_progress: { bg: '#fef3c7', color: '#d97706' },
  pending:     { bg: '#f1f5f9', color: '#64748b' },
  assigned:    { bg: '#dbeafe', color: '#2563eb' },
  rejected:    { bg: '#fee2e2', color: '#dc2626' },
}

const SEV_STYLE = {
  critical: { bg: '#fee2e2', color: '#dc2626' },
  high:     { bg: '#fef3c7', color: '#d97706' },
  medium:   { bg: '#dbeafe', color: '#2563eb' },
  low:      { bg: '#dcfce7', color: '#16a34a' },
}

const TABS = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected']

// map tab label → API status value
const TAB_TO_STATUS = {
  'Pending':     'pending',
  'Assigned':    'assigned',
  'In Progress': 'in_progress',
  'Resolved':    'resolved',
  'Rejected':    'rejected',
}

const IMG_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')
  : 'http://localhost:8000'

export default function UserMyReports() {
  const navigate = useNavigate()

  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [tab, setTab]           = useState('All')
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState('newest')

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage]       = useState(1)
  const [total, setTotal]             = useState(0)

  useEffect(() => {
    fetchReports(1)
  }, [])

  // re-fetch when tab changes (server-side filtering is faster for large datasets)
  useEffect(() => {
    fetchReports(1)
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const fetchReports = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, per_page: 20 }
      if (tab !== 'All') params.status = TAB_TO_STATUS[tab]

      const res = await reportsService.getMyReports(params)



      
      /*
        الـ backend بيرجع paginated response:
        {
          success: true,
          message: "...",
          data: {
            data: [...reports],   ← الـ array الفعلي
            current_page: 1,
            last_page: 3,
            total: 45,
            ...
          }
        }
      */
      const payload = res.data?.data ?? res.data ?? {}
      const items   = payload.data ?? payload ?? []

      setReports(Array.isArray(items) ? items : [])
      setCurrentPage(payload.current_page ?? 1)
      setLastPage(payload.last_page ?? 1)
      setTotal(payload.total ?? (Array.isArray(items) ? items.length : 0))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchReports(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  }

  const getImageUrl = (report) => {
    if (report.images?.length > 0) {
      return `${IMG_BASE}/storage/${report.images[0].image_path}`
    }
    return 'https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image'
  }

  // client-side search + sort (works on the current page)
  const filtered = reports
    .filter(r => {
      const q = search.toLowerCase()
      return !q ||
        (r.title   || '').toLowerCase().includes(q) ||
        (r.address || '').toLowerCase().includes(q) ||
        (r.city?.name || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'newest')  return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'oldest')  return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === 'upvotes') return (b.upvotes_count || 0) - (a.upvotes_count || 0)
      return 0
    })

  const resolvedCount = tab === 'All'
    ? reports.filter(r => r.status === 'resolved').length
    : tab === 'Resolved' ? reports.length : 0

  // ── Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" />
          <div className="text-secondary" style={{ fontSize: '.88rem' }}>Loading your reports...</div>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────
  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: '60vh', background: '#f8f9fa' }}>
        <div className="text-danger mb-3">⚠️ {error}</div>
        <button className="btn btn-success" onClick={() => fetchReports(1)}>Retry</button>
      </div>
    )
  }

  // ── Main ─────────────────────────────────────────────
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 860 }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h4 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0f172a' }}>My Reports</h4>
            <p className="text-secondary mb-0" style={{ fontSize: '.85rem' }}>
              {total} report{total !== 1 ? 's' : ''} submitted • {resolvedCount} resolved this page
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
              placeholder="Search by title or address..."
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
        <div className="d-flex gap-0 mb-4" style={{ borderBottom: '2px solid #e2e8f0', overflowX: 'auto' }}>
          {TABS.map(t => {
            const statusKey = TAB_TO_STATUS[t]
            const count = t === 'All'
              ? total
              : reports.filter(r => r.status === statusKey).length
            return (
              <button
                key={t}
                className="btn px-3 py-2 fw-semibold flex-shrink-0"
                style={{
                  border: 'none', borderRadius: 0,
                  borderBottom: tab === t ? '2px solid #16a34a' : '2px solid transparent',
                  color: tab === t ? '#15803d' : '#64748b',
                  background: 'none', fontSize: '.85rem', marginBottom: -2,
                }}
                onClick={() => setTab(t)}
              >
                {t}
                <span
                  className="ms-1 badge rounded-pill"
                  style={{
                    fontSize: '.62rem',
                    background: tab === t ? '#16a34a' : '#e2e8f0',
                    color: tab === t ? '#fff' : '#64748b',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Report list */}
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-inbox" style={{ fontSize: '2.5rem', opacity: .3 }} />
            <div className="mt-2" style={{ fontSize: '.9rem' }}>No reports found</div>
            <button
              className="btn btn-link text-success fw-semibold mt-2 text-decoration-none"
              onClick={() => navigate('/user/report')}
            >
              + Submit your first report
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {filtered.map(r => {
              const sev    = SEV_STYLE[r.severity]  || SEV_STYLE.low
              const status = STATUS_STYLE[r.status] || STATUS_STYLE.pending
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
                        src={getImageUrl(r)}
                        alt={r.title}
                        className="rounded-2 flex-shrink-0"
                        style={{ width: 64, height: 64, objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/80x80/e2e8f0/94a3b8?text=No+Image' }}
                      />

                      <div className="flex-grow-1 min-width-0">
                        {/* Title + Status */}
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                          <span className="fw-semibold text-truncate" style={{ fontSize: '.9rem', color: '#0f172a' }}>
                            {r.title}
                          </span>
                          <span
                            className="badge rounded-pill fw-semibold flex-shrink-0 px-2"
                            style={{ fontSize: '.68rem', background: status.bg, color: status.color }}
                          >
                            {r.status?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Location + Date */}
                        <div className="d-flex align-items-center gap-1 text-secondary mb-2" style={{ fontSize: '.78rem' }}>
                          <i className="bi bi-geo-alt" style={{ fontSize: '.72rem' }} />
                          {r.address || r.city?.name || 'Unknown'} • {new Date(r.created_at).toLocaleDateString('en-EG')}
                        </div>

                        {/* Severity + Upvotes + Token */}
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span
                            className="badge rounded-pill px-2 py-1"
                            style={{ fontSize: '.65rem', fontWeight: 600, background: sev.bg, color: sev.color }}
                          >
                            {r.severity}
                          </span>
                          <span className="text-secondary d-flex align-items-center gap-1" style={{ fontSize: '.75rem' }}>
                            <i className="bi bi-hand-thumbs-up" /> {r.upvotes_count || 0}
                          </span>
                          {r.tracking_token && (
                            <span className="text-secondary" style={{ fontSize: '.73rem', fontFamily: 'monospace' }}>
                              #{r.tracking_token}
                            </span>
                          )}
                          {/* Assigned company name */}
                          {r.assigned_company && (
                            <span className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '.73rem' }}>
                              <i className="bi bi-building" style={{ fontSize: '.68rem' }} />
                              {r.assigned_company.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <i className="bi bi-chevron-right text-secondary flex-shrink-0" style={{ fontSize: '.8rem' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-sm border"
              style={{ fontSize: '.83rem', borderRadius: 8 }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <i className="bi bi-chevron-left" />
            </button>

            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter(p => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...'
                  ? <span key={`ellipsis-${i}`} className="px-1 text-secondary" style={{ fontSize: '.83rem' }}>…</span>
                  : (
                    <button
                      key={p}
                      className="btn btn-sm"
                      style={{
                        fontSize: '.83rem', borderRadius: 8, minWidth: 32,
                        background: currentPage === p ? '#16a34a' : 'transparent',
                        color: currentPage === p ? '#fff' : '#334155',
                        border: currentPage === p ? 'none' : '1px solid #e2e8f0',
                      }}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  )
              )
            }

            <button
              className="btn btn-sm border"
              style={{ fontSize: '.83rem', borderRadius: 8 }}
              disabled={currentPage === lastPage}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}