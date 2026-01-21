'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Lock, Info } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Sign out any existing session first to ensure clean login
      await supabase.auth.signOut()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Fetch role from profiles table
        const { data: profile } = await (supabase
          .from('profiles') as any)
          .select('role')
          .eq('id', authData.user.id)
          .single()

        const role = (profile as any)?.role || authData.user.user_metadata?.role || 'teacher'

        // Force full page reload to ensure session is properly established
        // Both admin and teacher roles go to admin dashboard
        if (role === 'admin' || role === 'teacher') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/student'
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Mail className="h-4 w-4 text-[#003366]" />
          Email Address
        </Label>
        <input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-base text-[#1e293b] shadow-sm transition-all duration-200 outline-none placeholder:text-[#9ca3af] hover:border-[#cbd5e1] focus:border-[#003366]/50 focus:ring-2 focus:ring-[#003366]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Lock className="h-4 w-4 text-[#003366]" />
          Password
        </Label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-base text-[#1e293b] shadow-sm transition-all duration-200 outline-none placeholder:text-[#9ca3af] hover:border-[#cbd5e1] focus:border-[#003366]/50 focus:ring-2 focus:ring-[#003366]/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center space-x-3 py-2">
        <Checkbox
          id="remember"
          className="border-[#003366] data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
        />
        <Label htmlFor="remember" className="text-sm font-normal text-[#64748b]">
          Remember me
        </Label>
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-r from-[#003366]/5 to-[#C8102E]/5 border border-[#003366]/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#003366] flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-[#003366]" />
        </div>
        <p className="text-sm text-[#64748b]">
          Your account gives you access to all School of Members courses and materials.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#003366] hover:bg-[#002244] text-white font-medium text-base shadow-lg shadow-[#003366]/30 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}
