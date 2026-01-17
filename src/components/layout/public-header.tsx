'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/story', label: 'Story' },
  { href: '/vision', label: 'Vision' },
  { href: '/faq', label: 'FAQ' },
]

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="header-up">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#003366]/20 shadow-md flex-shrink-0">
              <Image
                src="/images/logo-fresco.png"
                alt="School of Members Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-[#003366] block leading-tight">
                School of Members
              </span>
              <span className="hidden sm:block text-xs text-gray-500">
                Ramah Full Gospel Church Pretoria
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-up-item',
                  isActive(link.href) && 'active'
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 ml-4">
              <Link
                href="/student/login"
                className="text-[#003366] font-medium hover:text-[#C8102E] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/student/register"
                className="btn-up-secondary text-sm px-4 py-2"
              >
                Join Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#003366]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[#003366]'
                    : 'text-gray-600 hover:text-[#003366]'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link
                href="/student/login"
                className="block text-[#003366] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/student/register"
                className="btn-up-secondary inline-flex items-center text-sm px-4 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
