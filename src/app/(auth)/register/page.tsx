import Link from 'next/link'
import { RegisterForm } from '@/components/forms/register-form'
import { Sparkles, Shield } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="overflow-hidden">
      {/* Emerald accent bar */}
      <div className="h-1.5 bg-emerald-btn" />

      <div className="px-6 pb-8 pt-8 sm:px-8">
        {/* Title */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-sm font-medium text-emerald">
            <Shield className="h-4 w-4" />
            Admin Registration
          </div>
          <h1 className="mb-1 font-display text-2xl font-bold text-white">Create an Admin Account</h1>
          <p className="text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald" />
              Set up your administrator access
            </span>
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-emerald transition-colors hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
