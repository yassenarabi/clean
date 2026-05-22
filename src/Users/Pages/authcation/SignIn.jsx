import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Required'
    if (!form.email.trim())    e.email    = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password)        e.password = 'Required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (!form.confirm)         e.confirm  = 'Required'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // TODO: call API → POST /auth/register
    // API بترجع token + role → navigate accordingly
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>

      {/* ── LEFT: Visual Panel ── */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: '48%',
          background: 'linear-gradient(160deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          borderRadius: '0 32px 32px 0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{ width:36, height:36, background:'rgba(255,255,255,.2)', fontSize:'.8rem' }}>CC</div>
          <span className="fw-bold text-white" style={{ fontSize:'1rem' }}>CleanCity</span>
        </div>

        {/* Phone Mockup */}
        <div className="d-flex justify-content-center">
          <div style={{
            width: 220,
            background: '#111827',
            borderRadius: 32,
            padding: '12px 10px',
            boxShadow: '0 24px 60px rgba(0,0,0,.5)',
          }}>
            {/* Notch */}
            <div style={{ width:55, height:8, background:'#000', borderRadius:99, margin:'0 auto 8px' }} />
            {/* Screen */}
            <div style={{ borderRadius:20, overflow:'hidden', height:320, position:'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
                alt="cleanup"
                style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.85 }}
              />
              {/* Top bar */}
              <div className="position-absolute top-0 w-100 d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background:'rgba(0,0,0,.35)' }}>
                <span className="text-white fw-bold" style={{ fontSize:'.65rem' }}>CleanCity</span>
                <span className="text-white" style={{ fontSize:'.6rem' }}>Reports</span>
              </div>
              {/* Bottom overlay */}
              <div className="position-absolute bottom-0 w-100 px-3 py-2"
                style={{ background:'linear-gradient(transparent,rgba(0,0,0,.6))' }}>
                <div className="text-white fw-semibold" style={{ fontSize:'.72rem' }}>🌿 Keep Egypt Clean</div>
              </div>
            </div>
            {/* Nav */}
            <div className="d-flex justify-content-around py-2">
              {['🏠','📋','📍','🔔','👤'].map((ic,i)=>(
                <span key={i} style={{ fontSize:'.85rem', opacity: i===0?1:.4 }}>{ic}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-white">
          <h3 className="fw-bold mb-2" style={{ fontSize:'1.4rem' }}>CleanCity</h3>
          <p style={{ fontSize:'.85rem', opacity:.8, lineHeight:1.6, maxWidth:300 }}>
            Join thousands of citizens making our cities cleaner, greener, and more sustainable every day.
          </p>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="d-flex align-items-center justify-content-center flex-grow-1 p-4">
        <div style={{ width:'100%', maxWidth:400 }}>

          {/* Header */}
          <h3 className="fw-bold mb-1" style={{ fontSize:'1.6rem', color:'#0f172a' }}>Create Account</h3>
          <p className="text-secondary mb-4" style={{ fontSize:'.88rem' }}>By registering you help keep Egypt clean</p>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
                  </svg>
                </span>
                <input
                  className={`form-control bg-light border-start-0 ${errors.name?'is-invalid':''}`}
                  placeholder="Ahmad Hassan"
                  style={{ fontSize:'.87rem' }}
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  className={`form-control bg-light border-start-0 ${errors.email?'is-invalid':''}`}
                  placeholder="ahmad@example.com"
                  style={{ fontSize:'.87rem' }}
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-control bg-light border-start-0 border-end-0 ${errors.password?'is-invalid':''}`}
                  placeholder="••••••••"
                  style={{ fontSize:'.87rem' }}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-control bg-light border-start-0 border-end-0 ${errors.confirm?'is-invalid':''}`}
                  placeholder="••••••••"
                  style={{ fontSize:'.87rem' }}
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                />
                <span className="input-group-text bg-light" style={{ cursor:'pointer' }} onClick={() => setShowConfirm(!showConfirm)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                  </svg>
                </span>
                {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn w-100 fw-bold py-2 mb-4"
              style={{ background:'#16a34a', color:'#fff', fontSize:'.95rem', borderRadius:10, border:'none' }}
            >
              Create Account
            </button>

          </form>

          <hr className="my-3" />

          <div className="text-center mb-2" style={{ fontSize:'.85rem', color:'#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" className="fw-bold text-decoration-none" style={{ color:'#16a34a' }}>Log In</Link>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/privacy" className="text-secondary text-decoration-none" style={{ fontSize:'.78rem' }}>Privacy Policy</Link>
            <Link to="/terms"   className="text-secondary text-decoration-none" style={{ fontSize:'.78rem' }}>Terms of Service</Link>
          </div>

        </div>
      </div>
    </div>
  )
}