import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const REPORTS_DATA = {
  1: {
    id: 1,
    title: 'Report #42: Overflowing Waste Bin',
    severity: 'CRITICAL SEVERITY',
    status: 'IN PROGRESS',
    description: 'Waste container overflowing on 26th of July St. obstructing sidewalk. The accumulation includes large plastic bags and loose debris, creating a significant obstruction for pedestrians and an unsanitary environment.',
    category: 'General Waste',
    location: '26th of July St, Zamalek',
    lat: '30.0595',
    lng: '31.2223',
    reportedBy: { name: 'Ahmed El-Sayed', role: 'Citizen Contributor', reports: 14, initials: 'AS' },
    beforePhotos: [
      'https://placehold.co/120x90/e2e8f0/94a3b8?text=Photo+1',
      'https://placehold.co/120x90/e2e8f0/94a3b8?text=Photo+2',
      'https://placehold.co/120x90/e2e8f0/94a3b8?text=Photo+3',
    ],
    statusHistory: [
      { icon: '↺', iconBg: '#22c55e', title: 'Moved to In Progress', detail: 'Update by: Admin Sarah J.', time: 'Today, 11:38 AM' },
      { icon: '📋', iconBg: '#94a3b8', title: 'Report Assigned', detail: 'Assigned to: Zone A Cleanup Team', time: 'Today, 10:08 AM' },
    ],
  },
}

const SEV_STYLE = {
  'CRITICAL SEVERITY': { background: '#fee2e2', color: '#dc2626' },
  'HIGH SEVERITY':     { background: '#fef3c7', color: '#d97706' },
  'LOW SEVERITY':      { background: '#dcfce7', color: '#16a34a' },
}

const STATUS_STYLE = {
  'IN PROGRESS': { background: '#dcfce7', color: '#16a34a' },
  'ASSIGNED':    { background: '#dbeafe', color: '#2563eb' },
  'RESOLVED':    { background: '#f1f5f9', color: '#64748b' },
}

function LeafletMap({ lat, lng }) {
  const mapRef     = useRef(null)
  const mapInitRef = useRef(false)

  useEffect(() => {
    if (mapInitRef.current) return
    mapInitRef.current = true

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id    = 'leaflet-css'
      link.rel   = 'stylesheet'
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script  = document.createElement('script')
      script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => initMap()
      document.head.appendChild(script)
    } else {
      initMap()
    }

    function initMap() {
      if (!mapRef.current) return
      const map = window.L.map(mapRef.current).setView([lat, lng], 15)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      const icon = window.L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;background:#dc3545;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      })
      window.L.marker([lat, lng], { icon }).addTo(map)
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
  const { id }   = useParams()
  const navigate = useNavigate()
  const report   = REPORTS_DATA[id] || REPORTS_DATA[1]

  const [status,        setStatus]        = useState('In Progress')
  const [notes,         setNotes]         = useState('Cleanup crew dispatched to 26th of July St. Expected arrival within 30 minutes. Priority level verified as critical.')
  const [dragOver,      setDragOver]      = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [lightboxImg,   setLightboxImg]   = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setUploadedPhoto(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedPhoto(URL.createObjectURL(file))
  }

  const sevStyle    = SEV_STYLE[report.severity]  || SEV_STYLE['CRITICAL SEVERITY']
  const statusStyle = STATUS_STYLE[report.status] || STATUS_STYLE['ASSIGNED']

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
          <span className="fw-semibold px-2 py-1 rounded-pill" style={{ fontSize: '.72rem', ...sevStyle }}>{report.severity}</span>
          <span className="fw-semibold px-2 py-1 rounded-pill" style={{ fontSize: '.72rem', ...statusStyle }}>{report.status}</span>
        </div>

        <div className="row g-3">
          <div className="col-lg-7">

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-2" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Report Description</div>
                <p className="text-secondary mb-3" style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{report.description}</p>
                <span className="border rounded-pill px-3 py-1 text-secondary" style={{ fontSize: '.78rem' }}>⚙ {report.category}</span>
              </div>
            </div>

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-2" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Location Details</div>
                <div className="d-flex align-items-start gap-2 mb-2">
                  <span style={{ color: '#0d6efd', fontSize: '1rem' }}>📍</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '.9rem', color: '#1e293b' }}>{report.location}</div>
                    <div className="text-secondary" style={{ fontSize: '.8rem' }}>Lat: {report.lat}, Lng: {report.lng}</div>
                  </div>
                </div>
                <LeafletMap lat={parseFloat(report.lat)} lng={parseFloat(report.lng)} />
              </div>
            </div>

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Reported By</div>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                    style={{ width: 40, height: 40, background: '#94a3b8', fontSize: '.85rem' }}>{report.reportedBy.initials}</div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '.9rem', color: '#1e293b' }}>{report.reportedBy.name}</div>
                    <div className="text-secondary" style={{ fontSize: '.78rem' }}>{report.reportedBy.role} · {report.reportedBy.reports} reports</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>
                  Before Photos ({report.beforePhotos.length})
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {report.beforePhotos.map((src, i) => (
                    <img key={i} src={src} alt={`before-${i}`} className="rounded-2"
                      style={{ width: 110, height: 85, objectFit: 'cover', cursor: 'zoom-in', transition: 'opacity .15s' }}
                      onClick={() => setLightboxImg(src)}
                      onMouseEnter={e => e.target.style.opacity = '.8'}
                      onMouseLeave={e => e.target.style.opacity = '1'} />
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="col-lg-5">

            <div className="card border shadow-none mb-3">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Update Status</div>

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>Report Status</label>
                <select className="form-select mb-3" style={{ fontSize: '.88rem' }} value={status} onChange={e => setStatus(e.target.value)}>
                  <option>Assigned</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Rejected</option>
                </select>

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>Internal Notes</label>
                <textarea className="form-control mb-3" rows={4} style={{ fontSize: '.85rem', resize: 'vertical' }}
                  value={notes} onChange={e => setNotes(e.target.value)} />

                <label className="form-label fw-semibold" style={{ fontSize: '.85rem' }}>Upload After Photo (Mandatory for Resolve)</label>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: 'none' }} onChange={handleFileChange} />

                {uploadedPhoto ? (
                  <div className="position-relative mb-3">
                    <img src={uploadedPhoto} alt="uploaded" className="rounded-3 w-100"
                      style={{ maxHeight: 160, objectFit: 'cover', cursor: 'zoom-in' }}
                      onClick={() => setLightboxImg(uploadedPhoto)} />
                    <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                      style={{ width: 26, height: 26, padding: 0, fontSize: '.75rem' }}
                      onClick={() => setUploadedPhoto(null)}>✕</button>
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
                    <div className="text-secondary" style={{ fontSize: '.75rem' }}>JPEG, PNG up to 10MB</div>
                  </div>
                )}

                <button className="btn btn-primary w-100 fw-bold" style={{ fontSize: '.9rem' }}>Save Status Update</button>
              </div>
            </div>

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary fw-bold mb-3" style={{ fontSize: '.65rem', letterSpacing: '.08em' }}>Status History</div>
                {report.statusHistory.map((h, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ width: 34, height: 34, background: h.iconBg, fontSize: '.85rem' }}>{h.icon}</div>
                    <div>
                      <div className="fw-semibold" style={{ fontSize: '.87rem', color: '#1e293b' }}>{h.title}</div>
                      <div className="text-secondary" style={{ fontSize: '.78rem' }}>{h.detail}</div>
                      <div className="text-primary" style={{ fontSize: '.75rem' }}>{h.time}</div>
                    </div>
                  </div>
                ))}
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