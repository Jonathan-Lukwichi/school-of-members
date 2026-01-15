'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  GraduationCap,
  User,
  Shield,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/attendance', label: 'Attendance', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Admin Users', icon: Shield },
]

const studentLinks = [
  { href: '/student', label: 'Dashboard', icon: Home },
  { href: '/student/courses', label: 'My Courses', icon: GraduationCap },
  { href: '/student/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const links = isAdmin ? adminLinks : studentLinks

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/[0.06] bg-[#0a0a0f] hidden lg:block">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white">
            school<span className="text-cyan-400">.</span>members
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/[0.06] text-white border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-cyan-400' : 'text-zinc-500'
              )} />
              {link.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-2">Need help?</p>
          <p className="text-sm text-zinc-300">Contact support</p>
        </div>
      </div>
    </aside>
  )
}
