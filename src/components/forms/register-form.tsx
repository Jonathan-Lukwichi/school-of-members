'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, User, Mail, Phone, Lock, Info } from 'lucide-react'

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
      <div className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-green-700 font-semibold mb-2">
          Registration successful!
        </div>
        <p className="text-sm text-green-600">
          Please check your email to verify your account. Redirecting to login...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="flex items-center gap-2 text-[#64748b] text-sm">
          <User className="h-4 w-4 text-[#8B5CF6]" />
          Full Name
        </Label>
        <Input
          id="full_name"
          placeholder="Enter your full name"
          className="border-[#e2e8f0] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 h-11"
          {...register('full_name')}
          disabled={isLoading}
        />
        {errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Mail className="h-4 w-4 text-[#8B5CF6]" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          className="border-[#e2e8f0] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 h-11"
          {...register('email')}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Phone className="h-4 w-4 text-[#8B5CF6]" />
          Phone Number
        </Label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 px-3 border border-[#e2e8f0] rounded-md bg-[#f8fafc] text-sm text-[#64748b] h-11">
            <span className="font-medium">ZA</span>
            <span>+27</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            className="border-[#e2e8f0] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 h-11 flex-1"
            {...register('phone')}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Lock className="h-4 w-4 text-[#8B5CF6]" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          className="border-[#e2e8f0] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 h-11"
          {...register('password')}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-[#64748b] text-sm">
          <Lock className="h-4 w-4 text-[#8B5CF6]" />
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="border-[#e2e8f0] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 h-11"
          {...register('confirmPassword')}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3 py-2">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
          className="mt-0.5 border-[#8B5CF6] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
        />
        <Label htmlFor="acceptTerms" className="text-sm font-normal text-[#64748b] leading-relaxed">
          I accept the terms and conditions of the School of Members
        </Label>
      </div>
      {errors.acceptTerms && (
        <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-[#8B5CF6]/5 to-[#06B6D4]/5 border border-[#8B5CF6]/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
        </div>
        <p className="text-sm text-[#64748b]">
          Your login credentials will be sent to your email address after verification.
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
            Creating account...
          </>
        ) : (
          'Register Here'
        )}
      </Button>
    </form>
  )
}
