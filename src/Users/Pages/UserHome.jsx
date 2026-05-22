import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

// ── Leaflet Map Component ──
function NearYouMap() {
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapObjRef.current) return
      const L   = window.L
      const map = L.map(mapRef.current, { zoomControl: false }).setView([30.0444, 31.2357], 9)
      mapObjRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map)

      // Pins
      const pins = [
        { lat: 30.0595, lng: 31.2223, color: '#16a34a' },
        { lat: 30.0678, lng: 31.3411, color: '#16a34a' },
        { lat: 29.9792, lng: 31.1342, color: '#dc3545' },
      ]
      pins.forEach(p => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;background:${p.color};border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        })
        L.marker([p.lat, p.lng], { icon }).addTo(map)
      })
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    } else { initMap() }

    return () => { if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
  }, [])

  return <div ref={mapRef} className="rounded-3 overflow-hidden" style={{ height: '100%', minHeight: 340, width: '100%' }} />
}

export default function UserHome() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#f8f9fa' }}>

      {/* ── Hero Section ── */}
      <div
        className="position-relative d-flex align-items-end"
        style={{
          minHeight: 420,
          background: `url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&h=600&fit=crop) center/cover`,
        }}
      >
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,.75) 0%, rgba(0,0,0,.3) 100%)' }} />

        <div className="position-relative p-4 p-lg-5 pb-5" style={{ zIndex: 2, maxWidth: 600 }}>
          <h1 className="fw-bold text-white mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.2 }}>
            Make Your City Cleaner —<br />One Report at a Time
          </h1>
          <p className="text-white mb-4" style={{ fontSize: '.95rem', opacity: .88 }}>
            Join thousands of citizens fighting waste in their neighborhoods.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn fw-bold px-4 py-2"
              style={{ background: '#16a34a', color: '#fff', borderRadius: 8, border: 'none', fontSize: '.92rem' }}
              onClick={() => navigate('/user/report')}
            >
              Submit a Report
            </button>
            <button
              className="btn fw-bold px-4 py-2"
              style={{ background: 'transparent', color: '#fff', borderRadius: 8, border: '2px solid #fff', fontSize: '.92rem' }}
              onClick={() => navigate('/user/my-reports')}
            >
              Track My Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="bg-white shadow-sm" style={{ borderRadius: '0 0 16px 16px' }}>
        <div className="container py-4">
          <div className="row g-0">
            {[
              { value: '12,400+', label: 'Reports Submitted' },
              { value: '98',      label: 'Neighborhoods Covered' },
              { value: '8,700+', label: 'Issues Resolved' },
            ].map((s, i, arr) => (
              <div key={i} className={`col-4 text-center ${i < arr.length - 1 ? 'border-end' : ''}`}>
                <div className="fw-bold" style={{ fontSize: '1.4rem', color: '#16a34a' }}>{s.value}</div>
                <div className="text-secondary" style={{ fontSize: '.8rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ fontSize: '1.6rem', color: '#0f172a' }}>How It Works</h2>
          <div style={{ width: 48, height: 3, background: '#16a34a', borderRadius: 99, margin: '10px auto 0' }} />
        </div>
        <div className="row g-3">
          {[
            {
              icon: 'bi-camera',
              title: 'Step 1: Take a Photo',
              desc: 'Spot litter or waste? Open the app and snap a clear photo of the issue to help our teams locate it accurately.',
            },
            {
              icon: 'bi-send',
              title: 'Step 2: Submit Your Report',
              desc: 'Fill in a few quick details about the location and type of waste. Our system alerts the relevant local authorities immediately.',
            },
            {
              icon: 'bi-patch-check',
              title: 'Step 3: Watch It Get Resolved',
              desc: 'Track the progress of your report in real-time. Receive notifications and see the positive impact you\'ve made.',
            },
          ].map((step, i) => (
            <div key={i} className="col-md-4">
              <div className="card border shadow-none h-100 p-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: 48, height: 48, background: '#dcfce7' }}
                >
                  <i className={`bi ${step.icon}`} style={{ fontSize: '1.3rem', color: '#16a34a' }} />
                </div>
                <div className="fw-bold mb-2" style={{ fontSize: '.95rem', color: '#0f172a' }}>{step.title}</div>
                <div className="text-secondary" style={{ fontSize: '.85rem', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Reports Near You ── */}
      <div style={{ background: '#eef2f7' }}>
        <div className="container py-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.5rem', color: '#0f172a' }}>Reports Near You</h2>
              <p className="text-secondary mb-4" style={{ fontSize: '.88rem', lineHeight: 1.7 }}>
                Stay updated with cleaning activities across Cairo. Transparency in action—see where your community is making a difference.
              </p>
              <button
                className="btn fw-bold px-4 py-2 d-flex align-items-center gap-2"
                style={{ background: '#16a34a', color: '#fff', borderRadius: 8, border: 'none', fontSize: '.9rem' }}
                onClick={() => navigate('/user/my-reports')}
              >
                <i className="bi bi-map" /> View All Reports
              </button>
            </div>
            <div className="col-lg-7" style={{ height: 340 }}>
              <NearYouMap />
            </div>
          </div>
        </div>
      </div>

      {/* ── Community Champions ── */}
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#0f172a' }}>Community Champions</h2>
            <p className="text-secondary mb-0" style={{ fontSize: '.83rem' }}>Top citizens contributing to a cleaner Cairo this month.</p>
          </div>
          <button
            className="btn btn-link fw-semibold text-decoration-none d-flex align-items-center gap-1"
            style={{ color: '#16a34a', fontSize: '.85rem' }}
            onClick={() => navigate('/user/leaderboard')}
          >
            View Full Leaderboard ›
          </button>
        </div>

        <div className="card border shadow-none">
          {[
            { rank: 1, name: 'Ahmed Mansour',  area: 'HELIOPOLIS', pts: '2,450', badge: 'MASTER GUARDIAN',  img: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { rank: 2, name: 'Laila Ibrahim',  area: 'ZAMALEK',    pts: '1,920', badge: 'ELITE GUARDIAN',   img: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { rank: 3, name: 'Mostafa Hassan', area: 'MAADI',      pts: '1,580', badge: 'ELITE GUARDIAN',   img: 'https://randomuser.me/api/portraits/men/68.jpg' },
          ].map((c, i, arr) => (
            <div
              key={i}
              className="d-flex align-items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}
            >
              <span className="fw-bold text-secondary" style={{ width: 20, fontSize: '.9rem' }}>{c.rank}</span>
              <img src={c.img} alt={c.name} className="rounded-circle border" style={{ width: 44, height: 44, objectFit: 'cover' }} />
              <div className="flex-grow-1">
                <div className="fw-semibold" style={{ fontSize: '.9rem', color: '#0f172a' }}>{c.name}</div>
                <div className="text-secondary" style={{ fontSize: '.72rem', letterSpacing: '.06em' }}>{c.area}</div>
              </div>
              <div className="text-end">
                <div className="fw-bold" style={{ fontSize: '.9rem', color: '#0f172a' }}>{c.pts} pts</div>
                <span
                  className="badge rounded-pill fw-semibold"
                  style={{ background: '#dcfce7', color: '#15803d', fontSize: '.65rem', letterSpacing: '.04em' }}
                >{c.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}