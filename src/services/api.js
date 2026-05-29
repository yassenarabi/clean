import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Token Interceptor ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Global Error Handling ──
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


// ─────────────────────────────
// 📌 REPORTS SERVICE
// ─────────────────────────────
export const reportsService = {
  track: (token) =>
    api.get(`/reports/track/${token}`),

  getAll: (params) =>
    api.get('/reports', { params }),

  getMyReports: (params) =>
    api.get('/my-reports', { params }),

  getById: (id) =>
    api.get(`/reports/${id}`),

  create: (formData) =>
    api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  upvote: (id) =>
    api.post(`/reports/${id}/upvote`),

  rate: (id, data) =>
    api.post(`/reports/${id}/rate`, data),

  updateStatus: (id, formData) =>
    api.patch(`/company/reports/${id}/status`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}


// ─────────────────────────────
// 🔔 NOTIFICATIONS
// ─────────────────────────────
export const notificationsService = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
}


// ─────────────────────────────
// 🏆 LEADERBOARD
// ─────────────────────────────
export const leaderboardService = {
  getAll: (params) => api.get('/leaderboard', { params }),
}


// ─────────────────────────────
// 🌍 LOOKUP DATA
// ─────────────────────────────
export const citiesService = {
  getAll: () => api.get('/cities'),
}

export const categoriesService = {
  getAll: () => api.get('/categories'),
}


// ─────────────────────────────
// 🏢 COMPANY
// ─────────────────────────────
export const companyService = {
  getMyReports: (params) => api.get('/company/reports', { params }),
  getStats: () => api.get('/company/stats'),
  getRoute: () => api.get('/company/route'),
}


// ─────────────────────────────
// 🛠️ ADMIN
// ─────────────────────────────
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getReports: (params) => api.get('/admin/reports', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBan: (id) => api.patch(`/admin/users/${id}/toggle-ban`),
  getCompanies: () => api.get('/admin/companies'),
  createCompany: (data) => api.post('/admin/companies', data),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  autoAssignAll: () => api.post('/admin/auto-assign-all'),
}


// ─────────────────────────────
// 🌤️ SEASONAL ALERTS
// ─────────────────────────────
export const seasonalAlertsService = {
  getAll: () => api.get('/admin/seasonal-alerts'),
  create: (data) => api.post('/admin/seasonal-alerts', data),
}

export default api