import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contactInfo, footerTagline } from '@/data/content'

export function PublicFooter() {
  return (
    <footer className="footer-up">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          {/* Logo Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-white block">School of Members</span>
                <span className="text-xs text-white/60">Ramah Full Gospel Church</span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              {footerTagline}
            </p>
          </div>

          {/* Core Functions */}
          <div>
            <h4 className="footer-up-title">Core Functions</h4>
            <ul className="footer-up-links">
              <li><Link href="/student/courses">Study</Link></li>
              <li><Link href="/story">Teaching</Link></li>
              <li><Link href="/vision">Community</Link></li>
              <li><Link href="/faq">Resources</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-up-title">Quick Links</h4>
            <ul className="footer-up-links">
              <li><Link href="/story">Our Story</Link></li>
              <li><Link href="/vision">Vision & Mission</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/student/register">Register</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="footer-up-title">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Phone className="h-4 w-4" />
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <Mail className="h-4 w-4" />
                {contactInfo.email}
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-up-bottom">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} School of Members - Ramah Full Gospel Church Pretoria. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
