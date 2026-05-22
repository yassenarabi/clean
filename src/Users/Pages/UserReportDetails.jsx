import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const REPORT = {
  id:          42,
  title:       'Exposed Wiring',
  severity:    'CRITICAL',
  token:       'CZ-9928-X4',
  description: 'Several electrical wires are exposed at the base of a streetlamp on 26th of July Corridor. This poses a significant safety risk to pedestrians, especially children, and is highly dangerous during rain.',
  category:    'Public Infrastructure',
  city:        'Cairo, Egypt',
  date:        'October 12, 2024',
  impact:      'High Traffic Area',
  upvotes:     142,
  location:    '26th of July St, Zamalek',
  lat:          30.0626,
  lng:          31.2197,
  status:      'IN PROGRESS',
  timeline: [
    { label: 'Pending',     date: 'Oct 12, 10:00 AM', done: true,  active: false },
    { label: 'Assigned',    date: 'Oct 12, 02:30 PM', done: true,  active: false },
    { label: 'In Progress', date: 'Oct 13, 09:15 AM', done: true,  active: true  },
    { label: 'Resolved',    date: 'Estimated: Oct 15',done: false, active: false },
  ],
  beforePhotos: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
  ],
  afterPhotos: [],
}

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
  const report   = REPORT

  const [upvoted,    setUpvoted]    = useState(false)
  const [upvotes,    setUpvotes]    = useState(report.upvotes)
  const [photoTab,   setPhotoTab]   = useState('Before')
  const [lightbox,   setLightbox]   = useState(null)
  const [rating,     setRating]     = useState(0)
  const [hoverRating,setHoverRating]= useState(0)
  const [feedback,   setFeedback]   = useState('')
  const isResolved = report.status === 'RESOLVED'

  const handleUpvote = () => {
    setUpvoted(!upvoted)
    setUpvotes(u => upvoted ? u - 1 : u + 1)
  }

  const photos = photoTab === 'Before' ? report.beforePhotos : report.afterPhotos

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '.85rem' }}>
          <button className="btn btn-link p-0 text-secondary text-decoration-none" onClick={() => navigate('/user/dashboard')}>
            My Reports
          </button>
          <span className="text-secondary">›</span>
          <span style={{ color: '#0f172a' }}>Report #{id || report.id}</span>
        </div>

        {/* ── Status Timeline ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              {report.timeline.map((t, i) => (
                <div key={i} className="d-flex flex-column align-items-center gap-1 flex-grow-1 position-relative">
                  {/* Line */}
                  {i < report.timeline.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 18, left: '60%', right: '-40%',
                      height: 2, background: t.done ? '#16a34a' : '#e2e8f0', zIndex: 0,
                    }} />
                  )}
                  {/* Circle */}
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
                    style={{ background: '#fee2e2', color: '#dc2626', fontSize: '.68rem' }}
                  >{report.severity}</span>
                  <div className="text-end">
                    <div className="text-secondary" style={{ fontSize: '.72rem' }}>Tracking Token</div>
                    <div className="fw-bold" style={{ fontSize: '.85rem', color: '#16a34a', fontFamily: 'monospace' }}>{report.token}</div>
                  </div>
                </div>

                <h4 className="fw-bold mb-3" style={{ fontSize: '1.3rem', color: '#0f172a' }}>{report.title}</h4>
                <p className="text-secondary mb-4" style={{ fontSize: '.87rem', lineHeight: 1.7 }}>{report.description}</p>

                <hr className="my-3" />

                <div className="row g-3">
                  {[
                    { icon: 'bi-grid',        label: 'Category',      value: report.category },
                    { icon: 'bi-geo-alt',      label: 'City',          value: report.city     },
                    { icon: 'bi-calendar3',    label: 'Date Reported', value: report.date     },
                    { icon: 'bi-people',       label: 'Impact Level',  value: report.impact   },
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
                >
                  <i className="bi bi-hand-thumbs-up-fill" />
                  Upvote ({upvotes})
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
                  <span className="fw-bold" style={{ fontSize: '.95rem' }}>Post-Resolution Feedback</span>
                </div>
                {!isResolved && (
                  <p className="text-secondary mb-3" style={{ fontSize: '.82rem' }}>
                    This section will unlock once the issue is marked as 'Resolved'.
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
                    >{tab}</button>
                  ))}
                </div>

                <div className="p-3">
                  {photos.length === 0 ? (
                    <div className="text-center py-4 text-secondary" style={{ fontSize: '.85rem' }}>
                      <i className="bi bi-image" style={{ fontSize: '2rem', opacity: .3 }} />
                      <div className="mt-2">No {photoTab.toLowerCase()} photos yet</div>
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
                    <span className="fw-semibold" style={{ fontSize: '.88rem' }}>{report.location}</span>
                  </div>
                  <button className="btn btn-link p-0 text-decoration-none fw-semibold" style={{ color: '#16a34a', fontSize: '.8rem' }}>
                    OPEN MAPS
                  </button>
                </div>
                <ReportMap lat={report.lat} lng={report.lng} />
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