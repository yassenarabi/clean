import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EVENTS = {
  '2024-10-02': [{ id:1, title:'Maadi Zone A',    color:'#16a34a', bg:'#dcfce7' }],
  '2024-10-03': [{ id:2, title:'Zamalek St. 9',   color:'#0d6efd', bg:'#dbeafe' }, { id:3, title:'Heliopolis B', color:'#d97706', bg:'#fef3c7' }],
  '2024-10-06': [{ id:4, title:'New Cairo North',  color:'#16a34a', bg:'#dcfce7' }],
  '2024-10-09': [{ id:5, title:'Downtown Hub',     color:'#0d6efd', bg:'#dbeafe' }],
  '2024-10-10': [{ id:6, title:'Nasr City 7th',   color:'#0d6efd', bg:'#dbeafe' }, { id:7, title:'Garden City', color:'#d97706', bg:'#fef3c7' }],
}

const UPCOMING = [
  { id:1, time:'08:00 AM — 11:30 AM', status:'ACTIVE',  statusBg:'#dcfce7', statusColor:'#16a34a', title:'Maadi Zone A Cleanup',  desc:'Industrial waste sweep and container relocation.',  lat:30.0595, lng:31.2223, avatars:['#0d6efd','#22c55e','#f59e0b','#ef4444'], extra:'+4' },
  { id:2, time:'02:30 PM — 05:00 PM', status:'QUEUED',  statusBg:'#f1f5f9', statusColor:'#64748b', title:'Nasr City 7th Sector',  desc:'Residential green waste collection route.',         lat:30.0678, lng:31.3411, avatars:['#7c3aed','#22c55e'],                      extra:'+2' },
]

const DAYS   = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getDaysInMonth(y,m){ return new Date(y,m+1,0).getDate() }
function getFirstDay(y,m){    return new Date(y,m,1).getDay() }

export default function ScheduledCleanups() {
  const navigate      = useNavigate()
  const [view,  setView]  = useState('calendar')
  const [year,  setYear]  = useState(2024)
  const [month, setMonth] = useState(9)

  const TODAY    = 10
  const daysInM  = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInM; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => month===0 ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1)
  const nextMonth = () => month===11? (setMonth(0), setYear(y=>y+1)) : setMonth(m=>m+1)
  const getKey    = d => d ? `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null

  return (
    <div style={{ background:'#f8f9fa', minHeight:'100vh' }}>

      {/* Topbar */}
      <div className="d-flex align-items-center justify-content-between bg-white border-bottom px-4" style={{ height:56, position:'sticky', top:0, zIndex:100 }}>
        <span className="fw-bold" style={{ fontSize:'1.1rem', color:'#0f172a' }}>Scheduled Cleanups</span>
        <div className="d-flex align-items-center gap-2">
          <div className="input-group" style={{ width:200 }}>
            <span className="input-group-text bg-white border-end-0 py-1 ps-2 pe-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#94a3b8" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </span>
            <input type="text" className="form-control border-start-0 py-1" placeholder="Search schedules..." style={{ fontSize:'.83rem' }} />
          </div>
          <button className="btn p-1 border-0 bg-transparent position-relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#6c757d" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
            </svg>
            <span className="position-absolute bg-danger rounded-circle border border-white" style={{ width:7,height:7,top:2,right:2 }} />
          </button>
          <button className="btn btn-primary btn-sm fw-semibold px-3">+ Add New Schedule</button>
        </div>
      </div>

      <div className="p-3">
        <div className="row g-3">

          {/* LEFT */}
          <div className="col-12 col-lg-7">
            <div className="d-flex mb-3" style={{ border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', width:'fit-content' }}>
              <button onClick={()=>setView('calendar')} className="btn btn-sm fw-semibold d-flex align-items-center gap-1 px-3"
                style={{ borderRadius:0, background: view==='calendar'?'#0d6efd':'#fff', color: view==='calendar'?'#fff':'#6c757d', border:'none' }}>
                📅 Calendar View
              </button>
              <button onClick={()=>setView('list')} className="btn btn-sm fw-semibold d-flex align-items-center gap-1 px-3"
                style={{ borderRadius:0, background: view==='list'?'#0d6efd':'#fff', color: view==='list'?'#fff':'#6c757d', border:'none', borderLeft:'1px solid #e2e8f0' }}>
                ☰ List View
              </button>
            </div>

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-bold" style={{ fontSize:'1.05rem', color:'#0f172a' }}>{MONTHS[month]} {year}</span>
                  <div className="d-flex gap-1">
                    <button className="btn btn-light btn-sm border" onClick={prevMonth} style={{ width:30,height:30,padding:0 }}>‹</button>
                    <button className="btn btn-light btn-sm border" onClick={nextMonth} style={{ width:30,height:30,padding:0 }}>›</button>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid #f1f5f9' }}>
                  {DAYS.map(d=>(
                    <div key={d} className="text-center text-uppercase text-secondary fw-semibold py-2" style={{ fontSize:'.65rem' }}>{d}</div>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                  {cells.map((day,i)=>{
                    const key    = getKey(day)
                    const events = key?(EVENTS[key]||[]):[]
                    const isToday= day===TODAY
                    return (
                      <div key={i} style={{
                        minHeight:80, padding:'6px 4px',
                        borderRight: (i+1)%7===0?'none':'1px solid #f1f5f9',
                        borderBottom:'1px solid #f1f5f9',
                        background: isToday?'#eff6ff':'#fff',
                        outline: isToday?'1.5px solid #0d6efd':'none',
                        outlineOffset:'-1px',
                      }}>
                        {day && (
                          <>
                            <div style={{ width:22,height:22,borderRadius:'50%', background:isToday?'#0d6efd':'transparent', color:isToday?'#fff':'#475569', display:'flex',alignItems:'center',justifyContent:'center', fontSize:'.78rem',fontWeight:isToday?700:500,marginBottom:3 }}>{day}</div>
                            <div className="d-flex flex-column gap-1">
                              {events.map(ev=>(
                                <div key={ev.id} className="rounded-1 px-1" style={{ background:ev.bg,color:ev.color,fontSize:'.62rem',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',cursor:'pointer',lineHeight:'18px' }}>{ev.title}</div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-lg-5 d-flex flex-column gap-3">

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span>📅</span>
                    <span className="fw-bold" style={{ fontSize:'.95rem' }}>Upcoming Today</span>
                  </div>
                  <span className="badge fw-bold rounded-pill px-2 py-1" style={{ background:'#ef4444', fontSize:'.65rem' }}>LIVE</span>
                </div>
                {UPCOMING.map((u,i)=>(
                  <div key={u.id} style={{ borderBottom:i<UPCOMING.length-1?'1px solid #f1f5f9':'none', paddingBottom:i<UPCOMING.length-1?14:0, marginBottom:i<UPCOMING.length-1?14:0 }}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="text-secondary" style={{ fontSize:'.75rem' }}>{u.time}</span>
                      <span className="badge fw-semibold rounded-pill" style={{ fontSize:'.65rem',background:u.statusBg,color:u.statusColor }}>{u.status}</span>
                    </div>
                    <div className="fw-bold mb-1" style={{ fontSize:'.9rem',color:'#1e293b' }}>{u.title}</div>
                    <div className="text-secondary mb-2" style={{ fontSize:'.78rem' }}>{u.desc}</div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        {u.avatars.map((c,j)=>(
                          <div key={j} className="rounded-circle border border-white"
                            style={{ width:22,height:22,background:c,marginLeft:j>0?-7:0,zIndex:u.avatars.length-j,display:'inline-flex' }} />
                        ))}
                        <span className="ms-1 text-secondary" style={{ fontSize:'.72rem' }}>{u.extra}</span>
                      </div>
                      <button
                        className="btn btn-link btn-sm p-0 text-primary fw-semibold text-decoration-none"
                        style={{ fontSize:'.78rem' }}
                        onClick={() => navigate(`/company/map?lat=${u.lat}&lng=${u.lng}&title=${encodeURIComponent(u.title)}&time=${encodeURIComponent(u.time)}`)}
                      >View Map ↗</button>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop:'1px dashed #e2e8f0',marginTop:12,paddingTop:10,textAlign:'center' }}>
                  <button className="btn btn-link btn-sm p-0 text-primary text-decoration-none" style={{ fontSize:'.82rem' }}>+ View Full Today's Schedule</button>
                </div>
              </div>
            </div>

            <div className="card border shadow-none">
              <div className="card-body p-3">
                <div className="fw-bold mb-3" style={{ fontSize:'.95rem' }}>Team Performance</div>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="text-secondary" style={{ fontSize:'.83rem' }}>Active Routes</span>
                  <span className="fw-semibold" style={{ fontSize:'.83rem' }}>12/15</span>
                </div>
                <div className="progress mb-3" style={{ height:5,borderRadius:99 }}>
                  <div className="progress-bar" style={{ width:'80%' }} />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="p-2 rounded-3 border" style={{ background:'#f8fafc' }}>
                      <div className="text-uppercase text-secondary mb-1" style={{ fontSize:'.6rem',fontWeight:600,letterSpacing:'.06em' }}>Completed</div>
                      <div className="fw-bold" style={{ fontSize:'1.7rem',color:'#0f172a' }}>42</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 border" style={{ background:'#f8fafc' }}>
                      <div className="text-uppercase text-secondary mb-1" style={{ fontSize:'.6rem',fontWeight:600,letterSpacing:'.06em' }}>Delayed</div>
                      <div className="fw-bold" style={{ fontSize:'1.7rem',color:'#ef4444' }}>03</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 overflow-hidden position-relative" style={{ height:130,background:'#1e293b',cursor:'pointer' }}>
              <div className="position-absolute w-100 h-100" style={{ backgroundImage:'linear-gradient(rgba(99,102,241,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.12) 1px,transparent 1px)', backgroundSize:'28px 28px' }}/>
              <svg className="position-absolute w-100 h-100" viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
                <path d="M0 80 Q80 40 150 65 T300 50"  stroke="rgba(148,163,184,.3)" strokeWidth="2" fill="none"/>
                <path d="M0 30 Q100 70 200 40 T300 80" stroke="rgba(148,163,184,.2)" strokeWidth="1.5" fill="none"/>
                <path d="M80 0 Q100 65 90 130"          stroke="rgba(148,163,184,.2)" strokeWidth="1.5" fill="none"/>
                <circle cx="110" cy="65" r="5" fill="#6366f1" opacity=".8"/>
                <circle cx="200" cy="45" r="4" fill="#94a3b8" opacity=".6"/>
                <circle cx="80"  cy="90" r="4" fill="#94a3b8" opacity=".5"/>
              </svg>
              <div className="position-absolute bottom-0 start-0 m-2">
                <span style={{ fontSize:'.75rem',color:'#94a3b8',fontWeight:500 }}>📍 Track Fleet Live</span>
              </div>
              <div className="position-absolute bottom-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width:36,height:36,background:'#0d6efd',fontSize:'1.2rem',boxShadow:'0 2px 8px rgba(13,110,253,.4)' }}>+</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}