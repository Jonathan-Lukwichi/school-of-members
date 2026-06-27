'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, User, Mail, Phone, Lock, Info, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const acceptTerms = watch('acceptTerms')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone || null,
            role: 'student',
          },
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 text-center bg-emerald/5 rounded-lg border border-emerald/20">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald/15 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald" />
        </div>
        <div className="text-white font-semibold mb-2">
          Registration successful!
        </div>
        <p className="text-sm text-white/60">
          Please check your email to verify your account. Redirecting to login...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="flex items-center gap-2 text-sm text-white/70">
          <User className="h-4 w-4 text-emerald" />
          Full Name
        </Label>
        <Input
          id="full_name"
          placeholder="Enter your full name"
          className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          {...register('full_name')}
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="text-xs text-red-300">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-sm text-white/70">
          <Mail className="h-4 w-4 text-emerald" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-red-300">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-sm text-white/70">
          <Phone className="h-4 w-4 text-emerald" />
          Phone Number
        </Label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 px-3 border border-white/15 rounded-md bg-white/5 text-sm text-white/70 h-11">
            <span className="font-medium">ZA</span>
            <span>+27</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="h-11 flex-1 border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
            {...register('phone')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2 text-sm text-white/70">
          <Lock className="h-4 w-4 text-emerald" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs text-red-300">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm text-white/70">
          <Lock className="h-4 w-4 text-emerald" />
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="h-11 border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-300">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3 py-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
          className="mt-0.5 border-white/30 data-[state=checked]:border-emerald data-[state=checked]:bg-emerald data-[state=checked]:text-ink"
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal text-white/70 leading-relaxed">
          I accept the terms and conditions of the School of Members
        </Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-300">{errors.acceptTerms.message}</p>
      )}

      {/* Info Box */}
      <div className="flex items-start gap-3 rounded-lg border border-emerald/20 bg-emerald/5 p-4">
        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-emerald">
          <div className="h-2 w-2 rounded-full bg-emerald" />
        </div>
        <p className="text-sm text-white/60">
          Your login credentials will be sent to your email address after verification.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald transition-all duration-200 hover:brightness-105"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating account...
          </>
        ) : (
          'Register Here'
        )}
      </Button>
    </form>
  )
}
