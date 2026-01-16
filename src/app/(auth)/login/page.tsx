import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
      <CardContent className="pt-8 pb-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-[#003366]/20 shadow-lg">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
            />
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
