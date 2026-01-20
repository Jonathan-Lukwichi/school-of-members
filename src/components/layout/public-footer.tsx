import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contactInfo, footerTagline } from '@/data/content'

export function PublicFooter() {
  return (
    <footer className="footer-forest">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Logo Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-forest-400/30 shadow-lg flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-white block">School of Members</span>
                <span className="text-xs text-forest-400">Ramah Full Gospel Church</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              {footerTagline}
            </p>
          </div>

          {/* Core Functions */}
          <div>
            <h4 className="footer-forest-title">Core Functions</h4>
            <ul className="space-y-2">
              <li><Link href="/student/courses" className="footer-forest-link">Study</Link></li>
              <li><Link href="/story" className="footer-forest-link">Teaching</Link></li>
              <li><Link href="/vision" className="footer-forest-link">Community</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-forest-title">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/story" className="footer-forest-link">Our Story</Link></li>
              <li><Link href="/vision" className="footer-forest-link">Vision & Mission</Link></li>
              <li><Link href="/student/register" className="footer-forest-link">Register</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="footer-forest-title">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="h-4 w-4 text-forest-400" />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="h-4 w-4 text-forest-400" />
                {contactInfo.email}
              </li>
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-forest-400" />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-forest-bottom">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} School of Members - Ramah Full Gospel Church Pretoria. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-white/40 text-sm hover:text-forest-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-white/40 text-sm hover:text-forest-400 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
