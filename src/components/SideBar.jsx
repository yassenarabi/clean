import { NavLink } from 'react-router-dom'

const navStyle = (isActive) => ({
  borderRight: isActive ? '3px solid #0d6efd' : '3px solid transparent',
  background:  isActive ? '#eff6ff' : 'none',
  fontSize: '.85rem',
})

const navClass = (isActive) =>
  `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none ${isActive ? 'text-primary fw-semibold' : 'text-secondary'}`

export default function Sidebar() {
  return (
    <div
      className="bg-white border-end vh-100 d-flex flex-column"
      style={{ width: 220, position: 'fixed', top: 0, left: 0, zIndex: 200 }}
    >

      {/* Brand */}
      <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
        <span style={{ fontSize: '1.6rem' }}>🌿</span>
        <div>
          <div className="fw-bold" style={{ fontSize: '.9rem', color: '#0f172a' }}>CleanCity</div>
          <div className="text-uppercase text-secondary" style={{ fontSize: '.6rem', letterSpacing: '.06em' }}>
            Company Portal
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <ul className="nav flex-column mb-auto py-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>

        <li className="nav-item">
          <NavLink to="/company" end className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-grid-fill" /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/reports" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-clipboard2-check" /> Assigned Reports
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/cleanRouts" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-signpost-split" /> Clean Route
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/scheduld" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-calendar3" /> Scheduled Cleanups
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/performance" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-bar-chart-line" /> Performance
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/team" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-people" /> Team
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/company/Setting" className={({ isActive }) => navClass(isActive)} style={({ isActive }) => navStyle(isActive)}>
            <i className="bi bi-gear" /> Settings
          </NavLink>
        </li>

      </ul>

      {/* Footer */}
      <div className="border-top py-2">
        <NavLink
          to="/company/ComapnyProfile"
          className={({ isActive }) => navClass(isActive)}
          style={({ isActive }) => navStyle(isActive)}
        >
          <i className="bi bi-person-circle" /> Company Profile
        </NavLink>

        <NavLink
          to="/login"
          className="d-flex align-items-center gap-2 px-3 py-2 text-danger text-decoration-none"
          style={{ fontSize: '.85rem' }}
        >
          <i className="bi bi-box-arrow-left" /> Logout
        </NavLink>
      </div>

    </div>
  )
}