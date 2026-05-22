import { useState } from 'react'

const NOTIFS = [
  {
    id: 1, type: 'report',    read: false,
    icon: 'bi-check-circle-fill', iconBg: '#dcfce7', iconColor: '#16a34a',
    title: 'Report Update',
    desc: 'Your report has been resolved! The disposal site at Maadi St. 9 has been cleared by the local team.',
    time: '2 mins ago',
    img: null,
  },
  {
    id: 2, type: 'points',    read: false,
    icon: 'bi-star-fill', iconBg: '#fef3c7', iconColor: '#d97706',
    title: 'Points Earned',
    descHtml: 'You earned <span style="color:#16a34a;font-weight:700">+50 points</span> for confirming the completion of a nearby cleanup activity.',
    time: '1 hour ago',
    img: null,
  },
  {
    id: 3, type: 'upvotes',   read: true,
    icon: 'bi-hand-thumbs-up-fill', iconBg: '#dbeafe', iconColor: '#2563eb',
    title: 'Community Support',
    desc: '15 neighbors upvoted your report about the broken street lights in Heliopolis. Visibility increased!',
    time: '3 hours ago',
    img: null,
  },
  {
    id: 4, type: 'report',    read: true,
    icon: 'bi-arrow-repeat', iconBg: '#ede9fe', iconColor: '#7c3aed',
    title: 'Civic Progress',
    desc: 'Cairo is looking cleaner! Check out the weekly impact report for your district.',
    time: 'Yesterday',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=200&fit=crop',
    imgLabel: 'Zamalek District: 92% Cleanup Completion',
  },
  {
    id: 5, type: 'points',    read: false,
    icon: 'bi-award-fill', iconBg: '#dcfce7', iconColor: '#16a34a',
    title: 'New Badge Unlocked',
    desc: 'Congratulations! You\'ve been awarded the "Street Sentinel" badge for your 10th verified report.',
    time: 'Yesterday',
    img: null,
  },
  {
    id: 6, type: 'report',    read: true,
    icon: 'bi-clock-fill', iconBg: '#f1f5f9', iconColor: '#64748b',
    title: 'Report Status',
    desc: "Your report regarding 'Water Leak' has been assigned to a maintenance crew.",
    time: '2 days ago',
    img: null,
  },
]

const TABS = ['All', 'Report updates', 'Points earned', 'Community upvotes']

const TAB_FILTER = {
  'All':               () => true,
  'Report updates':    n => n.type === 'report',
  'Points earned':     n => n.type === 'points',
  'Community upvotes': n => n.type === 'upvotes',
}

export default function Notifications() {
  const [notifs,    setNotifs]    = useState(NOTIFS)
  const [activeTab, setActiveTab] = useState('All')

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  const markRead    = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  const filtered  = notifs.filter(TAB_FILTER[activeTab])
  const unreadCnt = notifs.filter(n => !n.read).length

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
              <i className="bi bi-check2-all" /> Mark all as read
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

          {filtered.map(n => (
            <div
              key={n.id}
              className="card border shadow-none"
              style={{
                borderRadius: 12,
                borderLeft: !n.read ? '3px solid #16a34a' : '3px solid transparent',
                background: !n.read ? '#fff' : '#fafafa',
                cursor: 'pointer',
              }}
              onClick={() => markRead(n.id)}
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-start gap-3">

                  {/* Icon */}
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 42, height: 42, background: n.iconBg }}
                  >
                    <i className={`bi ${n.icon}`} style={{ fontSize: '1rem', color: n.iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-start justify-content-between mb-1">
                      <span className="fw-semibold" style={{ fontSize: '.88rem', color: '#0f172a' }}>{n.title}</span>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
                        <span className="text-secondary" style={{ fontSize: '.75rem' }}>{n.time}</span>
                        {!n.read && (
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                        )}
                      </div>
                    </div>

                    {n.descHtml
                      ? <div style={{ fontSize: '.85rem', color: '#475569', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: n.descHtml }} />
                      : <div style={{ fontSize: '.85rem', color: '#475569', lineHeight: 1.5 }}>{n.desc}</div>
                    }

                    {/* Image */}
                    {n.img && (
                      <div className="position-relative mt-2 rounded-3 overflow-hidden" style={{ height: 140 }}>
                        <img src={n.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {n.imgLabel && (
                          <div
                            className="position-absolute bottom-0 start-0 end-0 px-3 py-2 fw-semibold text-white"
                            style={{ background: 'linear-gradient(transparent,rgba(0,0,0,.6))', fontSize: '.8rem' }}
                          >
                            {n.imgLabel}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filtered.length > 0 && (
          <div className="text-center mt-4">
            <button
              className="btn fw-semibold px-5"
              style={{ border: '1.5px solid #e2e8f0', background: '#fff', color: '#334155', borderRadius: 99, fontSize: '.85rem' }}
            >
              Load older notifications
            </button>
          </div>
        )}

      </div>
    </div>
  )
}