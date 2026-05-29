import { useState, useEffect, useCallback } from 'react'
import { notificationsService } from './../../services/api.js'

// ── Map backend type → icon/color ──
const TYPE_META = {
  report_assigned:    { icon: 'bi-arrow-repeat',         iconBg: '#ede9fe', iconColor: '#7c3aed' },
  report_in_progress: { icon: 'bi-tools',                iconBg: '#dbeafe', iconColor: '#2563eb' },
  report_resolved:    { icon: 'bi-check-circle-fill',    iconBg: '#dcfce7', iconColor: '#16a34a' },
  report_rejected:    { icon: 'bi-x-circle-fill',        iconBg: '#fee2e2', iconColor: '#dc2626' },
  points_earned:      { icon: 'bi-star-fill',            iconBg: '#fef3c7', iconColor: '#d97706' },
  upvote:             { icon: 'bi-hand-thumbs-up-fill',  iconBg: '#dbeafe', iconColor: '#2563eb' },
  general:            { icon: 'bi-bell-fill',            iconBg: '#f1f5f9', iconColor: '#64748b' },
}

const getMeta = (type) => TYPE_META[type] || TYPE_META.general

// ── Map backend type → tab category ──
const TAB_FILTER = {
  'All':               () => true,
  'Report updates':    n => ['report_assigned','report_in_progress','report_resolved','report_rejected'].includes(n.type),
  'Points earned':     n => n.type === 'points_earned',
  'Community upvotes': n => n.type === 'upvote',
}

const TABS = Object.keys(TAB_FILTER)

// ── Relative time helper ──
const relativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins} min${mins > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7)   return days === 1 ? 'Yesterday' : `${days} days ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function Notifications() {
  const [notifs,      setNotifs]      = useState([])
  const [activeTab,   setActiveTab]   = useState('All')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [page,        setPage]        = useState(1)
  const [hasMore,     setHasMore]     = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // ── Fetch notifications ──
  const fetchNotifs = useCallback(async (pageNum = 1, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true)
      setError(null)

      const res  = await notificationsService.getAll({ page: pageNum })
      const data = res.data.data ?? res.data
      const list = data.data ?? data ?? []
      const meta = data.meta ?? data

      setNotifs(prev => append ? [...prev, ...list] : list)
      setHasMore(meta?.current_page < meta?.last_page || list.length === 20)
    } catch {
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchNotifs(1) }, [fetchNotifs])

  // ── Mark single as read ──
  const markRead = async (id) => {
    const notif = notifs.find(n => n.id === id)
    if (notif?.is_read) return
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    try {
      await notificationsService.markAsRead(id)
    } catch {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: false } : n))
    }
  }

  // ── Mark all as read ──
  const markAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
    try {
      await notificationsService.markAllAsRead()
    } catch {
      fetchNotifs(1)
    }
  }

  // ── Load more ──
  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchNotifs(next, true)
  }

  const filtered  = notifs.filter(TAB_FILTER[activeTab])
  const unreadCnt = notifs.filter(n => !n.is_read).length

  if (loading) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-success mb-3" role="status" />
        <p className="text-secondary">Loading notifications...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }} className="d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }} />
        <h5 className="mt-3 text-danger">{error}</h5>
        <button className="btn btn-success mt-3" onClick={() => fetchNotifs(1)}>Retry</button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4" style={{ maxWidth: 760 }}>

        {/* Header */}
        <div className="d-flex align-items-start justify-content-between mb-2 flex-wrap gap-2">
          <div>
            <h3 className="fw-bold mb-1" style={{ fontSize: '1.8rem', color: '#0f172a' }}>Notifications</h3>
            <p className="text-secondary mb-0" style={{ fontSize: '.88rem' }}>
              Stay updated with your community impact and report status.
            </p>
          </div>
          {unreadCnt > 0 && (
            <button
              className="btn btn-link fw-semibold text-decoration-none d-flex align-items-center gap-1 p-0 mt-1"
              style={{ color: '#16a34a', fontSize: '.85rem' }}
              onClick={markAllRead}
            >
              <i className="bi bi-check2-all" /> Mark all as read ({unreadCnt})
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {TABS.map(tab => (
            <button
              key={tab}
              className="btn btn-sm fw-semibold rounded-pill px-3"
              style={{
                background: activeTab === tab ? '#16a34a' : '#fff',
                color:      activeTab === tab ? '#fff'    : '#475569',
                border:     activeTab === tab ? 'none'    : '1.5px solid #e2e8f0',
                fontSize:   '.82rem',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="d-flex flex-column gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-5 text-secondary">
              <i className="bi bi-bell-slash" style={{ fontSize: '2.5rem', opacity: .3 }} />
              <div className="mt-2" style={{ fontSize: '.9rem' }}>No notifications</div>
            </div>
          )}

          {filtered.map(n => {
            const meta = getMeta(n.type)
            return (
              <div
                key={n.id}
                className="card border shadow-none"
                style={{
                  borderRadius: 12,
                  borderLeft: !n.is_read ? '3px solid #16a34a' : '3px solid transparent',
                  background: !n.is_read ? '#fff' : '#fafafa',
                  cursor: 'pointer',
                }}
                onClick={() => markRead(n.id)}
              >
                <div className="card-body p-3">
                  <div className="d-flex align-items-start gap-3">

                    {/* Icon */}
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 42, height: 42, background: meta.iconBg }}
                    >
                      <i className={`bi ${meta.icon}`} style={{ fontSize: '1rem', color: meta.iconColor }} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-start justify-content-between mb-1">
                        <span className="fw-semibold" style={{ fontSize: '.88rem', color: '#0f172a' }}>{n.title}</span>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                          <span className="text-secondary" style={{ fontSize: '.75rem' }}>
                            {relativeTime(n.created_at)}
                          </span>
                          {!n.is_read && (
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: '.85rem', color: '#475569', lineHeight: 1.5 }}>{n.message}</div>
                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        {hasMore && filtered.length > 0 && (
          <div className="text-center mt-4">
            <button
              className="btn fw-semibold px-5"
              style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 99, fontSize: '.85rem' }}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore
                ? <><span className="spinner-border spinner-border-sm me-2" />Loading...</>
                : 'Load older notifications'
              }
            </button>
          </div>
        )}

      </div>
    </div>
  )
}