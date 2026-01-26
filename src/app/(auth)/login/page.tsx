'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function PortalSelectorPage() {
  return (
    <Card className="border-0 shadow-none overflow-hidden">
      {/* Multi-color gradient accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />

      <CardContent className="pt-8 pb-8 px-6 sm:px-8">
        {/* Circular Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#003366]/20 shadow-xl ring-4 ring-[#b5985b]/20">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-[#b5985b] text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            Welcome to School of Members
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Choose Your Portal</h1>
          <p className="text-[#64748b] text-sm">
            Select how you would like to sign in
          </p>
        </div>

        {/* Portal Selection Cards */}
        <div className="space-y-4">
          {/* Student Portal Card */}
          <Link href="/student/login" className="block group">
            <div className="p-5 rounded-xl border-2 border-[#003366]/20 bg-gradient-to-r from-[#003366]/5 to-[#b5985b]/5 hover:border-[#003366]/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#003366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1e293b] group-hover:text-[#003366] transition-colors">
                    Student Portal
                  </h3>
                  <p className="text-sm text-[#64748b]">
                    Access your courses and learning materials
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Sign in with phone number + PIN
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#003366] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Admin Portal Card */}
          <Link href="/admin/login" className="block group">
            <div className="p-5 rounded-xl border-2 border-[#C8102E]/20 bg-gradient-to-r from-[#C8102E]/5 to-[#003366]/5 hover:border-[#C8102E]/40 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#C8102E] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1e293b] group-hover:text-[#C8102E] transition-colors">
                    Admin Portal
                  </h3>
                  <p className="text-sm text-[#64748b]">
                    Manage students, courses, and settings
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    Sign in with email + password
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#C8102E] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>

        {/* New Student Registration Link */}
        <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-center">
          <p className="text-sm text-[#64748b]">
            New to School of Members?
          </p>
          <Link
            href="/student/register"
            className="inline-flex items-center gap-2 mt-2 text-[#003366] font-medium hover:underline"
          >
            Register as a Student
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
