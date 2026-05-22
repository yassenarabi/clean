import { useEffect, useRef, useState } from 'react'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const STATS = [
  { label: 'Reports Resolved',     value: '342'   },
  { label: 'Avg. Resolution Time', value: '3.8h'  },
  { label: 'Citizen Satisfaction', value: '4.8/5' },
  { label: 'Reports Rejected',     value: '12'    },
]

const BAR_DATA = [28,35,42,55,48,38,30,25,44,50,58,45,40,35,62]
const BAR_LABELS = ['140 AGO','','','','','','70 AGO','','','','','','','','TODAY']

const SEVERITY = [
  { label: 'Low',      pct: 45, color: '#0d6efd' },
  { label: 'Medium',   pct: 30, color: '#f59e0b' },
  { label: 'High',     pct: 15, color: '#ef4444' },
  { label: 'Critical', pct: 10, color: '#7c3aed' },
]

const RATINGS = [
  { star: 5, pct: 85, color: '#16a34a' },
  { star: 4, pct: 10, color: '#22c55e' },
  { star: 3, pct: 3,  color: '#fbbf24' },
  { star: 2, pct: 1,  color: '#f97316' },
  { star: 1, pct: 1,  color: '#ef4444' },
]

const TEAMS = [
  { initials: 'NE', name: 'North-East Fleet',   resolved: 142, avgTime: '3.2h', rating: 4.9, color: '#0d6efd' },
  { initials: 'DW', name: 'Downtown Walkers',   resolved: 108, avgTime: '3.5h', rating: 4.8, color: '#16a34a' },
  { initials: 'SZ', name: 'South Zone B',        resolved: 92,  avgTime: '4.1h', rating: 4.7, color: '#f59e0b' },
  { initials: 'WW', name: 'West Waterfront',     resolved: 86,  avgTime: '4.4h', rating: 4.6, color: '#94a3b8' },
]

// ══════════════════════════════════════
//  Donut Chart (SVG)
// ══════════════════════════════════════
function DonutChart({ segments, total }) {
  const cx = 80, cy = 80, r = 62, ri = 44
  const circumference = 2 * Math.PI * r
  const GAP = 2 // gap in degrees between segments

  let cumPct = 0
  const arcs = segments.map((s) => {
    const startPct = cumPct
    cumPct += s.pct
    return { ...s, startPct }
  })

  return (
    <svg width={160} height={160} viewBox="0 0 160 160">
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={r - ri} />

      {arcs.map((s, i) => {
        const gapDeg   = GAP
        const startDeg = (s.startPct / 100) * 360 - 90 + gapDeg / 2
        const sweepDeg = (s.pct / 100) * 360 - gapDeg
        const startRad = (startDeg * Math.PI) / 180
        const endRad   = ((startDeg + sweepDeg) * Math.PI) / 180
        const x1 = cx + r * Math.cos(startRad)
        const y1 = cy + r * Math.sin(startRad)
        const x2 = cx + r * Math.cos(endRad)
        const y2 = cy + r * Math.sin(endRad)
        const large = sweepDeg > 180 ? 1 : 0

        // Arc path (thick stroke approach)
        const x1i = cx + ri * Math.cos(startRad)
        const y1i = cy + ri * Math.sin(startRad)
        const x2i = cx + ri * Math.cos(endRad)
        const y2i = cy + ri * Math.sin(endRad)

        const d = [
          `M ${x1} ${y1}`,
          `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
          `L ${x2i} ${y2i}`,
          `A ${ri} ${ri} 0 ${large} 0 ${x1i} ${y1i}`,
          'Z'
        ].join(' ')

        return <path key={i} d={d} fill={s.color} />
      })}

      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={17} fontWeight="700" fill="#0f172a" fontFamily="Sora,sans-serif">
        {total.toLocaleString()}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="Sora,sans-serif" letterSpacing="1">
        TOTAL
      </text>
    </svg>
  )
}

// ══════════════════════════════════════
//  Bar Chart (SVG)
// ══════════════════════════════════════
function BarChart({ data, labels }) {
  const [hovered, setHovered] = useState(null)
  const max  = Math.max(...data)
  const W    = 620, H = 180, PAD = 10
  const barW = (W - PAD * 2) / data.length - 4

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%' }}>
      {data.map((v, i) => {
        const bh     = (v / max) * H
        const x      = PAD + i * ((W - PAD * 2) / data.length)
        const isLast = i === data.length - 1
        const isHov  = hovered === i
        return (
          <rect
            key={i}
            x={x}
            y={H - bh}
            width={barW}
            height={bh}
            rx={3}
            fill={isLast || isHov ? '#0d6efd' : '#bfdbfe'}
            style={{ cursor: 'pointer', transition: 'fill .15s' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        )
      })}
      {labels.map((l, i) => l ? (
        <text
          key={i}
          x={PAD + i * ((W - PAD * 2) / data.length) + barW / 2}
          y={H + 18}
          textAnchor="middle"
          fontSize={10}
          fill="#94a3b8"
        >{l}</text>
      ) : null)}
    </svg>
  )
}

// ══════════════════════════════════════
//  Main Page
// ══════════════════════════════════════
export default function Performance() {
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-3 sticky-top" style={{ height: 52 }}>
        <span className="fw-bold text-primary" style={{ fontSize: '1.05rem' }}>Performance Overview</span>
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
            >AP</div>
            <div style={{ lineHeight: 1.25 }}>
              <div className="fw-semibold" style={{ fontSize: '.8rem' }}>Admin Panel</div>
              <div className="text-secondary" style={{ fontSize: '.65rem' }}>Operations Lead</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">

        {/* ── Stat Cards ── */}
        <div className="row g-2 mb-3">
          {STATS.map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border shadow-none h-100">
                <div className="card-body p-3">
                  <div className="text-uppercase text-secondary mb-1" style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.06em' }}>{s.label}</div>
                  <div className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f172a' }}>{s.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Charts Row ── */}
        <div className="row g-3 mb-3">

          {/* Bar Chart */}
          <div className="col-12 col-lg-7">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold" style={{ fontSize: '.95rem' }}>Reports Resolved per Day</span>
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0d6efd' }} />
                    <span className="text-secondary" style={{ fontSize: '.78rem' }}>Resolved</span>
                  </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <div style={{ minWidth: 320 }}>
                    <BarChart data={BAR_DATA} labels={BAR_LABELS} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="col-12 col-lg-5">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="fw-bold mb-3" style={{ fontSize: '.95rem' }}>Severity Distribution</div>
                <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">
                  <DonutChart segments={SEVERITY} total={1248} />
                  <div className="d-flex flex-column gap-2">
                    {SEVERITY.map((s, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '.83rem', color: '#334155' }}>{s.label}</span>
                        </div>
                        <span className="fw-semibold" style={{ fontSize: '.83rem', color: '#1e293b' }}>{s.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div className="row g-3">

          {/* Rating Distribution */}
          <div className="col-lg-4">
            <div className="card border shadow-none h-100">
              <div className="card-body p-3">
                <div className="fw-bold mb-3" style={{ fontSize: '.95rem' }}>Rating Distribution</div>

                <div className="d-flex flex-column gap-2 mb-3">
                  {RATINGS.map((r, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '.8rem', color: '#64748b', width: 24, flexShrink: 0 }}>{r.star}★</span>
                      <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: 8, background: '#f1f5f9' }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: '.78rem', color: '#64748b', width: 30, textAlign: 'right' }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>

                {/* Impact Analysis */}
                <div className="rounded-3 p-3" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div className="fw-semibold text-primary mb-1" style={{ fontSize: '.82rem' }}>Impact Analysis</div>
                  <div className="text-secondary" style={{ fontSize: '.78rem', lineHeight: 1.5 }}>
                    High citizen satisfaction is directly correlated with the 12% reduction in resolution time this period.
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Top Performing Teams */}
          <div className="col-lg-8">
            <div className="card border shadow-none h-100">
              <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-2 px-3">
                <span className="fw-bold" style={{ fontSize: '.95rem' }}>Top Performing Teams</span>
                <button className="btn btn-link btn-sm p-0 text-primary fw-semibold text-decoration-none" style={{ fontSize: '.82rem' }}>View All Teams</button>
              </div>
              <div className="card-body p-0">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3" style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Team Name</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Resolved Count</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Avg Time</th>
                      <th style={{ fontSize: '.62rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em' }}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEAMS.map((t, i) => (
                      <tr key={i}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                              style={{ width: 34, height: 34, background: t.color, fontSize: '.72rem' }}
                            >{t.initials}</div>
                            <span className="fw-semibold" style={{ fontSize: '.87rem', color: '#1e293b' }}>{t.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '.87rem', color: '#334155' }}>{t.resolved}</td>
                        <td style={{ fontSize: '.87rem', color: '#334155' }}>{t.avgTime}</td>
                        <td>
                          <span className="fw-bold text-warning" style={{ fontSize: '.9rem' }}>
                            {t.rating} ★
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}