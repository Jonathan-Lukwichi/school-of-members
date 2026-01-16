import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#003366] to-[#C8102E]" />
      <CardHeader className="space-y-1 pb-4 pt-6">
        <div className="flex items-center gap-2 text-[#C8102E] text-xs font-medium mb-2">
          <Shield className="h-3 w-3" />
          Administrator Portal
        </div>
        <CardTitle className="text-2xl font-bold text-[#003366]">Sign In</CardTitle>
        <CardDescription className="text-[#64748b]">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-[#64748b]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#003366] hover:text-[#C8102E] transition-colors font-medium">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
