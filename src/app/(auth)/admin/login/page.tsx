'use client'

import Link from 'next/link'
import { LoginForm } from '@/components/forms/login-form'
import { Shield, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
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
            <Shield className="h-4 w-4" />
            Admin Portal
          </div>
          <h1 className="mb-1 font-display text-2xl font-bold text-white">Staff Login</h1>
          <p className="text-sm text-white/60">Access for administrators and teachers only</p>
        </div>

        {/* Admin info box */}
        <div className="mb-6 rounded-lg border border-emerald/20 bg-emerald/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Staff Access Only</p>
              <p className="text-xs text-white/60">Sign in with your email and password</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Are you a student?{' '}
            <Link href="/student/login" className="font-medium text-emerald hover:underline">
              Go to Student Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
