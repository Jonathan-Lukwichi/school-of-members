'use client'

import { useEffect, useState } from 'react'
import { User, Phone, Mail, BadgeCheck, Globe, Calendar, Loader2 } from 'lucide-react'

interface Student {
  full_name: string
  email: string | null
  phone: string
  status: string
  preferred_language: string | null
  created_at: string
  login_count: number
}

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/student/me')
        if (res.ok) {
          const data = await res.json()
          setStudent(data.student)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading profile…
      </div>
    )
  }

  if (!student) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground shadow-premium">
        Could not load your profile. Please sign in again.
      </div>
    )
  }

  const initials = student.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const rows = [
    { icon: Phone, label: 'Phone', value: student.phone },
    { icon: Mail, label: 'Email', value: student.email || '—' },
    { icon: Globe, label: 'Preferred language', value: student.preferred_language === 'fr' ? 'French' : 'English' },
    { icon: BadgeCheck, label: 'Status', value: student.status.charAt(0).toUpperCase() + student.status.slice(1) },
    { icon: Calendar, label: 'Member since', value: new Date(student.created_at).toLocaleDateString() },
  ]

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-premium sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 text-xl font-bold text-emerald">
            {initials || <User className="h-7 w-7" />}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{student.full_name}</h2>
            <p className="text-sm text-muted-foreground">School of Members student</p>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border border-t border-border">
          {rows.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.label} className="flex items-center gap-3 py-3">
                <Icon className="h-4 w-4 text-emerald" />
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="ml-auto text-sm font-medium text-foreground">{r.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
