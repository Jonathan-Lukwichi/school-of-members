'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Book, Shield, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Story' },
  { href: '/vision', label: 'Vision' },
]

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
  const loginDropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-900 border-2 border-brand-500/20 group-hover:border-brand-500 transition-all duration-300 flex-shrink-0">
              <Image
                src="/images/logo-fresco.png"
                alt="School of Members Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-heading font-bold text-slate-50 leading-tight tracking-tight">
                School of Members
              </span>
              <span className="hidden sm:block text-xs font-medium text-brand-500 tracking-wide uppercase">
                Ramah Full Gospel Church
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-400',
                  isActive(link.href)
                    ? 'text-brand-500'
                    : 'text-slate-400'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section - Right (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Login Dropdown */}
            <div className="relative" ref={loginDropdownRef}>
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2"
              >
                Login
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", loginDropdownOpen && "rotate-180")} />
              </button>

              {/* Dropdown Menu */}
              <div className={cn(
                "absolute right-0 top-full pt-4 transition-all duration-200",
                loginDropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              )}>
                <div className="bg-slate-900 rounded-xl shadow-2xl shadow-black/50 border border-slate-800 p-2 w-72 overflow-hidden ring-1 ring-white/5">
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Select Portal
                    </p>
                  </div>

                  <div className="space-y-1">
                    {/* Student Portal Option */}
                    <Link
                      href="/student/login"
                      className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/20 transition-colors">
                        <Book className="h-5 w-5 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-brand-400 transition-colors">Student Portal</p>
                        <p className="text-xs text-slate-500">Access your courses</p>
                      </div>
                    </Link>

                    {/* Admin / Teacher Option */}
                    <Link
                      href="/admin/login"
                      className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700 group-hover:border-slate-600 transition-colors">
                        <Shield className="h-5 w-5 text-slate-400 group-hover:text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">Admin Portal</p>
                        <p className="text-xs text-slate-500">Staff access only</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Now CTA */}
            <Link href="/student/register">
              <Button className="font-semibold shadow-lg shadow-brand-500/10">
                Join Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden bg-slate-950 border-t border-slate-800 overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        )}
      >
        <div className="px-6 py-6 space-y-6">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-3 text-lg font-medium transition-colors border-b border-slate-800/50',
                  isActive(link.href)
                    ? 'text-brand-500'
                    : 'text-slate-400 hover:text-brand-400'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Access Portals
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/student/login"
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded bg-brand-500/10 flex items-center justify-center">
                  <Book className="h-4 w-4 text-brand-500" />
                </div>
                <span className="font-medium text-slate-300">Student Login</span>
              </Link>

              <Link
                href="/admin/login"
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Shield className="h-4 w-4 text-slate-400" />
                </div>
                <span className="font-medium text-slate-300">Admin Login</span>
              </Link>
            </div>

            <Link href="/student/register" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center mt-2" size="lg">
                Join Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}