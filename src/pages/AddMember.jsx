import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'

const ROLES = ['Field Supervisor','Route Planner','Operations Analyst','Fleet Logistics','Regional Coordinator','Team Leader']
const ZONES = ['Downtown','North Zone','South Zone','East District','West Waterfront','Industrial Park']

export default function AddMember() {
  const navigate      = useNavigate()
  const { addMember } = useTeam()
  const fileRef       = useRef(null)

  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', role:'', zone:'', notes:'' })
  const [avatar,    setAvatar]    = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [errors,    setErrors]    = useState({})

  const set = (k, v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim())     e.email     = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone.trim())     e.phone     = 'Required'
    if (!form.role)             e.role      = 'Required'
    if (!form.zone)             e.zone      = 'Required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    addMember({ ...form, avatar })
    setSubmitted(true)
  }

  const handleAddAnother = () => {
    setSubmitted(false)
    setForm({ firstName:'',lastName:'',email:'',phone:'',role:'',zone:'',notes:'' })
    setAvatar(null)
    setErrors({})
  }

  return (
    <div style={{ background:'#f8f9fa', minHeight:'100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center gap-3 bg-white border-bottom px-4 sticky-top" style={{ height:56, zIndex:100 }}>
        <button className="btn btn-light btn-sm border" onClick={() => navigate('/company/team')}>← Back</button>
        <div>
          <div className="fw-bold" style={{ fontSize:'.95rem', color:'#0f172a' }}>Add New Member</div>
          <div className="text-secondary" style={{ fontSize:'.72rem' }}>Team › Add Member</div>
        </div>
      </div>

      {submitted ? (
        <div className="d-flex flex-column align-items-center justify-content-center p-5" style={{ minHeight:'80vh' }}>
          <div className="rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width:72,height:72,background:'#dcfce7' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#16a34a" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <h5 className="fw-bold mb-1" style={{ color:'#0f172a' }}>Member Added Successfully!</h5>
          <p className="text-secondary mb-4" style={{ fontSize:'.88rem' }}>
            {form.firstName} {form.lastName} has been added to the team.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-outline-secondary px-4" onClick={handleAddAnother}>Add Another</button>
            <button className="btn btn-primary px-4 fw-semibold" onClick={() => navigate('/company/team')}>Back to Team</button>
          </div>
        </div>
      ) : (
        <div className="p-4" style={{ maxWidth:720, margin:'0 auto' }}>
          <div className="card border shadow-none">
            <div className="card-body p-4">

              {/* Avatar */}
              <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom">
                <div className="rounded-circle overflow-hidden border d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width:80,height:80,background:'#f1f5f9',cursor:'pointer' }}
                  onClick={() => fileRef.current.click()}
                >
                  {avatar
                    ? <img src={avatar} alt="avatar" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                    : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#94a3b8" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                      </svg>
                  }
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
                  onChange={e => { const f=e.target.files[0]; if(f) setAvatar(URL.createObjectURL(f)) }} />
                <div>
                  <button className="btn btn-outline-primary btn-sm fw-semibold mb-1" onClick={() => fileRef.current.click()}>Upload Photo</button>
                  <div className="text-secondary" style={{ fontSize:'.75rem' }}>JPEG, PNG up to 5MB</div>
                </div>
              </div>

              {/* Name */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>First Name <span className="text-danger">*</span></label>
                  <input className={`form-control ${errors.firstName?'is-invalid':''}`} placeholder="e.g. Sarah" style={{ fontSize:'.87rem' }}
                    value={form.firstName} onChange={e=>set('firstName',e.target.value)} />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Last Name <span className="text-danger">*</span></label>
                  <input className={`form-control ${errors.lastName?'is-invalid':''}`} placeholder="e.g. Jenkins" style={{ fontSize:'.87rem' }}
                    value={form.lastName} onChange={e=>set('lastName',e.target.value)} />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Email <span className="text-danger">*</span></label>
                  <input type="email" className={`form-control ${errors.email?'is-invalid':''}`} placeholder="name@example.com" style={{ fontSize:'.87rem' }}
                    value={form.email} onChange={e=>set('email',e.target.value)} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Phone <span className="text-danger">*</span></label>
                  <input className={`form-control ${errors.phone?'is-invalid':''}`} placeholder="(555) 012-3456" style={{ fontSize:'.87rem' }}
                    value={form.phone} onChange={e=>set('phone',e.target.value)} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              {/* Role + Zone */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Role <span className="text-danger">*</span></label>
                  <select className={`form-select ${errors.role?'is-invalid':''}`} style={{ fontSize:'.87rem' }}
                    value={form.role} onChange={e=>set('role',e.target.value)}>
                    <option value="">Select role...</option>
                    {ROLES.map(r=><option key={r}>{r}</option>)}
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Zone <span className="text-danger">*</span></label>
                  <select className={`form-select ${errors.zone?'is-invalid':''}`} style={{ fontSize:'.87rem' }}
                    value={form.zone} onChange={e=>set('zone',e.target.value)}>
                    <option value="">Select zone...</option>
                    {ZONES.map(z=><option key={z}>{z}</option>)}
                  </select>
                  {errors.zone && <div className="invalid-feedback">{errors.zone}</div>}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize:'.83rem' }}>Notes <span className="text-secondary fw-normal">(optional)</span></label>
                <textarea className="form-control" rows={3} placeholder="Any additional info..." style={{ fontSize:'.87rem', resize:'vertical' }}
                  value={form.notes} onChange={e=>set('notes',e.target.value)} />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end gap-3">
                <button className="btn btn-outline-secondary px-4" onClick={() => navigate('/company/team')}>Cancel</button>
                <button className="btn btn-primary fw-bold px-4" onClick={handleSubmit}>Add Member</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}