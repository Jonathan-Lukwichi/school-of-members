'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Book, ArrowRight } from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full border-b border-mint bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald rounded-lg">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-mint border-2 border-emerald/20 group-hover:border-emerald transition-all duration-300 flex-shrink-0">
              <Image
                src="/images/logo-fresco.png"
                alt="School of Members Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-display font-bold text-ink leading-tight tracking-tight">
                School of Members
              </span>
              <span className="hidden sm:block text-xs font-medium text-emerald-dark tracking-wide uppercase">
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
                  'text-sm font-medium transition-colors hover:text-emerald rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald',
                  isActive(link.href)
                    ? 'text-emerald-dark'
                    : 'text-ink-muted'
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
                className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-emerald transition-colors py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
              >
                Login
                <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform duration-200", loginDropdownOpen && "rotate-180")} />
              </button>

              {/* Dropdown Menu */}
              <div className={cn(
                "absolute right-0 top-full pt-4 transition-all duration-200",
                loginDropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              )}>
                <div className="bg-white rounded-xl shadow-premium-lg border border-mint p-2 w-72 overflow-hidden">
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                      Student Login
                    </p>
                  </div>

                  <div className="space-y-1">
                    {/* Student Portal Option */}
                    <Link
                      href="/student/login"
                      className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-mint transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                      onClick={() => setLoginDropdownOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald/20 transition-colors">
                        <Book className="h-5 w-5 text-emerald" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink group-hover:text-emerald-dark transition-colors">Student Portal</p>
                        <p className="text-xs text-ink-muted">Access your courses</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Now CTA */}
            <Link href="/student/register">
              <Button className="font-semibold shadow-emerald">
                Join Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-ink-muted hover:text-emerald hover:bg-mint rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
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
          'lg:hidden bg-white border-t border-mint overflow-hidden transition-all duration-300',
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
                  'block py-3 text-lg font-medium transition-colors border-b border-mint',
                  isActive(link.href)
                    ? 'text-emerald-dark'
                    : 'text-ink hover:text-emerald'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
              Student Access
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/student/login"
                className="flex items-center gap-3 p-3 bg-mint rounded-lg hover:bg-mint-soft transition-colors border border-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded bg-emerald/10 flex items-center justify-center">
                  <Book className="h-4 w-4 text-emerald" />
                </div>
                <span className="font-medium text-ink">Student Login</span>
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
