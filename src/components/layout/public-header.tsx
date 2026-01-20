'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Book, Shield, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <header className="header-forest sticky top-0 z-50">
      {/* Main Header */}
      <div className="bg-[#0d1a0d]/95 backdrop-blur-md border-b border-forest-400/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white border-2 border-forest-400/50 group-hover:border-forest-400 transition-colors flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-heading font-bold text-white block leading-tight">
                  School of Members
                </span>
                <span className="hidden sm:block text-xs text-forest-500">
                  Ramah Full Gospel Church Pretoria
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-body font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-forest-400'
                      : 'text-white/70 hover:text-forest-400'
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
                  className="flex items-center gap-1 text-white/90 hover:text-forest-400 font-body font-medium transition-colors py-2"
                >
                  Login
                  <ChevronDown className={cn("h-4 w-4 transition-transform", loginDropdownOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div className={cn(
                  "absolute right-0 top-full pt-2 transition-all duration-200",
                  loginDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                )}>
                  <div className="bg-[#132814] rounded-xl shadow-2xl border border-forest-400/20 py-3 w-64 overflow-hidden">
                    {/* Header */}
                    <p className="px-4 pb-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                      Sign in as
                    </p>

                    {/* Student Portal Option */}
                    <Link
                      href="/student/login"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-forest-400/10 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-forest-400/20 flex items-center justify-center flex-shrink-0">
                        <Book className="h-5 w-5 text-forest-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white font-body">Student Portal</p>
                        <p className="text-xs text-white/50">Access your courses</p>
                      </div>
                    </Link>

                    {/* Admin / Teacher Option */}
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-forest-400/10 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-forest-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-forest-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-white font-body">Admin / Teacher</p>
                        <p className="text-xs text-white/50">Manage the school</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Join Now CTA */}
              <Link
                href="/student/register"
                className="btn-forest-primary"
              >
                Join Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden bg-[#0f2010] border-t border-forest-400/20 overflow-hidden transition-all duration-300',
          mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto px-6 py-4 space-y-1">
          {/* Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block py-3 font-body font-medium transition-colors border-b border-forest-400/10',
                isActive(link.href)
                  ? 'text-forest-400'
                  : 'text-white/70 hover:text-forest-400'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Login Options */}
          <div className="pt-4 space-y-3">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Sign in as
            </p>

            {/* Student Login Button */}
            <Link
              href="/student/login"
              className="flex items-center gap-3 p-3 bg-forest-400/10 rounded-lg hover:bg-forest-400/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg bg-forest-400/20 flex items-center justify-center">
                <Book className="h-5 w-5 text-forest-400" />
              </div>
              <div>
                <p className="font-semibold text-white font-body">Student Portal</p>
                <p className="text-xs text-white/50">Access your courses</p>
              </div>
            </Link>

            {/* Admin/Teacher Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-3 p-3 bg-forest-500/10 rounded-lg hover:bg-forest-500/20 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg bg-forest-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-forest-500" />
              </div>
              <div>
                <p className="font-semibold text-white font-body">Admin / Teacher</p>
                <p className="text-xs text-white/50">Manage the school</p>
              </div>
            </Link>

            {/* Join Now Button */}
            <Link
              href="/student/register"
              className="btn-forest-primary w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
