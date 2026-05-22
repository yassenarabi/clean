import { createContext, useContext, useState } from 'react'

const TeamContext = createContext()

const INITIAL_MEMBERS = [
  { id:1, name:'Sarah Jenkins',   role:'Field Supervisor',     phone:'(555) 012-3456', reports:24, status:'Active', img:'https://randomuser.me/api/portraits/women/44.jpg' },
  { id:2, name:'Marcus Chen',     role:'Route Planner',        phone:'(555) 012-7890', reports:18, status:'Active', img:'https://randomuser.me/api/portraits/men/32.jpg'   },
  { id:3, name:'Elena Rodriguez', role:'Operations Analyst',   phone:'(555) 012-1122', reports:42, status:'Active', img:'https://randomuser.me/api/portraits/women/68.jpg' },
  { id:4, name:'David Miller',    role:'Field Supervisor',     phone:'(555) 012-3344', reports:12, status:'Active', img:'https://randomuser.me/api/portraits/men/75.jpg'   },
  { id:5, name:'Jordan Smith',    role:'Fleet Logistics',      phone:'(555) 012-5566', reports:31, status:'Active', img:'https://randomuser.me/api/portraits/men/52.jpg'   },
  { id:6, name:'Tasha Wilkes',    role:'Regional Coordinator', phone:'(555) 012-7788', reports:56, status:'Active', img:'https://randomuser.me/api/portraits/women/26.jpg' },
]

export function TeamProvider({ children }) {
  const [members, setMembers] = useState(INITIAL_MEMBERS)

  const addMember = (data) => {
    const newMember = {
      id:       Date.now(),
      name:     `${data.firstName} ${data.lastName}`,
      role:     data.role,
      phone:    data.phone,
      reports:  0,
      status:   'Active',
      img:      data.avatar || null,
    }
    setMembers(prev => [...prev, newMember])
  }

  return (
    <TeamContext.Provider value={{ members, addMember }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  return useContext(TeamContext)
}