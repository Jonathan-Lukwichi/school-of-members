'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, Phone, User, Sparkles, MessageSquare } from 'lucide-react'

export default function StudentRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  })
  const [phoneValid, setPhoneValid] = useState(false)

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      phone: value,
    }))
    setPhoneValid(isValid)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    if (!phoneValid) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone,
          whatsappNumber: formData.phone, // Keep for backwards compatibility
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Check your SMS for your PIN.')

      // Redirect to student dashboard
      router.push('/student')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
      <CardHeader className="space-y-2 text-center pb-6 pt-8">
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
        <div className="flex items-center justify-center gap-2 text-[#C8102E] text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          Start your journey
        </div>
        <CardTitle className="text-2xl font-bold text-[#003366]">Join School of Members</CardTitle>
        <CardDescription className="text-[#64748b]">
          Register with your phone number to start learning
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-[#1e293b]">
              <User className="h-4 w-4 text-[#003366]" />
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1e293b]">
              <Phone className="h-4 w-4 text-[#003366]" />
              Phone Number
            </Label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              defaultCountry="ZA"
              placeholder="Enter phone number"
              disabled={isLoading}
            />
          </div>

          {/* Info message */}
          <div className="bg-[#003366]/5 border border-[#003366]/20 rounded-xl p-4">
            <p className="text-sm text-[#64748b] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#b5985b]" />
              Your login PIN will be sent to your phone via SMS.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full bg-[#003366] hover:bg-[#002244] text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>

          <div className="text-center text-sm text-[#64748b]">
            Already have an account?{' '}
            <Link href="/student/login" className="text-[#003366] hover:text-[#C8102E] transition-colors font-medium">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
