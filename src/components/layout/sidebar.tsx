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
  HelpCircle,
  ChevronRight,
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/[0.06] bg-[#0a0a0f] hidden lg:flex lg:flex-col">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-white/[0.06] px-6">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0779bf] to-[#0e56b9] flex items-center justify-center shadow-md shadow-[#0779bf]/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block leading-tight">
              School<span className="text-[#b5985b]">.</span>Members
            </span>
            <span className="text-[10px] text-zinc-500">Learning Management</span>
          </div>
        </Link>
      </div>

      {/* User Type Badge */}
      <div className="px-4 py-4">
        <div className={cn(
          "px-3 py-2 rounded-lg text-xs font-medium uppercase tracking-wider text-center",
          isAdmin
            ? "bg-[#b5985b]/10 text-[#b5985b] border border-[#b5985b]/20"
            : "bg-[#0779bf]/10 text-[#0779bf] border border-[#0779bf]/20"
        )}>
          {isAdmin ? 'Admin Portal' : 'Student Portal'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-[#0779bf]/10 text-white border border-[#0779bf]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                isActive
                  ? 'bg-[#0779bf] text-white'
                  : 'bg-white/[0.03] text-zinc-500 group-hover:text-zinc-300'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{link.label}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-[#0779bf]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="bg-gradient-to-br from-[#0779bf]/10 to-[#0e56b9]/5 rounded-xl p-4 border border-[#0779bf]/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#0779bf]/20 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-[#0779bf]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Need help?</p>
              <p className="text-xs text-zinc-500">Contact support</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
