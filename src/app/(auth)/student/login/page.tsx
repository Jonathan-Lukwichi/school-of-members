'use client'

import Link from 'next/link'
import { StudentLoginForm } from '@/components/forms/student-login-form'
import { GraduationCap, ArrowLeft } from 'lucide-react'

export default function StudentLoginPage() {
  return (
    <div className="overflow-hidden">
      {/* Emerald accent bar */}
      <div className="h-1.5 bg-emerald-btn" />

      <div className="px-6 pb-8 pt-8 sm:px-8">
        {/* Back to portal selector */}
        <Link
          href="/login"
          className="mb-6 inline-flex items-center text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to portal selection
        </Link>

        {/* Title */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald">
            <GraduationCap className="h-4 w-4" />
            Student Portal
          </div>
          <h1 className="mb-1 font-display text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-white/60">Sign in to access your courses and materials</p>
        </div>

        {/* Student info box */}
        <div className="mb-6 rounded-lg border border-emerald/20 bg-emerald/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Student Access</p>
              <p className="text-xs text-white/60">Sign in with your phone number and 6-digit PIN</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <StudentLoginForm />

        {/* Footer note */}
        <div className="mt-6 space-y-2 text-center">
          <p className="text-xs text-white/50">
            New student?{' '}
            <Link href="/student/register" className="font-medium text-emerald hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-xs text-white/50">
            Are you staff?{' '}
            <Link href="/admin/login" className="font-medium text-emerald hover:underline">
              Go to Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
