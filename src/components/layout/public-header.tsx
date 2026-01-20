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
    <header className="sticky top-0 z-50">
      {/* Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-church-gold via-church-red to-church-gold" />

      {/* Main Header */}
      <div className="bg-gradient-to-r from-church-blue via-church-blue-dark to-church-blue shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white border-2 border-church-gold/50 group-hover:border-church-gold transition-colors flex-shrink-0">
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
                <span className="hidden sm:block text-xs text-church-gold">
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
                      ? 'text-white'
                      : 'text-white/70 hover:text-church-gold'
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
                  className="flex items-center gap-1 text-white/90 hover:text-church-gold font-body font-medium transition-colors py-2"
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
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-3 w-64 overflow-hidden">
                    {/* Header */}
                    <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Sign in as
                    </p>

                    {/* Student Portal Option */}
                    <Link
                      href="/student/login"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-church-blue/10 flex items-center justify-center flex-shrink-0">
                        <Book className="h-5 w-5 text-church-blue" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-body">Student Portal</p>
                        <p className="text-xs text-gray-500">Access your courses</p>
                      </div>
                    </Link>

                    {/* Admin / Teacher Option */}
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-church-red/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-church-red" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 font-body">Admin / Teacher</p>
                        <p className="text-xs text-gray-500">Manage the school</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Join Now CTA */}
              <Link
                href="/student/register"
                className="flex items-center gap-2 bg-church-gold hover:bg-yellow-500 text-church-blue-dark text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all"
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
          'lg:hidden bg-white border-t overflow-hidden transition-all duration-300',
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
                'block py-3 font-body font-medium transition-colors border-b border-gray-100',
                isActive(link.href)
                  ? 'text-church-blue'
                  : 'text-gray-600 hover:text-church-blue'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Login Options */}
          <div className="pt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Sign in as
            </p>

            {/* Student Login Button */}
            <Link
              href="/student/login"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg bg-church-blue/20 flex items-center justify-center">
                <Book className="h-5 w-5 text-church-blue" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 font-body">Student Portal</p>
                <p className="text-xs text-gray-500">Access your courses</p>
              </div>
            </Link>

            {/* Admin/Teacher Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-lg bg-church-red/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-church-red" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 font-body">Admin / Teacher</p>
                <p className="text-xs text-gray-500">Manage the school</p>
              </div>
            </Link>

            {/* Join Now Button */}
            <Link
              href="/student/register"
              className="flex items-center justify-center gap-2 w-full bg-church-red hover:bg-church-red-dark text-white font-bold py-3 rounded-lg transition-colors"
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
