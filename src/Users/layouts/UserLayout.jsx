import { Outlet } from 'react-router-dom'

import NavBar from '../Pages/NavFotter/NavBar'
import Fotter from '../Pages/NavFotter/Fotter'

export default function UserLayout() {
  
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <NavBar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <Fotter />
    </div>
  )
}