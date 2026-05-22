import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const DUMMY_REPORT = {
  token:    'CC-9821-XM',
  title:    'Construction Waste on Maadi St',
  status:   'In Progress',
  location: 'Maadi, Cairo',
  progress: 65,
  lastUpdate: 'Today, 10:45 AM',
  img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=280&fit=crop',
  steps: [
    { label: 'Report Verified',        done: true  },
    { label: 'Cleanup Crew Dispatched', done: true  },
    { label: 'Active Site Clearance',  done: false },
  ],
}

export default function TrackReport() {
  const navigate = useNavigate()

  const [token,   setToken]   = useState('')
  const [report,  setReport]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSearch = () => {
    if (!token.trim()) { setError('Please enter a tracking token'); return }
    setError('')
    setLoading(true)

    // TODO: replace with API call → GET /reports/track/:token
    setTimeout(() => {
      if (token.toUpperCase() === DUMMY_REPORT.token) {
        setReport(DUMMY_REPORT)
      } else {
        // simulate found for demo
        setReport({ ...DUMMY_REPORT, token: token.toUpperCase() })
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 700 }}>

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-2" style={{ fontSize: '2rem', color: '#0f172a' }}>Track Your Report</h3>
          <p className="text-secondary" style={{ fontSize: '.9rem', maxWidth: 480, margin: '0 auto' }}>
            Enter the unique tracking token provided in your confirmation email to check the status of your civic report.
          </p>
        </div>

        {/* Search */}
        <div className="d-flex gap-2 mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-secondary" style={{ fontSize: '.85rem' }} />
            </span>
            <input
              type="text"
              className={`form-control border-start-0 ${error ? 'is-invalid' : ''}`}
              placeholder="Enter Token (e.g., CC-9821-XM)"
              style={{ fontSize: '.9rem' }}
              value={token}
              onChange={e => { setToken(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
          <button
            className="btn fw-bold px-4"
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, whiteSpace: 'nowrap', fontSize: '.9rem' }}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading
              ? <span className="spinner-border spinner-border-sm" />
              : 'Search'
            }
          </button>
        </div>

        {/* Report Card */}
        {report && (
          <div className="card border shadow-none mb-4" style={{ borderRadius: 12 }}>
            <div className="card-body p-4">

              {/* Report Details Header */}
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <div className="text-uppercase fw-bold mb-1" style={{ fontSize: '.65rem', color: '#16a34a', letterSpacing: '.1em' }}>
                    Report Details
                  </div>
                  <h5 className="fw-bold mb-0" style={{ fontSize: '1.15rem', color: '#0f172a' }}>{report.title}</h5>
                </div>
                <span
                  className="badge rounded-pill fw-semibold px-3 py-2"
                  style={{ background: '#fef3c7', color: '#d97706', fontSize: '.78rem' }}
                >
                  {report.status}
                </span>
              </div>

              {/* Image + Progress */}
              <div className="row g-3 align-items-start">

                {/* Image */}
                <div className="col-md-5">
                  <div className="rounded-3 overflow-hidden position-relative" style={{ height: 200 }}>
                    <img src={report.img} alt={report.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {/* Location overlay */}
                    <div
                      className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-2 d-flex align-items-center gap-1"
                      style={{ background: 'rgba(255,255,255,.9)', fontSize: '.75rem', fontWeight: 500, color: '#334155' }}
                    >
                      <i className="bi bi-geo-alt-fill" style={{ color: '#16a34a', fontSize: '.72rem' }} />
                      {report.location}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="col-md-7">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-semibold" style={{ fontSize: '.85rem', color: '#334155' }}>Resolution Progress</span>
                    <span className="fw-bold" style={{ fontSize: '1.1rem', color: '#16a34a' }}>{report.progress}%</span>
                  </div>
                  <div className="progress mb-3" style={{ height: 8, borderRadius: 99, background: '#e2e8f0' }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${report.progress}%`, background: '#16a34a', borderRadius: 99 }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    {report.steps.map((s, i) => (
                      <div key={i} className="d-flex align-items-center gap-2">
                        {s.done
                          ? <i className="bi bi-check-circle-fill" style={{ color: '#16a34a', fontSize: '1rem' }} />
                          : <i className="bi bi-circle" style={{ color: '#cbd5e1', fontSize: '1rem' }} />
                        }
                        <span style={{ fontSize: '.85rem', color: s.done ? '#0f172a' : '#94a3b8', fontWeight: s.done ? 500 : 400 }}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-2 d-flex align-items-center justify-content-between">
                    <div>
                      <div className="text-uppercase text-secondary fw-bold" style={{ fontSize: '.62rem', letterSpacing: '.07em' }}>Last Update</div>
                      <div style={{ fontSize: '.83rem', color: '#334155' }}>{report.lastUpdate}</div>
                    </div>
                    <button
                      className="btn btn-link fw-semibold text-decoration-none d-flex align-items-center gap-1"
                      style={{ color: '#16a34a', fontSize: '.83rem' }}
                    >
                      View Log <i className="bi bi-arrow-right" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div
          className="rounded-3 p-4 d-flex align-items-center justify-content-between flex-wrap gap-3"
          style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}
        >
          <div>
            <div className="fw-bold text-white mb-1" style={{ fontSize: '1rem' }}>Get instant notifications</div>
            <div className="text-white" style={{ fontSize: '.83rem', opacity: .85 }}>
              Create an account to receive real-time updates and earn points for your contributions.
            </div>
          </div>
          <button
            className="btn fw-bold px-4 py-2 flex-shrink-0"
            style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem' }}
            onClick={() => navigate('/register')}
          >
            Create an account
          </button>
        </div>

      </div>
    </div>
  )
}