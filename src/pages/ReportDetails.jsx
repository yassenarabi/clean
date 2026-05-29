// src/pages/ReportDetails.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { reportsService } from '../services/api'

const SEV_STYLE = {
  critical: { background: '#fee2e2', color: '#dc2626' },
  high:     { background: '#fef3c7', color: '#d97706' },
  medium:   { background: '#dbeafe', color: '#2563eb' },
  low:      { background: '#dcfce7', color: '#16a34a' },
}

const STATUS_STYLE = {
  pending:     { background: '#f1f5f9', color: '#64748b' },
  assigned:    { background: '#dbeafe', color: '#2563eb' },
  in_progress: { background: '#dcfce7', color: '#16a34a' },
  resolved:    { background: '#f1f5f9', color: '#64748b' },
  rejected:    { background: '#fee2e2', color: '#dc2626' },
}

const STATUS_OPTIONS = [
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
]

function LeafletMap({ lat, lng }) {
  const mapRef = useRef(null)
  const mapInitRef = useRef(false)

  useEffect(() => {
    if (mapInitRef.current || !lat || !lng) return
    mapInitRef.current = true

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const initMap = () => {
      if (!mapRef.current) return
      const map = window.L.map(mapRef.current).setView([parseFloat(lat), parseFloat(lng)], 15)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      const icon = window.L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:#dc3545;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      })
      window.L.marker([parseFloat(lat), parseFloat(lng)], { icon }).addTo(map)
    }

    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      if (mapRef.current && mapRef.current._leaflet_id) {
        window.L.map(mapRef.current).remove()
      }
    }
  }, [lat, lng])

  return <div ref={mapRef} className="rounded-3 overflow-hidden" style={{ height: 220, width: '100%', zIndex: 1 }} />
}

export default function ReportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [uploadedPhotoFile, setUploadedPhotoFile] = useState(null)
  const [lightboxImg, setLightboxImg] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Fetch report details
  useEffect(() => {
    fetchReport()
  }, [id])

 // في fetchReport:
const fetchReport = async () => {
  setLoading(true)
  setError(null)
  try {
    const res = await reportsService.getById(id)
    // ✅ res.data = { success: true, data: { ... } }
    const data = res.data.data || res.data
    setReport(data)
    setStatus(data.status || 'assigned')
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load report')
  } finally {
    setLoading(false)
  }
}

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedPhoto(URL.createObjectURL(file))
      setUploadedPhotoFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploadedPhoto(URL.createObjectURL(file))
      setUploadedPhotoFile(file)
    }
  }

  const handleUpdateStatus = async () => {
    setUpdateLoading(true)
    setUpdateError(null)
    setUpdateSuccess(false)

    const formData = new FormData()
    formData.append('status', status)
    if (notes) formData.append('note', notes)
    if (uploadedPhotoFile) formData.append('after_image', uploadedPhotoFile)

    // Validation: resolved requires after_image
    if (status === 'resolved' && !uploadedPhotoFile && !report?.images?.some(img => img.type === 'after')) {
      setUpdateError('After photo is required when marking as resolved')
      setUpdateLoading(false)
      return
    }

    try {
      const res = await reportsService.updateStatus(id, formData)
      setUpdateSuccess(true)
      // Refresh report data
      await fetchReport()
      setUploadedPhoto(null)
      setUploadedPhotoFile(null)
      setNotes('')
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.response?.data?.error || 'Failed to update status')
    } finally {
      setUpdateLoading(false)
    }
  }

  const getImageUrl = (path) => {
    if (!path) return null
    return `http://localhost:8000/storage/${path}`
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="d-flex align-items-center justify-content-center flex-column" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="text-danger mb-3">⚠️ {error || 'Report not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/company/reports')}>Back to Reports</button>
      </div>
    )
  }

  const sevStyle = SEV_STYLE[report.severity] || SEV_STYLE.low
  const statusStyle = STATUS_STYLE[report.status] || STATUS_STYLE.pending

  const beforePhotos = report.images?.filter(img => img.type === 'before') || []
  const afterPhotos = report.images?.filter(img => img.type === 'after') || []

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-3 sticky-top" style={{ height: 52 }}>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-light btn-sm border-0 p-1" onClick={() => navigate('/company/reports')}>←</button>
          <span className="text-secondary" style={{ fontSize: '.85rem' }}>
            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/company/reports')}>Reports</span>
            {' › '}
            <span>Report #{id}</span>
          </span>
        </div>
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
        <h5 className="fw-bold mb-2" style={{ fontSize: '1.35rem', color: '#0f172a' }}>{report.title}</h5>
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="fw-semibold px-2 py-1 rounded-pill text-uppercase" style={{ fontSize: '.72rem', ...sevStyle }}>{report.severity}</span>
          <span className="fw-semibold px-2 py-1 rounded-pill text-capitalize" style={{ fontSize: '.72rem', ...statusStyle }}>{report.status?.replace('_', ' ')}</span>
        </div>

        {/* Alerts */}
        {updateSuccess && (
          <div className="alert alert-success alert-dismissible fade show">
            ✓ Status updated successfully!
            <button className="btn-close" onClick={() => setUpdateSuccess(false)}></button>
          </div>
        )}
        {updateError && (
          <div className="alert alert-danger alert-dismissible fade show">
            {updateError}
            <button className="btn-close" onClick={() => setUpdateError(null)}></button>
          </div>
        )}

        <div className="row g-3">
          <div className="col-lg-7">

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-2" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Report Description</div>
                <p className="text-secondary mb-3" style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{report.description}</p>
                <span className="border rounded-pill px-3 py-1 text-secondary" style={{ fontSize: '.78rem' }}>
                  ⚙ {report.category?.name || 'General'}
                </span>
              </div>
            </div>

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-2" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Location Details</div>
                <div className="d-flex align-items-start gap-2 mb-2">
                  <span style={{ color: '#0d6efd', fontSize: '1rem' }}>📍</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '.9rem', color: '#1e293b' }}>{report.address || report.city?.name || 'Unknown location'}</div>
                    <div className="text-secondary" style={{ fontSize: '.8rem' }}>Lat: {report.latitude}, Lng: {report.longitude}</div>
                  </div>
                </div>
                <LeafletMap lat={report.latitude} lng={report.longitude} />
              </div>
            </div>

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Reported By</div>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{ width: 40, height: 40, background: '#94a3b8', fontSize: '.85rem' }}>
                    {report.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '.9rem', color: '#1e293b' }}>{report.user?.name || 'Anonymous'}</div>
                    <div className="text-secondary" style={{ fontSize: '.78rem' }}>
                      {report.user?.role || 'Citizen'} · {report.user?.reports_count || 0} reports
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Before Photos */}
            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>
                  Before Photos ({beforePhotos.length})
                </div>
                {beforePhotos.length > 0 ? (
                  <div className="d-flex gap-2 flex-wrap">
                    {beforePhotos.map((img, i) => (
                      <img key={i} src={getImageUrl(img.image_path)} alt={`before-${i}`} className="rounded-2"
                        style={{ width: 110, height: 85, objectFit: 'cover', cursor: 'zoom-in' }}
                        onClick={() => setLightboxImg(getImageUrl(img.image_path))} />
                    ))}
                  </div>
                ) : (
                  <div className="text-secondary" style={{ fontSize: '.85rem' }}>No before photos</div>
                )}
              </div>
            </div>

            {/* After Photos */}
            {afterPhotos.length > 0 && (
              <div className="card border shadow-none">
                <div className="card-body p-3">
                  <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>
                    After Photos ({afterPhotos.length})
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {afterPhotos.map((img, i) => (
                      <img key={i} src={getImageUrl(img.image_path)} alt={`after-${i}`} className="rounded-2"
                        style={{ width: 110, height: 85, objectFit: 'cover', cursor: 'zoom-in' }}
                        onClick={() => setLightboxImg(getImageUrl(img.image_path))} />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="col-lg-5">

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Update Status</div>

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>Report Status</label>
                <select className="form-select mb-3" style={{ fontSize: '.88rem' }} value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>Internal Notes</label>
                <textarea className="form-control mb-3" rows={4} style={{ fontSize: '.85rem', resize: 'vertical' }}
                  placeholder="Add notes about this status update..."
                  value={notes} onChange={e => setNotes(e.target.value)} />

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>
                  Upload After Photo {status === 'resolved' && <span className="text-danger">*</span>}
                </label>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFileChange} />

                {uploadedPhoto ? (
                  <div className="position-relative mb-3">
                    <img src={uploadedPhoto} alt="uploaded" className="rounded-3 w-100"
                      style={{ maxHeight: 160, objectFit: 'cover', cursor: 'zoom-in' }}
                      onClick={() => setLightboxImg(uploadedPhoto)} />
                    <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                      style={{ width: 26, height: 26, padding: 0, fontSize: '.75rem' }}
                      onClick={() => { setUploadedPhoto(null); setUploadedPhotoFile(null) }}>✕</button>
                  </div>
                ) : (
                  <div className="rounded-3 d-flex flex-column align-items-center justify-content-center p-3 mb-3"
                    style={{ border: `2px dashed ${dragOver ? '#0d6efd' : '#cbd5e1'}`, background: dragOver ? '#f0f9ff' : '#fafafa', cursor: 'pointer', minHeight: 110, transition: 'all .15s' }}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0d6efd" viewBox="0 0 16 16" className="mb-2">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    <div className="fw-semibold" style={{ fontSize: '.83rem', color: '#334155' }}>Click to upload or drag & drop</div>
                    <div className="text-secondary" style={{ fontSize: '.75rem' }}>JPEG, PNG, WebP up to 5MB</div>
                  </div>
                )}

                <button 
                  className="btn btn-primary w-100 fw-bold" 
                  style={{ fontSize: '.9rem' }}
                  onClick={handleUpdateStatus}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Updating...
                    </>
                  ) : (
                    'Save Status Update'
                  )}
                </button>
              </div>
            </div>

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Status History</div>
                {report.status_history?.length > 0 ? (
                  report.status_history.map((h, i) => (
                    <div key={i} className="d-flex align-items-start gap-3 mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                        style={{ width: 34, height: 34, background: h.to_status === 'resolved' ? '#16a34a' : h.to_status === 'in_progress' ? '#d97706' : '#2563eb', fontSize: '.85rem' }}>
                        {h.to_status === 'resolved' ? '✓' : h.to_status === 'in_progress' ? '▶' : '📋'}
                      </div>
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '.87rem', color: '#1e293b' }}>
                          {h.from_status === h.to_status ? 'Report Submitted' : `Changed to ${h.to_status?.replace('_', ' ')}`}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '.78rem' }}>
                          {h.note || `Status updated by ${h.changer?.name || 'System'}`}
                        </div>
                        <div className="text-primary" style={{ fontSize: '.75rem' }}>
                          {new Date(h.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-secondary" style={{ fontSize: '.85rem' }}>No status history yet</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {lightboxImg && (
        <div className="position-fixed d-flex align-items-center justify-content-center"
          style={{ inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9999, cursor: 'zoom-out' }}
          onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="preview" className="rounded-3"
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', boxShadow: '0 8px 40px rgba(0,0,0,.5)' }}
            onClick={e => e.stopPropagation()} />
          <button className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle fw-bold"
            style={{ width: 36, height: 36, padding: 0 }}
            onClick={() => setLightboxImg(null)}>✕</button>
        </div>
      )}

    </div>
  )
}