import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function UserNavbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-bottom px-4 d-flex align-items-center justify-content-between" style={{ height: 56, position: 'sticky', top: 0, zIndex: 100 }}>

      {/* Brand */}
      <Link to="/user" className="fw-bold text-decoration-none" style={{ fontSize: '1.1rem', color: '#15803d' }}>
        CleanCity
      </Link>

      {/* Nav Links */}
      <div className="d-none d-md-flex align-items-center gap-4">
        {[
          { to: '/user/dashboard',   label: 'Dashboard'   },
          { to: '/user/leaderboard', label: 'Leaderboard' },
          { to: '/user/how-it-works',label: 'How It Works'},
        ].map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className="text-decoration-none"
            style={({ isActive }) => ({
              fontSize: '.88rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#15803d' : '#475569',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center gap-3">

        {/* Report Now */}
        <button
          className="btn fw-semibold px-4"
          style={{ background: '#15803d', color: '#fff', borderRadius: 8, fontSize: '.88rem', border: 'none' }}
          onClick={() => navigate('/user/report')}
        >
          Report Now
        </button>

        {/* Bell */}
        <button
          className="btn p-1 border-0 bg-transparent position-relative"
          onClick={() => navigate('/user/notifications')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#64748b" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
          </svg>
          <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width: 7, height: 7, top: 2, right: 2 }} />
        </button>

        {/* Avatar */}
        <div
          className="rounded-circle overflow-hidden border"
          style={{ width: 32, height: 32, cursor: 'pointer' }}
          onClick={() => navigate('/user/profile')}
        >
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ background: 'linear-gradient(135deg,#15803d,#065f46)', fontSize: '.72rem' }}>
            U
          </div>
        </div>

      </div>
    </nav>
  )
}