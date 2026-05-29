import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsService, citiesService, categoriesService } from '../../services/api'

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#16a34a' },
  { value: 'medium', label: 'Medium', color: '#2563eb' },
  { value: 'high', label: 'High', color: '#d97706' },
  { value: 'critical', label: 'Critical', color: '#dc2626' },
]

export default function SubmitReport() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [cityId, setCityId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  
  // Photos
  const [photos, setPhotos] = useState([])
  const [dragOver, setDragOver] = useState(false)
  
  // Data from API
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  
  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingToken, setTrackingToken] = useState('')
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState({})

  // Load cities & categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          citiesService.getAll(),
          categoriesService.getAll(),
        ])
        setCities(citiesRes.data.data || citiesRes.data || [])
        setCategories(categoriesRes.data.data || categoriesRes.data || [])
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setCitiesLoading(false)
      }
    }
    loadData()
  }, [])

  // Initialize map
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return
      const L = window.L
      const map = L.map(mapRef.current).setView([30.0444, 31.2357], 13)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        setLatitude(lat.toFixed(8))
        setLongitude(lng.toFixed(8))
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map)
        }
      })
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  const handleFiles = (files) => {
    const newPhotos = Array.from(files).slice(0, 5 - photos.length)
    if (newPhotos.length === 0) return
    setPhotos(prev => [...prev, ...newPhotos])
  }

  const removePhoto = (i) => setPhotos(prev => prev.filter((_, idx) => idx !== i))

  const validate = () => {
    const e = {}
    if (!title.trim()) e.title = 'Required'
    if (!description.trim() || description.length < 20) e.description = 'Must be at least 20 characters'
    if (!cityId) e.city = 'Required'
    if (!categoryId) e.category = 'Required'
    if (!latitude || !longitude) e.location = 'Please select location on map'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true)
    setErrors({})

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('severity', severity)
    formData.append('city_id', cityId)
    formData.append('category_id', categoryId)
    formData.append('latitude', latitude)
    formData.append('longitude', longitude)
    if (address) formData.append('address', address)

    photos.forEach((photo, i) => {
      formData.append('images[]', photo)
    })

    try {
      const res = await reportsService.create(formData)
      const reportData = res.data.data || res.data
      setTrackingToken(reportData.tracking_token)
      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit report' })
    } finally {
      setSubmitting(false)
    }
  }

  const copyToken = () => {
    navigator.clipboard.writeText(trackingToken)
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

        {/* Error */}
        {errors.submit && (
          <div className="alert alert-danger alert-dismissible fade show">
            {errors.submit}
            <button className="btn-close" onClick={() => setErrors(prev => ({ ...prev, submit: '' }))}></button>
          </div>
        )}

        {/* ── Upload Photos ── */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-camera text-success" style={{ fontSize: '1.1rem' }} />
              <span className="fw-bold" style={{ fontSize: '1rem' }}>Upload Photos ({photos.length}/5)</span>
            </div>

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
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)} />

            {photos.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {photos.map((p, i) => (
                  <div key={i} className="position-relative">
                    <img src={URL.createObjectURL(p)} alt={p.name} className="rounded-2"
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

            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Description <span className="text-muted">(min 20 chars)</span></label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows={4}
                placeholder="Provide more details about the issue..."
                style={{ fontSize: '.87rem', resize: 'vertical' }}
                value={description}
                onChange={e => { setDescription(e.target.value); setErrors(er => ({ ...er, description: '' })) }}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            {/* Severity */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Severity</label>
              <div className="d-flex gap-2 flex-wrap">
                {SEVERITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className="btn fw-semibold"
                    style={{
                      background: severity === opt.value ? opt.color : '#f8f9fa',
                      color: severity === opt.value ? '#fff' : '#6c757d',
                      border: `2px solid ${severity === opt.value ? opt.color : '#dee2e6'}`,
                      borderRadius: 8,
                      padding: '6px 16px',
                      fontSize: '.85rem',
                    }}
                    onClick={() => setSeverity(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>City</label>
                  <select
                    className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                    style={{ fontSize: '.87rem' }}
                    value={cityId}
                    onChange={e => { setCityId(e.target.value); setErrors(er => ({ ...er, city: '' })) }}
                    disabled={citiesLoading}
                  >
                    <option value="">Select City</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Category</label>
                  <select
                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                    style={{ fontSize: '.87rem' }}
                    value={categoryId}
                    onChange={e => { setCategoryId(e.target.value); setErrors(er => ({ ...er, category: '' })) }}
                    disabled={citiesLoading}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '.83rem' }}>Street Address <span className="text-muted">(optional)</span></label>
                  <input
                    className="form-control"
                    placeholder="Enter manual address"
                    style={{ fontSize: '.87rem' }}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </div>

                {errors.location && (
                  <div className="alert alert-warning py-2" style={{ fontSize: '.8rem' }}>
                    {errors.location}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div
                  ref={mapRef}
                  className="rounded-3 overflow-hidden border"
                  style={{ height: 250, width: '100%', background: '#e2e8f0' }}
                />
                {latitude && (
                  <small className="text-success mt-1 d-block" style={{ fontSize: '.78rem' }}>
                    ✓ Location: {latitude}, {longitude}
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <button
          className="btn w-100 fw-bold py-3 mb-4"
          style={{ background: '#16a34a', color: '#fff', borderRadius: 10, border: 'none', fontSize: '1rem' }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
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

            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div
                className="border rounded-2 px-4 py-2 fw-bold"
                style={{ fontSize: '1.1rem', color: '#0f172a', background: '#fff', letterSpacing: '.05em', fontFamily: 'monospace' }}
              >
                {trackingToken}
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