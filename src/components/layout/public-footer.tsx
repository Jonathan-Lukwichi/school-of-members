import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contactInfo, footerTagline } from '@/data/content'
import { Container } from '@/components/ui/container'
import { Text } from '@/components/ui/typography'

export function PublicFooter() {
  return (
    <footer className="bg-ink-deep border-t border-white/10 pt-16 pb-8 text-white">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12">
          {/* Logo Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-emerald/40 flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white block leading-tight">School of Members</span>
                <span className="text-xs font-medium text-emerald uppercase tracking-wide">Ramah Full Gospel</span>
              </div>
            </div>
            <Text size="sm" className="text-white/60">
              {footerTagline}
            </Text>
          </div>

          {/* Core Functions */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Core Functions</h4>
            <ul className="space-y-3">
              <li><Link href="/student/courses" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Study</Link></li>
              <li><Link href="/story" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Teaching</Link></li>
              <li><Link href="/vision" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Community</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/story" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Our Story</Link></li>
              <li><Link href="/vision" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Vision & Mission</Link></li>
              <li><Link href="/student/register" className="text-sm text-white/60 hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Register</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-display font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald border border-white/10">
                  <Phone className="h-4 w-4" />
                </div>
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald border border-white/10">
                  <Mail className="h-4 w-4" />
                </div>
                {contactInfo.email}
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald border border-white/10 flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              &copy; {new Date().getFullYear()} School of Members. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-white/40 text-xs hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Privacy Policy</Link>
              <Link href="#" className="text-white/40 text-xs hover:text-emerald transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald">Terms of Use</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
