import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { leaderboardService, citiesService } from './../../services/api.js'

export default function Leaderboard() {
  const navigate = useNavigate()

  const [allEntries,  setAllEntries]  = useState([])
  const [cities,      setCities]      = useState([])
  const [cityId,      setCityId]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [showAll,     setShowAll]     = useState(false)

  // ── Fetch cities for filter dropdown ──
  useEffect(() => {
    citiesService.getAll()
      .then(res => setCities(res.data.data || res.data || []))
      .catch(() => {}) // non-critical
  }, [])

  // ── Fetch leaderboard whenever city filter changes ──
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)
        setShowAll(false)

        const params = { limit: 50 }
        if (cityId) params.city_id = cityId

        const res = await leaderboardService.getAll(params)
        const raw = res.data.data?.users ?? res.data.users ?? res.data.data ?? res.data ?? []
        setAllEntries(Array.isArray(raw) ? raw : Object.values(raw))
      } catch (err) {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [cityId])

  // ── Derive top 3 and rest ──
  const top3Raw  = allEntries.slice(0, 3)
  const rest     = allEntries.slice(3)
  const visible  = showAll ? rest : rest.slice(0, 4)

  // Podium order: 2nd, 1st, 3rd
  const podium = top3Raw.length === 3
    ? [top3Raw[1], top3Raw[0], top3Raw[2]]
    : top3Raw

  const podiumMeta = [
    { badge: '2ND PLACE',      borderColor: '#94a3b8', size: 80,  medalBg: '#94a3b8' },
    { badge: 'COMMUNITY HERO', borderColor: '#f59e0b', size: 100, medalBg: '#f59e0b' },
    { badge: '3RD PLACE',      borderColor: '#d97706', size: 80,  medalBg: '#d97706' },
  ]

  // ── My rank (last entry if API returns current user's position) ──
  const myEntry = allEntries.find(e => e.is_current_user)

  // ── Helpers ──
  const avatar = (user) =>
    user?.avatar || user?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '?')}&background=16a34a&color=fff`

  if (loading) return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status" />
        <p className="text-secondary">Loading leaderboard...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }} />
        <h5 className="mt-3 text-danger">{error}</h5>
        <button className="btn btn-success mt-3" onClick={() => setCityId('')}>Retry</button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="container py-4" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1" style={{ fontSize: '2rem', color: '#0f172a' }}>Community Champions</h2>
          <p className="text-secondary" style={{ fontSize: '.9rem' }}>Celebrating the citizens making our city cleaner, one report at a time.</p>
        </div>

        {/* ── Top 3 Podium ── */}
        {podium.length > 0 && (
          <div className="card border-0 shadow-none mb-4 p-4" style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', borderRadius: 16 }}>
            <div className="d-flex align-items-end justify-content-center gap-4 flex-wrap">
              {podium.map((u, i) => {
                const meta = podiumMeta[i]
                const isFirst = u.rank === 1
                return (
                  <div key={u.rank ?? i} className="d-flex flex-column align-items-center gap-2" style={{ marginBottom: isFirst ? 0 : 20 }}>

                    {/* Avatar */}
                    <div className="position-relative">
                      <img
                        src={avatar(u.user ?? u)}
                        alt={u.user?.name ?? u.name}
                        className="rounded-circle"
                        style={{
                          width: meta.size, height: meta.size,
                          objectFit: 'cover',
                          border: `4px solid ${meta.borderColor}`,
                          boxShadow: isFirst ? '0 4px 20px rgba(245,158,11,.4)' : 'none',
                        }}
                      />
                      {/* Medal */}
                      <div
                        className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: 26, height: 26, background: meta.medalBg, fontSize: '.7rem', border: '2px solid #fff' }}
                      >
                        {isFirst ? '🏆' : u.rank}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <div className="fw-bold" style={{ fontSize: isFirst ? '1.05rem' : '.9rem', color: '#0f172a' }}>
                        {u.user?.name ?? u.name}
                      </div>
                      <div className="fw-bold text-uppercase" style={{ fontSize: '.65rem', color: '#16a34a', letterSpacing: '.07em' }}>
                        {meta.badge} • {u.user?.city?.name ?? u.city ?? ''}
                      </div>
                    </div>

                    {/* Points */}
                    <span
                      className="badge rounded-pill fw-bold px-3 py-1"
                      style={{ background: isFirst ? '#16a34a' : '#e2e8f0', color: isFirst ? '#fff' : '#475569', fontSize: '.8rem' }}
                    >
                      {(u.points ?? u.pts ?? 0).toLocaleString()} pts
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Ranking Table ── */}
        <div className="card border shadow-none" style={{ borderRadius: 12 }}>
          <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
            <span className="fw-bold" style={{ fontSize: '.95rem' }}>Ranking Leaderboard</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', fontSize: '.83rem', borderRadius: 8 }}
              value={cityId}
              onChange={e => setCityId(e.target.value)}
            >
              <option value="">Filter by City: All Cities</option>
              {cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
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

          {/* Empty state */}
          {rest.length === 0 && (
            <div className="text-center py-5 text-secondary" style={{ fontSize: '.88rem' }}>
              <i className="bi bi-trophy" style={{ fontSize: '2rem', opacity: .3 }} />
              <div className="mt-2">No rankings available yet</div>
            </div>
          )}

          {/* Rows */}
          {visible.map((r, i) => (
            <div
              key={r.rank ?? i}
              className="px-4 py-3 d-flex align-items-center"
              style={{ borderBottom: i < visible.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 60, fontWeight: 700, fontSize: '.9rem', color: '#334155' }}>#{r.rank}</div>
              <div className="flex-grow-1 d-flex align-items-center gap-2">
                <img src={avatar(r.user ?? r)} alt={r.user?.name ?? r.name} className="rounded-circle"
                  style={{ width: 36, height: 36, objectFit: 'cover' }} />
                <span className="fw-semibold" style={{ fontSize: '.88rem', color: '#0f172a' }}>{r.user?.name ?? r.name}</span>
              </div>
              <div style={{ width: 120, fontSize: '.85rem', color: '#475569' }}>
                {r.user?.city?.name ?? r.city ?? '—'}
              </div>
              <div style={{ width: 140 }} className="d-flex align-items-center gap-2">
                <span className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '.78rem' }}>
                  <i className="bi bi-file-text" style={{ fontSize: '.72rem' }} />
                  {r.reports_count ?? r.reports ?? 0}
                </span>
                <span className="d-flex align-items-center gap-1" style={{ fontSize: '.78rem', color: '#16a34a' }}>
                  <i className="bi bi-check-circle" style={{ fontSize: '.72rem' }} />
                  {r.resolved_count ?? r.resolved ?? 0}
                </span>
              </div>
              <div style={{ width: 80, fontWeight: 700, fontSize: '.9rem', color: '#0f172a', textAlign: 'right' }}>
                {(r.points ?? r.pts ?? 0).toLocaleString()}
              </div>
            </div>
          ))}

          {/* View Full */}
          {!showAll && rest.length > 4 && (
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

      {/* ── Sticky Bottom Bar (only if current user has a rank) ── */}
      {myEntry && (
        <div
          className="position-fixed bottom-0 start-0 end-0 d-flex align-items-center justify-content-between px-4 py-2"
          style={{ background: '#0f172a', zIndex: 200, height: 64 }}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="badge rounded-pill fw-bold px-2 py-1" style={{ background: '#16a34a', fontSize: '.75rem' }}>
              #{myEntry.rank}
            </span>
            <img src={avatar(myEntry.user ?? myEntry)} alt="me" className="rounded-circle border border-secondary"
              style={{ width: 36, height: 36, objectFit: 'cover' }} />
            <div>
              <div className="fw-bold text-white" style={{ fontSize: '.85rem' }}>Your Rank</div>
              <div className="text-secondary" style={{ fontSize: '.72rem' }}>Keep going! You're climbing the leaderboard.</div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="text-end">
              <div className="text-secondary" style={{ fontSize: '.65rem', letterSpacing: '.07em', textTransform: 'uppercase' }}>Points</div>
              <div className="fw-bold text-white" style={{ fontSize: '1.2rem' }}>
                {(myEntry.points ?? myEntry.pts ?? 0).toLocaleString()}
              </div>
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
      )}

    </div>
  )
}