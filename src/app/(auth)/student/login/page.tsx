'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { StudentLoginForm } from '@/components/forms/student-login-form'
import { GraduationCap, ArrowLeft } from 'lucide-react'

export default function StudentLoginPage() {
  return (
    <Card className="border-0 shadow-none overflow-hidden">
      {/* Navy/Gold gradient accent bar for students */}
      <div className="h-1.5 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#003366]" />

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
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#b5985b] text-sm font-medium mb-2">
            <GraduationCap className="h-4 w-4" />
            Student Portal
          </div>
          <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Welcome Back</h1>
          <p className="text-[#64748b] text-sm">
            Sign in to access your courses and materials
          </p>
        </div>

        {/* Student info box */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#003366]/5 to-[#b5985b]/5 border border-[#003366]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-5 w-5 text-[#003366]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1e293b]">Student Access</p>
              <p className="text-xs text-[#64748b]">Sign in with your phone number and 6-digit PIN</p>
            </div>
          </div>
        </div>

        {/* Student Login Form */}
        <StudentLoginForm />

        {/* Footer note */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-[#94a3b8]">
            New student?{' '}
            <Link href="/student/register" className="text-[#003366] hover:underline font-medium">
              Register here
            </Link>
          </p>
          <p className="text-xs text-[#94a3b8]">
            Are you staff?{' '}
            <Link href="/admin/login" className="text-[#C8102E] hover:underline font-medium">
              Go to Admin Portal
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
