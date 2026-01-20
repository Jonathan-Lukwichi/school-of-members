import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { contactInfo, footerTagline } from '@/data/content'
import { Container } from '@/components/ui/container'
import { Heading, Text } from '@/components/ui/typography'

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12">
          {/* Logo Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-500/30 flex-shrink-0">
                <Image
                  src="/images/logo-fresco.png"
                  alt="School of Members Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-slate-50 block leading-tight">School of Members</span>
                <span className="text-xs font-medium text-brand-500 uppercase tracking-wide">Ramah Full Gospel</span>
              </div>
            </div>
            <Text size="sm" className="text-slate-400">
              {footerTagline}
            </Text>
          </div>

          {/* Core Functions */}
          <div>
            <h4 className="font-heading font-semibold text-slate-50 mb-6">Core Functions</h4>
            <ul className="space-y-3">
              <li><Link href="/student/courses" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Study</Link></li>
              <li><Link href="/story" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Teaching</Link></li>
              <li><Link href="/vision" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-slate-50 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/story" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Our Story</Link></li>
              <li><Link href="/vision" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Vision & Mission</Link></li>
              <li><Link href="/student/register" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-heading font-semibold text-slate-50 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-500 border border-slate-800">
                  <Phone className="h-4 w-4" />
                </div>
                {contactInfo.phone}
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-500 border border-slate-800">
                  <Mail className="h-4 w-4" />
                </div>
                {contactInfo.email}
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-brand-500 border border-slate-800 flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} School of Members. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-slate-500 text-xs hover:text-brand-500 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-slate-500 text-xs hover:text-brand-500 transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}