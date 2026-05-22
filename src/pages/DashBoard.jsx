import { useState } from 'react'
import { Link } from 'react-router-dom'

const STATS = {
  totalReports: 42,
  totalDelta: 5,
  inProgress: 12,
  inProgressMax: 20,
  resolvedToday: 8,
  avgResolutionTime: '4.5h',
  avgResolutionDelta: '12%',
  date: 'Monday, October 23, 2023',
}

const REPORTS = [
  { id: 1, title: 'Illegal Dumping #902',  severity: 'CRITICAL', address: '452 Oak St.',       assignedAt: '08:45 AM' },
  { id: 2, title: 'Overflowing Bin #884',  severity: 'HIGH',     address: '12 Market Sq.',     assignedAt: '09:12 AM' },
  { id: 3, title: 'Chemical Spill #881',   severity: 'CRITICAL', address: 'Ind. Park Zone C',  assignedAt: '09:30 AM' },
  { id: 4, title: 'Graffiti Removal #879', severity: 'LOW',      address: '88 East Avenue',    assignedAt: '10:05 AM' },
  { id: 5, title: 'Hazardous Waste #875',  severity: 'HIGH',     address: 'Pier 44 Warehouse', assignedAt: '10:15 AM' },
]

const ACTIVITIES = [
  { id: 1, color: '#22c55e', text: 'Field Team A moved <strong>Report #88</strong> to In Progress', time: '10 mins ago' },
  { id: 2, color: '#3b82f6', text: 'New assignment <strong>Report #902</strong> received',           time: '45 mins ago' },
  { id: 3, color: '#94a3b8', text: 'Shift change: <strong>Night Crew Alpha</strong> signed out',    time: '2 hours ago' },
]

const PINS = [
  { top: '35%', left: '45%', color: '#dc3545' },
  { top: '58%', left: '62%', color: '#0d6efd' },
  { top: '68%', left: '50%', color: '#ffc107' },
  { top: '42%', left: '55%', color: '#6c757d' },
]

const SEV_STYLE = {
  CRITICAL: { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' },
  HIGH:     { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
  LOW:      { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
  MEDIUM:   { background: '#dbeafe', color: '#2563eb', border: '1px solid #93c5fd' },
}

export default function Dashboard() {
  const [alertDismissed, setAlertDismissed] = useState(false)
  const barPct = Math.min((STATS.inProgress / STATS.inProgressMax) * 100, 100)

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-3 sticky-top" style={{ height: 52 }}>
        <span className="fw-bold text-primary" style={{ fontSize: '1rem' }}>CleanCity Dashboard</span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width: 7, height: 7, top: 2, right: 2 }} />
          </button>
          <div className="d-flex align-items-center gap-2 bg-light border rounded-pill" style={{ padding: '3px 12px 3px 3px' }}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
              style={{ width: 30, height: 30, fontSize: '.68rem', background: 'linear-gradient(135deg,#0d6efd,#6f42c1)' }}
            >ES</div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="fw-semibold" style={{ fontSize: '.8rem' }}>EcoServices Ltd</div>
              <div className="text-secondary" style={{ fontSize: '.65rem' }}>Fleet Manager</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">

        {/* Greeting */}
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#0f172a' }}>Good morning, EcoServices Ltd</h5>
            <small className="text-secondary">{STATS.date}</small>
          </div>
          <button className="btn btn-outline-secondary btn-sm">
            Filter View
          </button>
        </div>

        {/* Stat Cards */}
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Total Assigned Reports</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f172a' }}>{STATS.totalReports}</span>
                  <span className="fw-semibold rounded-pill px-2 py-0" style={{ fontSize: '.7rem', background: '#dcfce7', color: '#16a34a' }}>+{STATS.totalDelta} today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>In Progress</div>
                <span className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f172a' }}>{STATS.inProgress}</span>
                <div className="progress mt-2" style={{ height: 4 }}>
                  <div className="progress-bar" style={{ width: `${barPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Resolved Today</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f172a' }}>{STATS.resolvedToday}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#22c55e" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>Avg. Resolution Time</div>
                <div className="d-flex align-items-center gap-1 flex-wrap">
                  <span className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f172a' }}>{STATS.avgResolutionTime}</span>
                  <span className="fw-semibold" style={{ fontSize: '.7rem', color: '#dc2626' }}>↓{STATS.avgResolutionDelta} vs last week</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {!alertDismissed && (
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 mb-3"
            style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 8 }}
          >
            <div className="d-flex align-items-center gap-2" style={{ color: '#92400e', fontSize: '.88rem', fontWeight: 500 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f59e0b" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              You have 3 critical-severity reports pending action
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-sm fw-bold text-white px-3" style={{ background: '#ea580c', border: 'none', borderRadius: 6, fontSize: '.85rem' }}>
                View Now
              </button>
              <button className="btn-close" style={{ fontSize: '.7rem' }} onClick={() => setAlertDismissed(true)} />
            </div>
          </div>
        )}

        {/* Bottom Grid */}
        <div className="row g-3">

          {/* Table */}
          <div className="col-lg-7">
            <div className="card border shadow-none">
              <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-2 px-3">
                <span className="fw-bold" style={{ fontSize: '.93rem' }}>Recent Assignments</span>
                <button className="btn btn-link btn-sm p-0 text-primary fw-semibold text-decoration-none" style={{ fontSize: '.82rem' }}>See all activity</button>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3" style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Title</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Severity</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Address</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Assigned</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REPORTS.map((r) => {
                      const sev = SEV_STYLE[r.severity] || SEV_STYLE.LOW
                      return (
                        <tr key={r.id}>
                          <td className="ps-3 fw-semibold" style={{ fontSize: '.87rem', color: '#1e293b' }}>{r.title}</td>
                          <td>
                            <span className="fw-bold px-2 py-1 rounded-2" style={{ fontSize: '.65rem', letterSpacing: '.04em', ...sev }}>
                              {r.severity}
                            </span>
                          </td>
                          <td className="text-secondary" style={{ fontSize: '.85rem' }}>{r.address}</td>
                          <td style={{ fontSize: '.82rem', color: '#64748b', fontFamily: 'monospace' }}>{r.assignedAt}</td>
                          <td>
                            <button className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none" style={{ color: '#0d6efd', fontSize: '.85rem' }}>View</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity + Map */}
          <div className="col-lg-5">
            <div className="card border shadow-none">
              <div className="card-header bg-white border-bottom py-2 px-3">
                <span className="fw-bold" style={{ fontSize: '.93rem' }}>Today's Activity</span>
              </div>
              <div className="card-body p-0">

                {ACTIVITIES.map((a, i) => (
                  <div
                    key={a.id}
                    className="d-flex align-items-start gap-2 px-3 py-2"
                    style={{ borderBottom: i < ACTIVITIES.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                  >
                    <div className="rounded-circle flex-shrink-0" style={{ width: 10, height: 10, background: a.color, marginTop: 5 }} />
                    <div>
                      <div style={{ fontSize: '.84rem', color: '#334155', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: a.text }} />
                      <div className="text-secondary" style={{ fontSize: '.72rem' }}>{a.time}</div>
                    </div>
                  </div>
                ))}

                {/* Map */}
                <div className="border-top px-3 pt-2 pb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-uppercase text-secondary" style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em' }}>Operational Map Preview</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
                    </svg>
                  </div>
                  <div className="rounded-3 overflow-hidden position-relative" style={{ height: 145, background: 'linear-gradient(135deg,#dbeafe,#e0f2fe 50%,#dcfce7)' }}>
                    <div
                      className="position-absolute w-100 h-100"
                      style={{
                        backgroundImage: 'linear-gradient(#cbd5e1 1px,transparent 1px),linear-gradient(90deg,#cbd5e1 1px,transparent 1px)',
                        backgroundSize: '22px 22px',
                        opacity: .35,
                      }}
                    />
                    {PINS.map((p, i) => (
                      <div
                        key={i}
                        className="position-absolute rounded-circle border border-white"
                        style={{
                          top: p.top, left: p.left,
                          width: 13, height: 13,
                          background: p.color,
                          transform: 'translate(-50%,-50%)',
                          boxShadow: '0 2px 6px rgba(0,0,0,.25)',
                        }}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="d-flex align-items-center gap-3 mt-3">
          <button className="btn btn-primary fw-bold px-4">
            ✦ Generate Clean Route
          </button>
          <button className="btn btn-outline-secondary px-4">
         <Link to="reports" className='tst'>View All Reports</Link>
          </button>
        </div>

      </div>
    </div>
  )
}