import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { reportsService } from './../../services/api.js'

// ── Leaflet Map ──
function ReportMap({ lat, lng }) {
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)

  useEffect(() => {
    const init = () => {
      if (!mapRef.current || mapObjRef.current) return
      const L   = window.L
      const map = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 15)
      mapObjRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:#16a34a;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      })
      L.marker([lat, lng], { icon }).addTo(map)
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (!window.L) {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      s.onload = init; document.head.appendChild(s)
    } else { init() }

    return () => { if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
  }, [lat, lng])

  return <div ref={mapRef} className="rounded-3 overflow-hidden" style={{ height: 180, width: '100%' }} />
}

export default function UserReportDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [report,       setReport]       = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [upvoted,      setUpvoted]      = useState(false)
  const [upvotes,      setUpvotes]      = useState(0)
  const [photoTab,     setPhotoTab]     = useState('Before')
  const [lightbox,     setLightbox]     = useState(null)
  const [rating,       setRating]       = useState(0)
  const [hoverRating,  setHoverRating]  = useState(0)
  const [feedback,     setFeedback]     = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [ratingSubmit,  setRatingSubmit] = useState(false)

  // ── Fetch Report Data ──
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await reportsService.getById(id)
        const data = response.data.data
        setReport(data)
        setUpvotes(data.upvotes_count || 0)
        setUpvoted(data.user_has_upvoted || false)
        if (data.rating) {
          setRating(data.rating.rating || 0)
          setFeedback(data.rating.comment || '')
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Report not found')
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view this report')
        } else {
          setError(err.response?.data?.message || 'Failed to load report details')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  const isResolved = report?.status === 'resolved'

  // ── Handle Upvote ──
  const handleUpvote = async () => {
    try {
      setSubmitting(true)
      await reportsService.upvote(id)
      setUpvoted(!upvoted)
      setUpvotes(u => upvoted ? u - 1 : u + 1)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upvote')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Handle Rating ──
  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    try {
      setRatingSubmit(true)
      await reportsService.rate(id, { rating, comment: feedback })
      alert('Rating submitted successfully')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rating')
    } finally {
      setRatingSubmit(false)
    }
  }

  // ── Helpers ──
  const getStatusColor = (status) => {
    const colors = {
      pending:     '#f59e0b',
      assigned:    '#3b82f6',
      in_progress: '#8b5cf6',
      resolved:    '#10b981',
      rejected:    '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending:     'Pending',
      assigned:    'Assigned',
      in_progress: 'In Progress',
      resolved:    'Resolved',
      rejected:    'Rejected'
    }
    return labels[status] || status
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low:      '#3b82f6',
      medium:   '#f59e0b',
      high:     '#f97316',
      critical: '#dc2626'
    }
    return colors[severity] || '#6b7280'
  }

  const getSeverityLabel = (severity) => {
    const labels = {
      low:      'Low',
      medium:   'Medium',
      high:     'High',
      critical: 'Critical'
    }
    return labels[severity] || severity
  }

  const buildTimeline = () => {
    if (!report) return []
    const history = report.status_history || []
    const steps = ['pending', 'assigned', 'in_progress', 'resolved']
    return steps.map((step, i) => {
      const histItem = history.find(h => h.status === step)
      const done = histItem !== undefined || 
        (step === 'pending' && report.created_at) ||
        (step === 'resolved' && report.status === 'resolved')
      const active = report.status === step
      return {
        label: getStatusLabel(step),
        date: histItem ? new Date(histItem.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
             : step === 'resolved' && !done ? 'Expected soon' 
             : '',
        done,
        active
      }
    })
  }

  const getPhotos = () => {
    if (!report?.images) return []
    return report.images
      .filter(img => img.type === (photoTab === 'Before' ? 'before' : 'after'))
      .map(img => `http://127.0.0.1:8000/storage/${img.image_path}`)
  }

  const photos = getPhotos()
  const timeline = buildTimeline()

  if (loading) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status" />
        <p className="text-secondary">Loading...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }} />
        <h4 className="mt-3 text-danger">{error}</h4>
        <button className="btn btn-success mt-3" onClick={() => navigate('/user/my-reports')}>
          Back to My Reports
        </button>
      </div>
    </div>
  )

  if (!report) return null

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '.85rem' }}>
          <button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => navigate('/user/my-reports')}>
            My Reports
          </button>
          <span className="text-secondary">›</span>
          <span style={{ color: '#0f172a' }}>Report #{id || report.id}</span>
        </div>

        {/* ── Status Timeline ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              {timeline.map((t, i) => (
                <div key={i} className="d-flex flex-column align-items-center gap-1 flex-grow-1 position-relative">
                  {i < timeline.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 18, left: '60%', right: '-40%',
                      height: 2, background: t.done ? '#16a34a' : '#e2e8f0', zIndex: 0,
                    }} />
                  )}
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 36, height: 36, zIndex: 1,
                      background: t.done ? '#16a34a' : '#f1f5f9',
                      border: t.active ? '3px solid #16a34a' : t.done ? 'none' : '2px solid #cbd5e1',
                    }}
                  >
                    {t.done
                      ? <i className="bi bi-check-lg text-white" style={{ fontSize: '.9rem' }} />
                      : <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1' }} />
                    }
                  </div>
                  <div className="fw-semibold text-center" style={{ fontSize: '.82rem', color: t.done ? '#0f172a' : '#94a3b8' }}>{t.label}</div>
                  <div className="text-center text-secondary" style={{ fontSize: '.7rem' }}>{t.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row g-3">

          {/* ── LEFT ── */}
          <div className="col-lg-6">

            {/* Report Info */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <span
                    className="badge fw-bold rounded-2 px-2 py-1"
                    style={{ background: getSeverityColor(report.severity) + '20', color: getSeverityColor(report.severity), fontSize: '.68rem' }}
                  >{getSeverityLabel(report.severity).toUpperCase()}</span>
                  <div className="text-end">
                    <div className="text-secondary" style={{ fontSize: '.72rem' }}>Tracking Code</div>
                    <div className="fw-bold" style={{ fontSize: '.85rem', color: '#16a34a', fontFamily: 'monospace' }}>{report.tracking_token}</div>
                  </div>
                </div>

                <h4 className="fw-bold mb-3" style={{ fontSize: '1.3rem', color: '#0f172a' }}>{report.title}</h4>
                <p className="text-secondary mb-4" style={{ fontSize: '.87rem', lineHeight: 1.7 }}>{report.description}</p>

                <hr className="my-3" />

                <div className="row g-3">
                  {[
                    { icon: 'bi-grid',        label: 'Category',      value: report.category?.name || report.category },
                    { icon: 'bi-geo-alt',      label: 'City',          value: report.city?.name || report.city },
                    { icon: 'bi-calendar3',    label: 'Report Date',   value: new Date(report.created_at).toLocaleDateString('en-US') },
                    { icon: 'bi-people',       label: 'Address',       value: report.address || 'Not specified' },
                  ].map((f, i) => (
                    <div key={i} className="col-6">
                      <div className="text-secondary mb-1" style={{ fontSize: '.72rem', fontWeight: 600 }}>{f.label}</div>
                      <div className="d-flex align-items-center gap-1" style={{ fontSize: '.85rem', color: '#334155' }}>
                        <i className={`bi ${f.icon} text-success`} style={{ fontSize: '.8rem' }} />
                        {f.value}
                      </div>
                    </div>
                  ))}
                </div>

                {report.assigned_company && (
                  <>
                    <hr className="my-3" />
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-building text-success" />
                      <span className="fw-semibold" style={{ fontSize: '.85rem' }}>Assigned Company:</span>
                      <span style={{ fontSize: '.85rem', color: '#334155' }}>{report.assigned_company.name}</span>
                    </div>
                  </>
                )}

                {report.rejection_reason && (
                  <>
                    <hr className="my-3" />
                    <div className="alert alert-danger" style={{ fontSize: '.82rem' }}>
                      <i className="bi bi-exclamation-triangle me-2" />
                      <strong>Rejection Reason:</strong> {report.rejection_reason}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upvote */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <button
                  className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    background: upvoted ? '#16a34a' : '#dcfce7',
                    color: upvoted ? '#fff' : '#16a34a',
                    border: 'none', borderRadius: 8, fontSize: '.88rem',
                  }}
                  onClick={handleUpvote}
                  disabled={submitting}
                >
                  <i className="bi bi-hand-thumbs-up-fill" />
                  {submitting ? 'Loading...' : `Upvote (${upvotes})`}
                </button>
                <button className="btn btn-link text-decoration-none fw-semibold" style={{ color: '#16a34a', fontSize: '.85rem' }}>
                  Support this report
                </button>
              </div>
            </div>

            {/* Post-Resolution Feedback */}
            <div
              className="card shadow-none mb-3"
              style={{ border: isResolved ? '1px solid #e2e8f0' : '1.5px dashed #cbd5e1', opacity: isResolved ? 1 : .7 }}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-lock-fill text-secondary" style={{ fontSize: '.9rem' }} />
                  <span className="fw-bold" style={{ fontSize: '.95rem' }}>Rate the Resolution</span>
                </div>
                {!isResolved && (
                  <p className="text-secondary mb-3" style={{ fontSize: '.82rem' }}>
                    This section will unlock once the report is resolved.
                  </p>
                )}

                {/* Stars */}
                <div className="d-flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => (
                    <i
                      key={s}
                      className={`bi ${(hoverRating || rating) >= s ? 'bi-star-fill' : 'bi-star'}`}
                      style={{ fontSize: '1.3rem', color: (hoverRating || rating) >= s ? '#f59e0b' : '#cbd5e1', cursor: isResolved ? 'pointer' : 'default' }}
                      onMouseEnter={() => isResolved && setHoverRating(s)}
                      onMouseLeave={() => isResolved && setHoverRating(0)}
                      onClick={() => isResolved && setRating(s)}
                    />
                  ))}
                </div>

                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Share your feedback..."
                  style={{ fontSize: '.85rem', resize: 'none', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                  disabled={!isResolved}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />

                {isResolved && (
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn fw-bold px-4"
                      style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem' }}
                      onClick={handleSubmitRating}
                      disabled={ratingSubmit}
                    >
                      {ratingSubmit ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── RIGHT ── */}
          <div className="col-lg-6">

            {/* Before / After Photos */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-0">
                {/* Tabs */}
                <div className="d-flex border-bottom">
                  {['Before', 'After'].map(tab => (
                    <button
                      key={tab}
                      className="btn flex-grow-1 fw-semibold py-2"
                      style={{
                        border: 'none', borderRadius: 0,
                        borderBottom: photoTab === tab ? '2px solid #16a34a' : '2px solid transparent',
                        color: photoTab === tab ? '#16a34a' : '#64748b',
                        background: 'none', fontSize: '.88rem',
                      }}
                      onClick={() => setPhotoTab(tab)}
                    >{tab === 'Before' ? 'Before' : 'After'}</button>
                  ))}
                </div>

                <div className="p-3">
                  {photos.length === 0 ? (
                    <div className="text-center py-4 text-secondary" style={{ fontSize: '.85rem' }}>
                      <i className="bi bi-image" style={{ fontSize: '2rem', opacity: .3 }} />
                      <div className="mt-2">No {photoTab === 'Before' ? 'before' : 'after'} photos yet</div>
                    </div>
                  ) : (
                    <>
                      {/* Main photo */}
                      <img
                        src={photos[0]}
                        alt="main"
                        className="rounded-3 w-100 mb-2"
                        style={{ height: 220, objectFit: 'cover', cursor: 'zoom-in' }}
                        onClick={() => setLightbox(photos[0])}
                      />
                      {/* Thumbnails */}
                      <div className="d-flex gap-2">
                        {photos.slice(1, 3).map((p, i) => (
                          <img key={i} src={p} alt="" className="rounded-2 flex-grow-1"
                            style={{ height: 70, objectFit: 'cover', cursor: 'zoom-in', width: '30%' }}
                            onClick={() => setLightbox(p)} />
                        ))}
                        {photos.length > 3 && (
                          <div
                            className="rounded-2 d-flex align-items-center justify-content-center fw-bold text-secondary"
                            style={{ height: 70, width: '30%', background: '#f1f5f9', fontSize: '.9rem', cursor: 'pointer', flexShrink: 0 }}
                            onClick={() => setLightbox(photos[3])}
                          >+{photos.length - 3}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-1">
                    <i className="bi bi-geo-alt-fill text-success" />
                    <span className="fw-semibold" style={{ fontSize: '.88rem' }}>{report.address || report.city?.name || 'Location'}</span>
                  </div>
                  <a 
                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-link p-0 text-decoration-none fw-semibold"
                    style={{ color: '#16a34a', fontSize: '.8rem' }}
                  >
                    Open Map
                  </a>
                </div>
                <ReportMap lat={report.latitude || 30.0626} lng={report.longitude || 31.2197} />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="position-fixed d-flex align-items-center justify-content-center"
          style={{ inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, cursor: 'zoom-out' }}
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="rounded-3"
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()} />
          <button className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle fw-bold"
            style={{ width: 36, height: 36, padding: 0 }}
            onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}

    </div>
  )
}