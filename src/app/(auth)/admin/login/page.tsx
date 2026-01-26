'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'
import { Shield, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <Card className="border-0 shadow-none overflow-hidden">
      {/* Red gradient accent bar for admin */}
      <div className="h-1.5 bg-gradient-to-r from-[#C8102E] via-[#003366] to-[#C8102E]" />

      <CardContent className="pt-8 pb-8 px-6 sm:px-8">
        {/* Back to portal selector */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-[#64748b] hover:text-[#1e293b] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to portal selection
        </Link>

        {/* Circular Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#C8102E]/20 shadow-xl ring-4 ring-[#003366]/20">
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
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#C8102E] text-sm font-medium mb-2">
            <Shield className="h-4 w-4" />
            Admin Portal
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Staff Login</h1>
          <p className="text-[#64748b] text-sm">
            Access for administrators and teachers only
          </p>
        </div>

        {/* Admin info box */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#C8102E]/5 to-[#003366]/5 border border-[#C8102E]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-[#C8102E]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1e293b]">Staff Access Only</p>
              <p className="text-xs text-[#64748b]">Sign in with your email and password</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[#94a3b8]">
            Are you a student?{' '}
            <Link href="/student/login" className="text-[#003366] hover:underline font-medium">
              Go to Student Portal
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
