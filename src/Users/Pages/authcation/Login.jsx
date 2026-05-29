import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'

export default function LogIn() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form,     setForm]     = useState({ email: '', password: '', remember: false })
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); setApiError('') }

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const user = await login({ email: form.email, password: form.password })
      if (user.role === 'admin')   return navigate('/admin/dashboard', { replace: true })
      if (user.role === 'company') return navigate('/company',         { replace: true })
      navigate('/user/dashboard', { replace: true })
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setApiError('Invalid email or password.')
      } else if (status === 422) {
        const e = err.response.data?.errors ?? {}
        setErrors({ email: e.email?.[0] ?? '', password: e.password?.[0] ?? '' })
      } else {
        setApiError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #d1fae5 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="d-flex flex-grow-1 align-items-center justify-content-center p-3">
        <div
          className="d-flex overflow-hidden"
          style={{ width: '100%', maxWidth: 900, borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,.5)', background: '#fff' }}
        >

          {/* LEFT */}
          <div
            className="d-none d-lg-flex flex-column justify-content-end p-4"
            style={{
              width: '55%',
              position: 'relative',
              minHeight: 560,
              background: `url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop) center/cover`,
            }}
          >
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.1) 60%)' }} />
            <div style={{ position:'relative', zIndex:2, color:'#fff' }}>
              <h2 className="fw-bold mb-2" style={{ fontSize:'1.8rem' }}>CleanCity</h2>
              <p style={{ fontSize:'.85rem', opacity:.85, lineHeight:1.6, maxWidth:280 }}>
                Join thousands of citizens in Cairo and Alexandria making our urban spaces more livable, one report at a time.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="d-flex flex-column justify-content-center p-5 flex-grow-1">
            <h3 className="fw-bold mb-1" style={{ fontSize:'1.6rem', color:'#0f172a' }}>Welcome Back</h3>
            <p className="text-secondary mb-4" style={{ fontSize:'.85rem' }}>
              Sign in to your account to continue your civic contribution.
            </p>

            {/* API Error */}
            {apiError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" style={{ fontSize:'.85rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                    style={{ fontSize:'.87rem' }}
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    disabled={loading}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label fw-semibold mb-0" style={{ fontSize:'.83rem' }}>Password</label>
                  <Link to="/forgot-password" className="text-decoration-none fw-semibold" style={{ fontSize:'.8rem', color:'#16a34a' }}>
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`form-control bg-light border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                    style={{ fontSize:'.87rem' }}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    disabled={loading}
                  />
                  <span className="input-group-text bg-light" style={{ cursor:'pointer' }} onClick={() => setShowPass(!showPass)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                      {showPass
                        ? <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                        : <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709zm-2.283 1.73A7.028 7.028 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709C1.84 6.771 1 7.88 1.172 8c.058.087.122.183.195.288.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772zm-2.943-2.602a2.5 2.5 0 0 1-2.829-2.829l.822.822a1.5 1.5 0 0 0 1.185 1.185l.822.822zm1.646-4.474a2.5 2.5 0 0 1 2.829 2.829l-.822-.822a1.5 1.5 0 0 0-1.185-1.185l-.822-.822zM1.172 1.172l13.656 13.656-.708.708L.464 1.88l.708-.708z"/>
                      }
                    </svg>
                  </span>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              {/* Remember Me */}
              <div className="d-flex align-items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  className="form-check-input mt-0"
                  id="remember"
                  style={{ width:16, height:16, cursor:'pointer' }}
                  checked={form.remember}
                  onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                  disabled={loading}
                />
                <label htmlFor="remember" className="text-secondary" style={{ fontSize:'.85rem', cursor:'pointer' }}>Remember Me</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 fw-bold py-2 mb-4 d-flex align-items-center justify-content-center gap-2"
                style={{ background:'#15803d', color:'#fff', fontSize:'.95rem', borderRadius:10, border:'none', opacity: loading ? .75 : 1 }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <hr className="flex-grow-1 m-0" />
              <span className="text-secondary" style={{ fontSize:'.78rem', whiteSpace:'nowrap' }}>Or continue with</span>
              <hr className="flex-grow-1 m-0" />
            </div>

            {/* Social */}
            <div className="d-flex gap-3 mb-4">
              <button className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2" style={{ fontSize:'.85rem', borderRadius:8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Google
              </button>
              <button className="btn btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2" style={{ fontSize:'.85rem', borderRadius:8 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1877F2" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div className="text-center" style={{ fontSize:'.85rem', color:'#64748b' }}>
              Need an account?{' '}
              <Link to="/register" className="fw-bold text-decoration-none" style={{ color:'#15803d' }}>Register</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}