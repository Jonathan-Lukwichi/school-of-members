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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-purple-500/20 bg-[#0d0619] hidden lg:block">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-purple-500/20 px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="relative">
            <GraduationCap className="h-8 w-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 blur-lg bg-purple-500/30 group-hover:bg-cyan-500/30 transition-colors" />
          </div>
          <span className="font-bold text-lg text-gradient">School of Members</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 transition-colors',
                isActive ? 'text-cyan-400' : 'text-purple-400'
              )} />
              {link.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Gradient Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none" />
    </aside>
  )
}
