import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/forms/login-form'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  return (
    <Card className="glass border-purple-500/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium mb-2">
          <Sparkles className="h-3 w-3" />
          Welcome back
        </div>
        <CardTitle className="text-2xl font-bold text-white">Sign in</CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:text-cyan-400 transition-colors">
            Register here
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
