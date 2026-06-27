'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Quote,
  QrCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/registration-qr', label: 'Registration QR', icon: QrCode },
  { href: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/attendance', label: 'Attendance', icon: Calendar },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-ink-deep hidden lg:flex lg:flex-col">
      {/* Logo Section */}
      <div className="flex h-20 items-center border-b border-white/10 px-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-white text-sm block leading-tight">
              School of Members
            </span>
            <span className="text-[10px] text-white/60">Ramah Full Gospel Church</span>
          </div>
        </Link>
      </div>

      {/* User Type Badge */}
      <div className="px-4 py-4">
        <div className={cn(
          "px-3 py-2 rounded text-xs font-medium uppercase tracking-wider text-center",
          isAdmin
            ? "bg-emerald/20 text-emerald-light border border-emerald/30"
            : "bg-white/10 text-white border border-white/20"
        )}>
          {isAdmin ? 'Admin Portal' : 'Student Portal'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">
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
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-emerald/15 text-white border-l-3 border-emerald'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded flex items-center justify-center transition-colors',
                isActive
                  ? 'bg-emerald text-ink-deep'
                  : 'bg-white/5 text-white/60 group-hover:text-white'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{link.label}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-emerald" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-white/70" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Need Help?</p>
              <p className="text-xs text-white/50">Contact Support</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
