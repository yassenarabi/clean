import { useState, useRef, useEffect } from 'react'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const ROUTE_STATS = {
  totalReports: 12,
  totalDistance: '14.2 km',
  estDuration: '1h 45m',
  efficiencyGain: '15% Fuel Saved',
}

const STOPS = [
  { id: 1, title: 'Illegal Dumping – 24th Ave',    address: '1248 24th Avenue, Sunset District', priority: 'High Severity', eta: '09:15 AM', distance: '1.2km', lat: 30.062, lng: 31.225, done: false },
  { id: 2, title: 'Overflowing Bin – Park Dr',     address: '880 Park Drive, Golden Gate',        priority: 'Normal',        eta: '09:40 AM', distance: '2.8km', lat: 30.058, lng: 31.235, done: false },
  { id: 3, title: 'Graffiti Removal – Market St',  address: '2100 Market Street, Castro',         priority: 'Low Priority',  eta: '10:05 AM', distance: '3.4km', lat: 30.052, lng: 31.245, done: false },
]

const PRIORITY_STYLE = {
  'High Severity': { background: '#fee2e2', color: '#dc2626' },
  'Normal':        { background: '#dcfce7', color: '#16a34a' },
  'Low Priority':  { background: '#f1f5f9', color: '#64748b' },
}

// ══════════════════════════════════════
//  Leaflet Map
// ══════════════════════════════════════
function RouteMap({ stops }) {
  const mapRef     = useRef(null)
  const mapObjRef  = useRef(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapObjRef.current) return

      const L   = window.L
      const map = L.map(mapRef.current, { zoomControl: true }).setView(
        [stops[0].lat, stops[0].lng], 14
      )
      mapObjRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      // Draw route line
      const latlngs = stops.map(s => [s.lat, s.lng])
      L.polyline(latlngs, { color: '#0d6efd', weight: 3, dashArray: '6 4' }).addTo(map)

      // Markers
      stops.forEach((s) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:28px;
            background:#0d6efd;border-radius:50%;
            border:2.5px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.35);
            display:flex;align-items:center;justify-content:center;
            color:#fff;font-weight:700;font-size:.75rem;
          ">${s.id}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${s.title}</b><br>${s.address}`)
      })
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id    = 'leaflet-css'
      link.rel   = 'stylesheet'
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script   = document.createElement('script')
      script.src     = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload  = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove()
        mapObjRef.current = null
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      {/* Legend */}
      <div
        className="position-absolute bg-white rounded-2 px-2 py-1 d-flex flex-column gap-1"
        style={{ top: 12, left: 12, zIndex: 999, boxShadow: '0 2px 8px rgba(0,0,0,.15)', fontSize: '.75rem' }}
      >
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0d6efd' }} />
          <span>Current Path</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc3545' }} />
          <span>High Severity</span>
        </div>
      </div>
      <div ref={mapRef} className="rounded-3 overflow-hidden" style={{ height: 340, width: '100%', zIndex: 1 }} />
    </div>
  )
}

// ══════════════════════════════════════
//  Main Page
// ══════════════════════════════════════
export default function CleanRoute() {
  const [stops,     setStops]     = useState(STOPS)
  const [generated, setGenerated] = useState(true)

  const toggleDone = (id) => {
    setStops(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s))
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-3 sticky-top" style={{ height: 52 }}>
        <span className="fw-bold text-primary" style={{ fontSize: '1.05rem' }}>Clean Route Optimizer</span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width: 7, height: 7, top: 2, right: 2 }} />
          </button>
          <div className="d-flex align-items-center gap-2 bg-light border rounded-pill" style={{ padding: '3px 12px 3px 3px' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: 30, height: 30, fontSize: '.68rem', background: 'linear-gradient(135deg,#0d6efd,#6f42c1)' }}
            >JD</div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="fw-semibold" style={{ fontSize: '.8rem' }}>John Doe</div>
              <div className="text-secondary" style={{ fontSize: '.65rem' }}>Fleet Driver</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">

        {/* Route Engine Banner */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-3 d-flex align-items-center justify-content-between gap-3 flex-wrap">
            <div>
              <div className="fw-bold mb-1" style={{ fontSize: '.95rem' }}>Route Engine v2.4</div>
              <div className="text-secondary" style={{ fontSize: '.83rem', maxWidth: 480 }}>
                Optimize your team's path across 12 high-priority reports. Our algorithm calculates the most fuel-efficient sequence while considering traffic and cleanup urgency.
              </div>
            </div>
            <button
              className="btn btn-primary fw-bold d-flex align-items-center gap-2 px-4"
              onClick={() => setGenerated(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              Generate Optimized Route
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-1" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Total Reports</div>
                <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#0f172a' }}>{ROUTE_STATS.totalReports} Reports</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-1" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Total Distance</div>
                <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#0f172a' }}>{ROUTE_STATS.totalDistance}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-1" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Est. Duration</div>
                <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#0f172a' }}>{ROUTE_STATS.estDuration}</div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100" style={{ borderColor: '#bbf7d0 !important', background: '#f0fdf4' }}>
              <div className="card-body p-3" style={{ background: '#f0fdf4', borderRadius: 12 }}>
                <div className="text-uppercase mb-1" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em', color: '#16a34a' }}>Efficiency Gain</div>
                <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#16a34a' }}>{ROUTE_STATS.efficiencyGain}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        {generated && (
          <div className="card border shadow-none mb-3">
            <div className="card-body p-3">
              <RouteMap stops={stops} />
            </div>
          </div>
        )}

        {/* Route Itinerary */}
        <div className="card border shadow-none mb-3">
          <div className="card-body p-3">
            <div className="fw-bold mb-3" style={{ fontSize: '.95rem' }}>Route Itinerary</div>

            <div className="d-flex flex-column gap-2">
              {stops.map((s) => {
                const pri = PRIORITY_STYLE[s.priority] || PRIORITY_STYLE['Normal']
                return (
                  <div
                    key={s.id}
                    className="d-flex align-items-center gap-3 p-3 rounded-3 border"
                    style={{ background: s.done ? '#f8f9fa' : '#fff', opacity: s.done ? .65 : 1, transition: 'all .2s' }}
                  >
                    {/* Number */}
                    <div
                      className="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: 36, height: 36, background: s.done ? '#94a3b8' : '#0d6efd', fontSize: '.85rem' }}
                    >{s.id}</div>

                    {/* Info */}
                    <div className="flex-grow-1 min-width-0">
                      <div className="fw-semibold" style={{ fontSize: '.88rem', color: '#1e293b', textDecoration: s.done ? 'line-through' : 'none' }}>
                        {s.title}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '.78rem' }}>{s.address}</div>
                    </div>

                    {/* Priority badge */}
                    <span className="fw-semibold px-2 py-1 rounded-pill flex-shrink-0 d-none d-sm-inline" style={{ fontSize: '.7rem', ...pri }}>
                      {s.priority}
                    </span>

                    {/* ETA + Distance */}
                    <div className="text-end flex-shrink-0 d-none d-md-block">
                      <div style={{ fontSize: '.82rem', color: '#334155' }}>ETA: {s.eta}</div>
                      <div className="text-primary fw-semibold" style={{ fontSize: '.75rem' }}>Distance: {s.distance}</div>
                    </div>

                    {/* Done toggle */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <div
                        className="rounded-pill"
                        style={{
                          width: 40, height: 22, cursor: 'pointer',
                          background: s.done ? '#0d6efd' : '#e2e8f0',
                          position: 'relative', transition: 'background .2s',
                        }}
                        onClick={() => toggleDone(s.id)}
                      >
                        <div style={{
                          position: 'absolute', top: 3,
                          left: s.done ? 20 : 3,
                          width: 16, height: 16,
                          background: '#fff', borderRadius: '50%',
                          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                          transition: 'left .2s',
                        }} />
                      </div>
                      <span className="text-secondary" style={{ fontSize: '.8rem' }}>Done</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-outline-secondary px-4">Print Manifest</button>
          <button className="btn btn-primary fw-bold px-4">Save This Route</button>
        </div>

      </div>
    </div>
  )
}