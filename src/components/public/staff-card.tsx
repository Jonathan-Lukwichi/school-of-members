'use client'

import Image from 'next/image'

export interface StaffMember {
  name: string
  role: string
  comment: string
  image: string
}

interface StaffCardProps {
  staff: StaffMember
}

export function StaffCard({ staff }: StaffCardProps) {
  return (
    <div className="staff-card">
      {/* Photo */}
      <div className="relative w-[140px] h-[140px] mx-auto mb-6">
        <Image
          src={staff.image}
          alt={staff.name}
          fill
          className="staff-photo object-cover"
        />
      </div>

      {/* Name */}
      <h3 className="staff-name">{staff.name}</h3>

      {/* Role */}
      <p className="staff-role">{staff.role}</p>

      {/* Comment */}
      <p className="staff-comment">"{staff.comment}"</p>
    </div>
  )
}

// Staff Grid Component
interface StaffGridProps {
  staff: StaffMember[]
}

export function StaffGrid({ staff }: StaffGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {staff.map((member, index) => (
        <StaffCard key={index} staff={member} />
      ))}
    </div>
  )
}
