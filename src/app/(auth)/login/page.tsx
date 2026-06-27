'use client'

import Link from 'next/link'
import { GraduationCap, Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function PortalSelectorPage() {
  return (
    <div className="overflow-hidden">
      {/* Emerald accent bar */}
      <div className="h-1.5 bg-emerald-btn" />

      <div className="px-6 pb-8 pt-8 sm:px-8">
        {/* Title */}
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald">
            <Sparkles className="h-4 w-4" />
            Welcome to School of Members
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-white">Choose Your Portal</h1>
          <p className="text-sm text-white/60">Select how you would like to sign in</p>
        </div>

        {/* Portal cards */}
        <div className="space-y-4">
          {/* Student */}
          <Link href="/student/login" className="group block">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald/50 hover:bg-white/[0.07] hover:shadow-emerald">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-btn text-ink transition-transform group-hover:scale-105">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-emerald">
                    Student Portal
                  </h3>
                  <p className="text-sm text-white/60">Access your courses and learning materials</p>
                  <p className="mt-1 text-xs text-white/40">Sign in with phone number + PIN</p>
                </div>
                <ArrowRight className="h-5 w-5 translate-x-0 text-emerald opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </div>
          </Link>

          {/* Admin */}
          <Link href="/admin/login" className="group block">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald/50 hover:bg-white/[0.07] hover:shadow-emerald">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-emerald/40 bg-emerald/10 text-emerald transition-transform group-hover:scale-105">
                  <Shield className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-emerald">
                    Admin Portal
                  </h3>
                  <p className="text-sm text-white/60">Manage students, courses, and settings</p>
                  <p className="mt-1 text-xs text-white/40">Sign in with email + password</p>
                </div>
                <ArrowRight className="h-5 w-5 translate-x-0 text-emerald opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        </div>

        {/* Register */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-white/60">New to School of Members?</p>
          <Link
            href="/student/register"
            className="mt-2 inline-flex items-center gap-2 font-medium text-emerald hover:underline"
          >
            Register as a Student
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
