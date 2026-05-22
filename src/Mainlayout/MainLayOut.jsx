import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../components/SideBar'

export default function MainLayOut() {
  return (
    <div className='d-flex'>

      {/* Sidebar */}
      <SideBar />

      {/* Content — على desktop يبعد عن الـ sidebar، على موبايل يبدأ من الأول */}
      <div
        className='flex-grow-1'
        style={{ minHeight: '100vh', background: '#f8f9fa' }}
      >
        <style>{`
          @media (min-width: 992px) {
            .main-outlet { margin-left: 220px; }
          }
          @media (max-width: 991px) {
            .main-outlet { margin-left: 0; }
          }
        `}</style>
        <div className='main-outlet'>
          <Outlet />
        </div>
      </div>

    </div>
  )
}