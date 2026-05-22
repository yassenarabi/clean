import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════
//  DUMMY DATA
// ══════════════════════════════════════
const TOP3 = [
  { rank: 2, name: 'Ahmed Ali',   city: 'CAIRO',      badge: '2ND PLACE',       pts: 12450, img: 'https://randomuser.me/api/portraits/men/32.jpg',   borderColor: '#94a3b8', size: 80  },
  { rank: 1, name: 'Layla Hassan',city: 'GIZA',       badge: 'COMMUNITY HERO',  pts: 15800, img: 'https://randomuser.me/api/portraits/women/44.jpg',  borderColor: '#f59e0b', size: 100 },
  { rank: 3, name: 'Omar Zayed',  city: 'ALEXANDRIA', badge: '3RD PLACE',       pts: 10120, img: 'https://randomuser.me/api/portraits/men/68.jpg',   borderColor: '#d97706', size: 80  },
]

const RANKINGS = [
  { rank: 4,  name: 'Mona Refaat',   city: 'Cairo',     reports: 84, resolved: 79, pts: 8950,  img: 'https://randomuser.me/api/portraits/women/26.jpg'  },
  { rank: 5,  name: 'Karim Ibrahim', city: 'Giza',      reports: 72, resolved: 68, pts: 7820,  img: 'https://randomuser.me/api/portraits/men/45.jpg'    },
  { rank: 6,  name: 'Fatima Nour',   city: 'Mansoura',  reports: 65, resolved: 60, pts: 6400,  img: 'https://randomuser.me/api/portraits/women/55.jpg'  },
  { rank: 7,  name: 'Youssef Adly',  city: 'Alexandria',reports: 58, resolved: 52, pts: 5910,  img: 'https://randomuser.me/api/portraits/men/72.jpg'    },
  { rank: 8,  name: 'Nour Salem',    city: 'Cairo',     reports: 50, resolved: 47, pts: 5200,  img: 'https://randomuser.me/api/portraits/women/33.jpg'  },
  { rank: 9,  name: 'Hassan Fathy',  city: 'Giza',      reports: 44, resolved: 40, pts: 4750,  img: 'https://randomuser.me/api/portraits/men/15.jpg'    },
  { rank: 10, name: 'Dina Mostafa',  city: 'Mansoura',  reports: 38, resolved: 35, pts: 4100,  img: 'https://randomuser.me/api/portraits/women/62.jpg'  },
]

const CITIES = ['All Cities', 'Cairo', 'Giza', 'Alexandria', 'Mansoura']

const MY_RANK = { rank: 142, pts: 2840, name: 'Ahmed', img: 'https://randomuser.me/api/portraits/men/32.jpg' }

export default function Leaderboard() {
  const navigate    = useNavigate()
  const [city, setCity] = useState('All Cities')
  const [showAll, setShowAll] = useState(false)

  const filtered = RANKINGS.filter(r => city === 'All Cities' || r.city === city)
  const visible  = showAll ? filtered : filtered.slice(0, 4)

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container py-4" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1" style={{ fontSize: '2rem', color: '#0f172a' }}>Community Champions</h2>
          <p className="text-secondary" style={{ fontSize: '.9rem' }}>Celebrating the citizens making Cairo cleaner, one report at a time.</p>
        </div>

        {/* ── Top 3 Podium ── */}
        <div className="card border-0 shadow-none mb-4 p-4" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 16 }}>
          <div className="d-flex align-items-end justify-content-center gap-4 flex-wrap">
            {TOP3.map((u, i) => (
              <div key={i} className="d-flex flex-column align-items-center gap-2" style={{ marginBottom: u.rank === 1 ? 0 : 20 }}>

                {/* Avatar */}
                <div className="position-relative">
                  <img
                    src={u.img}
                    alt={u.name}
                    className="rounded-circle"
                    style={{
                      width: u.size, height: u.size,
                      objectFit: 'cover',
                      border: `4px solid ${u.borderColor}`,
                      boxShadow: u.rank === 1 ? '0 4px 20px rgba(245,158,11,.4)' : 'none',
                    }}
                  />
                  {/* Medal */}
                  <div
                    className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: 26, height: 26,
                      background: u.rank === 1 ? '#f59e0b' : u.rank === 2 ? '#94a3b8' : '#d97706',
                      fontSize: '.7rem', border: '2px solid #fff',
                    }}
                  >
                    {u.rank === 1 ? '🏆' : u.rank}
                  </div>
                </div>

                {/* Name */}
                <div className="text-center">
                  <div className="fw-bold" style={{ fontSize: u.rank === 1 ? '1.05rem' : '.9rem', color: '#0f172a' }}>{u.name}</div>
                  <div className="fw-bold text-uppercase" style={{ fontSize: '.65rem', color: '#16a34a', letterSpacing: '.07em' }}>
                    {u.badge} • {u.city}
                  </div>
                </div>

                {/* Points */}
                <span
                  className="badge rounded-pill fw-bold px-3 py-1"
                  style={{
                    background: u.rank === 1 ? '#16a34a' : '#e2e8f0',
                    color: u.rank === 1 ? '#fff' : '#475569',
                    fontSize: '.8rem',
                  }}
                >
                  {u.pts.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ranking Table ── */}
        <div className="card border shadow-none" style={{ borderRadius: 12 }}>
          <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <span className="fw-bold" style={{ fontSize: '.95rem' }}>Ranking Leaderboard</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', fontSize: '.83rem', borderRadius: 8 }}
              value={city}
              onChange={e => setCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c}>{c === 'All Cities' ? 'Filter by City: All Cities' : c}</option>)}
            </select>
          </div>

          {/* Table Header */}
          <div className="px-4 py-2 d-flex align-items-center" style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 60, fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Rank</div>
            <div className="flex-grow-1" style={{ fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Citizen</div>
            <div style={{ width: 120, fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em' }}>City</div>
            <div style={{ width: 140, fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Report Stats</div>
            <div style={{ width: 80, fontSize: '.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: 'right' }}>Points</div>
          </div>

          {/* Rows */}
          {visible.map((r, i) => (
            <div
              key={r.rank}
              className="px-4 py-3 d-flex align-items-center"
              style={{ borderBottom: i < visible.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 60, fontWeight: 700, fontSize: '.9rem', color: '#334155' }}>#{r.rank}</div>
              <div className="flex-grow-1 d-flex align-items-center gap-2">
                <img src={r.img} alt={r.name} className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                <span className="fw-semibold" style={{ fontSize: '.88rem', color: '#0f172a' }}>{r.name}</span>
              </div>
              <div style={{ width: 120, fontSize: '.85rem', color: '#475569' }}>{r.city}</div>
              <div style={{ width: 140 }} className="d-flex align-items-center gap-2">
                <span className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '.78rem' }}>
                  <i className="bi bi-file-text" style={{ fontSize: '.72rem' }} />{r.reports}
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: '.78rem', color: '#16a34a' }}>
                  <i className="bi bi-eye" style={{ fontSize: '.72rem' }} />{r.resolved}
                </span>
              </div>
              <div style={{ width: 80, fontWeight: 700, fontSize: '.9rem', color: '#0f172a', textAlign: 'right' }}>
                {r.pts.toLocaleString()}
              </div>
            </div>
          ))}

          {/* View Full */}
          {!showAll && filtered.length > 4 && (
            <div className="text-center py-3 border-top">
              <button
                className="btn btn-link fw-semibold text-decoration-none"
                style={{ color: '#16a34a', fontSize: '.88rem' }}
                onClick={() => setShowAll(true)}
              >
                View Full Leaderboard
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div
        className="position-fixed bottom-0 start-0 end-0 d-flex align-items-center justify-content-between px-4 py-2"
        style={{ background: '#0f172a', zIndex: 200, height: 64 }}
      >
        <div className="d-flex align-items-center gap-3">
          {/* Rank badge */}
          <span
            className="badge rounded-pill fw-bold px-2 py-1"
            style={{ background: '#16a34a', fontSize: '.75rem' }}
          >
            #{MY_RANK.rank}
          </span>
          <img src={MY_RANK.img} alt="me" className="rounded-circle border border-secondary"
            style={{ width: 36, height: 36, objectFit: 'cover' }} />
          <div>
            <div className="fw-bold text-white" style={{ fontSize: '.85rem' }}>Your Rank</div>
            <div className="text-secondary" style={{ fontSize: '.72rem' }}>Keep going! You're in the top 5% of Cairo.</div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="text-end">
            <div className="text-secondary" style={{ fontSize: '.65rem', letterSpacing: '.07em', textTransform: 'uppercase' }}>Points</div>
            <div className="fw-bold text-white" style={{ fontSize: '1.2rem' }}>{MY_RANK.pts.toLocaleString()}</div>
          </div>
          <button
            className="btn fw-bold px-4"
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.88rem' }}
            onClick={() => navigate('/user/dashboard')}
          >
            My Stats
          </button>
        </div>
      </div>

    </div>
  )
}