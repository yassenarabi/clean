import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(res => setUser(res.data.user ?? res.data))
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user') })
      .finally(() => setLoading(false))
  }, [])

const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials)

  const data = res.data?.data

  const token = data.token
  const u = data.user

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(u))

  setUser(u)

  return u
}

  const register = async (data) => {
   const res = await api.post('/auth/register', data)

const payload = res.data.data

const token = payload.token
const u = payload.user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    return u
  }



  const logout = async () => {
    try { await api.post('/auth/logout') } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)