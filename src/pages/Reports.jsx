// src/pages/Reports.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyService } from '../services/api'

const SEV_STYLE = {
  critical: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  high:     { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
  medium:   { background: '#dbeafe', color: '#2563eb', border: '1px solid #93c5fd' },
  low:      { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
}

const STATUS_STYLE = {
  pending:     { background: '#f1f5f9', color: '#64748b' },
  assigned:    { background: '#dbeafe', color: '#2563eb' },
  in_progress: { background: '#fef3c7', color: '#d97706' },
  resolved:    { background: '#dcfce7', color: '#16a34a' },
  rejected:    { background: '#fee2e2', color: '#dc2626' },
}

export default function AssignedReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sevFilter, setSevFilter] = useState('All')
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })

  // Fetch reports from API
  useEffect(() => {
    fetchReports()
  }, [])

 // في fetchReports:
const fetchReports = async (params = {}) => {
  setLoading(true)
  try {
    const res = await companyService.getMyReports(params)
    // ✅ res.data = { success: true, data: { data: [...], current_page: 1, ... } }
    const responseData = res.data.data || res.data
    
    setReports(responseData.data || [])
    setPagination({
      current_page: responseData.current_page || 1,
      last_page: responseData.last_page || 1,
      total: responseData.total || 0,
    })
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load reports')
  } finally {
    setLoading(false)
  }
}

  const allSelected = reports.length > 0 && selected.length === reports.length
  const toggleAll = () => setSelected(allSelected ? [] : reports.map(r => r.id))
  const toggleOne = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const filtered = reports.filter(r => {
    const matchSearch = (r.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
                        (r.address?.toLowerCase() || '').includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase().replace(' ', '_')
    const matchSev = sevFilter === 'All' || r.severity === sevFilter.toLowerCase()
    return matchSearch && matchStatus && matchSev
  })

  const getImageUrl = (report) => {
    if (report.images && report.images.length > 0) {
      return `http://localhost:8000/storage/${report.images[0].image_path}`
    }
    return 'https://placehold.co/60x60/e2e8f0/94a3b8?text=No+Image'
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <div className="text-secondary">Loading reports...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="text-danger mb-2">⚠️ {error}</div>
          <button className="btn btn-primary btn-sm" onClick={fetchReports}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-3 sticky-top" style={{ height: 52 }}>
        <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>Assigned Reports</span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width: 7, height: 7, top: 2, right: 2 }} />
          </button>
          <div className="d-flex align-items-center gap-2 bg-light border rounded-pill" style={{ padding: '3px 12px 3px 3px' }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: 30, height: 30, fontSize: '.68rem', background: 'linear-gradient(135deg,#0d6efd,#6f42c1)' }}>AP</div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="fw-semibold" style={{ fontSize: '.8rem' }}>Admin Panel</div>
              <div className="text-secondary" style={{ fontSize: '.65rem' }}>Operations Lead</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        {/* Search + Filters */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <div className="input-group" style={{ maxWidth: 280 }}>
                <span className="input-group-text bg-white border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                  </svg>
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search by title or address"
                  value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: '.85rem' }} />
              </div>
              <select className="form-select" style={{ width: 'auto', fontSize: '.85rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">Status: All</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="form-select" style={{ width: 'auto', fontSize: '.85rem' }} value={sevFilter} onChange={e => setSevFilter(e.target.value)}>
                <option value="All">Severity: All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <div className="d-flex align-items-center gap-2">
                {selected.length > 0 && (
                  <>
                    <span className="text-secondary" style={{ fontSize: '.83rem' }}>{selected.length} reports selected</span>
                    <button className="btn btn-primary btn-sm fw-semibold px-3" style={{ fontSize: '.82rem' }}>▶ Mark as In Progress</button>
                  </>
                )}
              </div>
              <span className="text-secondary" style={{ fontSize: '.78rem' }}>Total: {pagination.total} reports</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border shadow-none">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 40 }}>
                      <input type="checkbox" className="form-check-input" checked={allSelected} onChange={toggleAll} />
                    </th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Thumbnail</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Report Title</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Address</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Severity</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Status</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Upvotes</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Date</th>
                    <th className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-4 text-secondary">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const sev = SEV_STYLE[r.severity] || SEV_STYLE.low
                      const status = STATUS_STYLE[r.status] || STATUS_STYLE.pending
                      const isChecked = selected.includes(r.id)
                      return (
                        <tr key={r.id} className={isChecked ? 'table-primary' : ''}>
                          <td><input type="checkbox" className="form-check-input" checked={isChecked} onChange={() => toggleOne(r.id)} /></td>
                          <td>
                            <img src={getImageUrl(r)} alt={r.title} className="rounded-2" style={{ width: 52, height: 52, objectFit: 'cover' }} />
                          </td>
                          <td className="fw-semibold" style={{ fontSize: '.87rem', color: '#1e293b' }}>{r.title}</td>
                          <td className="text-secondary" style={{ fontSize: '.83rem' }}>{r.address || 'N/A'}</td>
                          <td>
                            <span className="fw-bold px-2 py-1 rounded-2" style={{ fontSize: '.65rem', letterSpacing: '.04em', textTransform: 'uppercase', ...sev }}>{r.severity}</span>
                          </td>
                          <td>
                            <span className="fw-semibold px-2 py-1 rounded-2" style={{ fontSize: '.72rem', textTransform: 'capitalize', ...status }}>{r.status?.replace('_', ' ')}</span>
                          </td>
                          <td className="fw-semibold" style={{ fontSize: '.87rem', color: '#334155' }}>{r.upvotes_count || 0}</td>
                          <td className="text-secondary" style={{ fontSize: '.83rem' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm fw-semibold"
                                style={{ fontSize: '.75rem', whiteSpace: 'nowrap' }}
                                onClick={() => navigate(`/company/reports/${r.id}`)}
                              >Update Status</button>
                              <button
                                className="btn btn-light btn-sm border"
                                onClick={() => navigate(`/company/reports/${r.id}`)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#64748b" viewBox="0 0 16 16">
                                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="card-footer bg-white border-top d-flex align-items-center justify-content-between px-3 py-2">
            <span className="text-secondary" style={{ fontSize: '.82rem' }}>
              Showing {filtered.length} of {pagination.total} reports
            </span>
            <nav>
              <ul className="pagination pagination-sm mb-0 gap-1">
                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link border rounded" onClick={() => fetchReports({ page: pagination.current_page - 1 })}>‹</button>
                </li>
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                  <li key={p} className={`page-item ${p === pagination.current_page ? 'active' : ''}`}>
                    <button className="page-link border rounded" onClick={() => fetchReports({ page: p })}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                  <button className="page-link border rounded" onClick={() => fetchReports({ page: pagination.current_page + 1 })}>›</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}