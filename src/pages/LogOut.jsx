import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

export default function LogOut() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  useEffect(() => {
    logout().then(() => navigate('/login', { replace: true }))
  }, [])

  return null
}