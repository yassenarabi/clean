import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function LeafletMap({ lat, lng, title }) {
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapObjRef.current) return
      const L   = window.L
      const map = L.map(mapRef.current).setView([lat, lng], 16)
      mapObjRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:16px;height:16px;
          background:#dc3545;border-radius:50%;
          border:3px solid #fff;
          box-shadow:0 2px 10px rgba(0,0,0,.4);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${title}</b>`)
        .openPopup()
    }

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
      script.onload = initMap
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
  }, [lat, lng])

  return <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
}

export default function MapView() {
  const navigate      = useNavigate()
  const [params]      = useSearchParams()

  const lat   = parseFloat(params.get('lat')   || '30.0595')
  const lng   = parseFloat(params.get('lng')   || '31.2223')
  const title = params.get('title') || 'Location'
  const time  = params.get('time')  || ''

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#0f172a' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center gap-3 px-3 bg-white border-bottom" style={{ height:52, flexShrink:0 }}>
        <button
          className="btn btn-light btn-sm border d-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div style={{ flex:1 }}>
          <div className="fw-bold" style={{ fontSize:'.92rem', color:'#0f172a' }}>{title}</div>
          {time && <div className="text-secondary" style={{ fontSize:'.75rem' }}>{time}</div>}
        </div>
        {/* Open in Google Maps */}
        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-primary btn-sm fw-semibold"
        >
          Open in Google Maps ↗
        </a>
      </div>

      {/* Map */}
      <div style={{ flex:1, position:'relative' }}>
        <LeafletMap lat={lat} lng={lng} title={title} />

        {/* Info card on map */}
        <div
          className="position-absolute bg-white rounded-3 shadow px-3 py-2 d-flex align-items-center gap-2"
          style={{ bottom:24, left:'50%', transform:'translateX(-50%)', zIndex:999, minWidth:220, maxWidth:'90vw' }}
        >
          <div
            className="rounded-circle flex-shrink-0"
            style={{ width:10, height:10, background:'#dc3545' }}
          />
          <div>
            <div className="fw-semibold" style={{ fontSize:'.85rem', color:'#1e293b' }}>{title}</div>
            <div className="text-secondary" style={{ fontSize:'.73rem' }}>
              Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}