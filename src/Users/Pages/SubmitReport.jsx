import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { key: 'waste',        label: 'Waste',        icon: 'bi-trash'           },
  { key: 'construction', label: 'Construction', icon: 'bi-tools'           },
  { key: 'medical',      label: 'Medical',      icon: 'bi-plus-square'     },
  { key: 'hazardous',    label: 'Hazardous',    icon: 'bi-exclamation-triangle' },
  { key: 'flooding',     label: 'Flooding',     icon: 'bi-water'           },
]

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const part1 = Math.floor(1000 + Math.random() * 9000)
  const part2 = Array.from({ length: 2 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `CC-${part1}-${part2}`
}

export default function SubmitReport() {
  const navigate  = useNavigate()
  const fileRef   = useRef(null)

  const [photos,    setPhotos]    = useState([])
  const [dragOver,  setDragOver]  = useState(false)
  const [title,     setTitle]     = useState('')
  const [desc,      setDesc]      = useState('')
  const [category,  setCategory]  = useState('waste')
  const [address,   setAddress]   = useState('')
  const [city,      setCity]      = useState('Cairo, Maadi')
  const [submitted, setSubmitted] = useState(false)
  const [token,     setToken]     = useState('')
  const [copied,    setCopied]    = useState(false)
  const [errors,    setErrors]    = useState({})

  const handleFiles = (files) => {
    const newPhotos = Array.from(files).map(f => ({ url: URL.createObjectURL(f), name: f.name }))
    setPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i))

  const validate = () => {
    const e = {}
    if (!title.trim())   e.title   = 'Required'
    if (!address.trim()) e.address = 'Required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const t = generateToken()
    setToken(t)
    setSubmitted(true)
  }

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 780 }}>

        {/* Header */}
        <h4 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0f172a' }}>Submit a New Report</h4>
        <p className="text-secondary mb-4" style={{ fontSize: '.88rem' }}>
          Help us keep the city clean by documenting local issues with detail and precision.
        </p>

        {/* ── Upload Photos ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-camera text-success" style={{ fontSize: '1.1rem' }} />
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Upload Photos</span>
            </div>

            {/* Drop Zone */}
            <div
              className="rounded-3 d-flex flex-column align-items-center justify-content-center p-4"
              style={{
                border: `2px dashed ${dragOver ? '#16a34a' : '#cbd5e1'}`,
                background: dragOver ? '#f0fdf4' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all .15s',
                minHeight: 140,
              }}
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            >
              <i className="bi bi-cloud-upload mb-2" style={{ fontSize: '2rem', color: '#16a34a' }} />
              <div className="fw-semibold mb-1" style={{ fontSize: '.88rem', color: '#334155' }}>Drag and drop images here</div>
              <div className="text-secondary mb-3" style={{ fontSize: '.8rem' }}>or click to browse from your device</div>
              <button
                className="btn fw-semibold px-4 py-1"
                style={{ background: '#16a34a', color: '#fff', borderRadius: 8, border: 'none', fontSize: '.85rem' }}
                onClick={e => { e.stopPropagation(); fileRef.current.click() }}
              >Select Files</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)} />

            {/* Preview */}
            {photos.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {photos.map((p, i) => (
                  <div key={i} className="position-relative">
                    <img src={p.url} alt={p.name} className="rounded-2"
                      style={{ width: 72, height: 72, objectFit: 'cover' }} />
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center p-0"
                      style={{ width: 20, height: 20, fontSize: '.65rem', transform: 'translate(30%,-30%)' }}
                      onClick={() => removePhoto(i)}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Report Details ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-file-earmark-text text-success" style={{ fontSize: '1.1rem' }} />
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Report Details</span>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Report Title</label>
              <input
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g., Overflowing waste bin on Al-Galaa St."
                style={{ fontSize: '.87rem' }}
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(er => ({ ...er, title: '' })) }}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div>
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Provide more details about the issue..."
                style={{ fontSize: '.87rem', resize: 'vertical' }}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Report Category ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-grid text-success" style={{ fontSize: '1.1rem' }} />
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Report Category</span>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  className="d-flex flex-column align-items-center gap-1 px-3 py-2 rounded-3"
                  style={{
                    border: `1.5px solid ${category === c.key ? '#16a34a' : '#e2e8f0'}`,
                    background: category === c.key ? '#f0fdf4' : '#fff',
                    color: category === c.key ? '#16a34a' : '#475569',
                    cursor: 'pointer',
                    minWidth: 80,
                    transition: 'all .15s',
                  }}
                  onClick={() => setCategory(c.key)}
                >
                  <i className={`bi ${c.icon}`} style={{ fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '.75rem', fontWeight: 500 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Location Details ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-geo-alt text-success" style={{ fontSize: '1.1rem' }} />
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Location Details</span>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <button
                  className="btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ border: '1.5px solid #16a34a', color: '#16a34a', background: '#fff', borderRadius: 8, fontSize: '.85rem', fontWeight: 600 }}
                  onClick={() => setAddress('Current Location Detected')}
                >
                  <i className="bi bi-crosshair" /> Auto-detect Location
                </button>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Street Address</label>
                  <input
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter manual address"
                    style={{ fontSize: '.87rem' }}
                    value={address}
                    onChange={e => { setAddress(e.target.value); setErrors(er => ({ ...er, address: '' })) }}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                <div>
                  <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>City / Area</label>
                  <input
                    className="form-control"
                    style={{ fontSize: '.87rem' }}
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="rounded-3 overflow-hidden" style={{ height: 220, background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop"
                    alt="map"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .85 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <button
          className="btn w-100 fw-bold py-3 mb-4"
          style={{ background: '#16a34a', color: '#fff', borderRadius: 10, border: 'none', fontSize: '1rem' }}
          onClick={handleSubmit}
        >
          Submit Report
        </button>

        {/* ── Success State ── */}
        {submitted && (
          <div className="card border-0 rounded-3 p-4 text-center mb-4" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 48, height: 48, background: '#16a34a' }}
            >
              <i className="bi bi-check-lg text-white" style={{ fontSize: '1.4rem' }} />
            </div>
            <h5 className="fw-bold mb-1" style={{ color: '#15803d' }}>Report Submitted Successfully!</h5>
            <p className="text-secondary mb-3" style={{ fontSize: '.85rem' }}>
              Your tracking token is ready. Use this to check progress.
            </p>

            {/* Token */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div
                className="border rounded-2 px-4 py-2 fw-bold"
                style={{ fontSize: '1.1rem', color: '#0f172a', background: '#fff', letterSpacing: '.05em', fontFamily: 'monospace' }}
              >
                {token}
              </div>
              <button
                className="btn btn-sm border d-flex align-items-center gap-1"
                style={{ background: '#fff', fontSize: '.82rem' }}
                onClick={copyToken}
              >
                <i className={`bi ${copied ? 'bi-check-lg text-success' : 'bi-clipboard'}`} />
              </button>
            </div>

            <div className="d-flex align-items-center justify-content-center gap-3">
              <button
                className="btn btn-link fw-semibold text-decoration-none d-flex align-items-center gap-1"
                style={{ color: '#16a34a', fontSize: '.88rem' }}
                onClick={() => navigate('/user/my-reports')}
              >
                Track Your Report <i className="bi bi-arrow-right" />
              </button>
              <span className="text-secondary">|</span>
              <button
                className="btn btn-link fw-semibold text-decoration-none"
                style={{ color: '#475569', fontSize: '.88rem' }}
                onClick={() => navigate('/user')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}