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
        {/* Circular Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#003366]/20 shadow-xl">
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
            <Sparkles className="h-4 w-4" />
            Admin Portal
          </div>
          <p className="text-[#64748b] text-sm">
            Sign in to manage your platform
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
