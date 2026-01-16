import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { RegisterForm } from '@/components/forms/register-form'
import { BookOpen, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#C8102E]" />
      <CardContent className="pt-8 pb-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-purple-500/30">
            <BookOpen className="h-8 w-8 text-white" />
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
