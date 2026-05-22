import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'

export default function Team() {
  const navigate        = useNavigate()
  const { members }     = useTeam()
  const [search, setSearch] = useState('')

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ background:'#f8f9fa', minHeight:'100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-4" style={{ height:56, position:'sticky', top:0, zIndex:100 }}>
        <span className="fw-bold" style={{ fontSize:'1.1rem', color:'#0f172a' }}>Team Members</span>
        <div className="d-flex align-items-center gap-2">
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width:7,height:7,top:2,right:2 }} />
          </button>
          <div className="rounded-circle overflow-hidden border" style={{ width:32,height:32 }}>
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="user" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
          </div>
        </div>
      </div>

      <div className="p-4">

        {/* Search + Add */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="input-group" style={{ maxWidth:320 }}>
            <span className="input-group-text bg-white border-end-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#94a3b8" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search Team"
              style={{ fontSize:'.85rem' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
            onClick={() => navigate('/company/team/add')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            Add Member
          </button>
        </div>

        {/* Grid */}
        <div className="row g-3">
          {filtered.map(m => (
            <div key={m.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
              <div className="card border shadow-none h-100" style={{ borderRadius:12 }}>
                <div className="card-body p-3">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    {m.img
                      ? <img src={m.img} alt={m.name} className="rounded-circle border" style={{ width:56,height:56,objectFit:'cover' }} />
                      : <div className="rounded-circle border d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                          style={{ width:56,height:56,background:'#0d6efd',fontSize:'1.1rem' }}>
                          {m.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                    }
                    <span className="badge fw-semibold rounded-pill px-2" style={{ background:'#dcfce7', color:'#16a34a', fontSize:'.72rem' }}>
                      {m.status}
                    </span>
                  </div>
                  <div className="fw-bold mb-1" style={{ fontSize:'.95rem', color:'#0f172a' }}>{m.name}</div>
                  <div className="text-secondary mb-3" style={{ fontSize:'.8rem' }}>{m.role}</div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                    <span style={{ fontSize:'.82rem', color:'#475569' }}>{m.phone}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#94a3b8" viewBox="0 0 16 16">
                      <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z"/>
                    </svg>
                    <span style={{ fontSize:'.82rem', color:'#475569' }}>
                      Reports Managed: <span className="fw-bold text-primary">{m.reports}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Invite card */}
          <div className="col-12 col-sm-6 col-md-4 col-xl-3">
            <div className="card border shadow-none h-100 d-flex align-items-center justify-content-center"
              style={{ borderRadius:12, borderStyle:'dashed', cursor:'pointer', minHeight:180 }}
              onClick={() => navigate('/company/team/add')}
            >
              <div className="text-center p-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                  style={{ width:44,height:44,background:'#f1f5f9',color:'#94a3b8',fontSize:'1.4rem' }}>+</div>
                <div className="fw-semibold" style={{ fontSize:'.9rem', color:'#334155' }}>Invite New Member</div>
                <div className="text-secondary" style={{ fontSize:'.78rem' }}>Expand your regional team</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}