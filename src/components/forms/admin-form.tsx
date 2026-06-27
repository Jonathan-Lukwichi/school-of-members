'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const adminSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

type AdminFormData = z.infer<typeof adminSchema>

interface AdminFormProps {
  onSubmit: (data: Omit<AdminFormData, 'confirmPassword'>) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
  showSetupKey?: boolean
  setupKey?: string
  onSetupKeyChange?: (key: string) => void
}

export function AdminForm({
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Admin',
  showSetupKey = false,
  setupKey = '',
  onSetupKeyChange
}: AdminFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema)
  })

  const handleFormSubmit = async (data: AdminFormData) => {
    const { confirmPassword, ...submitData } = data
    await onSubmit(submitData)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {showSetupKey && (
        <div className="space-y-2">
          <Label htmlFor="setupKey" className="text-sm text-white/70">Setup Key *</Label>
          <Input
            id="setupKey"
            type="password"
            placeholder="Enter setup key"
            value={setupKey}
            onChange={(e) => onSetupKeyChange?.(e.target.value)}
            required
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          />
          <p className="text-xs text-white/50">
            This key is required to create the first admin account
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm text-white/70">Full Name *</Label>
        <Input
          id="fullName"
          placeholder="Enter full name"
          {...register('fullName')}
          disabled={isLoading}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
        />
        {errors.fullName && (
          <p className="text-sm text-red-300">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-white/70">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          {...register('email')}
          disabled={isLoading}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
        />
        {errors.email && (
          <p className="text-sm text-red-300">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm text-white/70">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register('phone')}
          disabled={isLoading}
          className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
        />
        {errors.phone && (
          <p className="text-sm text-red-300">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm text-white/70">Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            {...register('password')}
            disabled={isLoading}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white/80"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-300">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm text-white/70">Confirm Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            disabled={isLoading}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-emerald/30"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white/80"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald transition-all duration-200 hover:brightness-105" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}
