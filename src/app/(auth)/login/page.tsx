import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'
import { Shield, Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#C8102E]" />
      <CardContent className="pt-8 pb-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003366] to-[#C8102E] flex items-center justify-center shadow-lg shadow-[#003366]/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#C8102E] text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            Welcome back
          </div>
          <p className="text-[#64748b] text-sm">
            Sign in to access your account
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-[#64748b]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#003366] hover:text-[#C8102E] transition-colors font-medium">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
