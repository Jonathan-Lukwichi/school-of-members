import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { RegisterForm } from '@/components/forms/register-form'
import { Sparkles } from 'lucide-react'

export default function RegisterPage() {
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
            Start your journey
          </div>
          <p className="text-[#64748b] text-sm">
            Register with your details to start learning
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-[#64748b]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#003366] hover:text-[#C8102E] transition-colors font-medium">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
