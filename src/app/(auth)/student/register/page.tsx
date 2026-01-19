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
import { Loader2, Phone, User, Sparkles, Mail, CheckCircle2, Copy, ArrowRight } from 'lucide-react'

export default function StudentRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [studentPin, setStudentPin] = useState('')
  const [studentName, setStudentName] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
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
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Show success screen with PIN
      setStudentPin(data.pin)
      setStudentName(formData.fullName.trim())
      setRegistrationSuccess(true)
      toast.success('Registration successful!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const copyPin = () => {
    navigator.clipboard.writeText(studentPin)
    toast.success('PIN copied to clipboard!')
  }

  // Success screen after registration
  if (registrationSuccess) {
    return (
      <Card className="border-0 shadow-none">
        <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#003366]">
            Welcome, {studentName}!
          </CardTitle>
          <CardDescription className="text-[#64748b]">
            Your registration is complete. Save your PIN below.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="bg-[#003366]/5 border-2 border-[#003366]/20 rounded-xl p-6 text-center">
            <p className="text-sm text-[#64748b] mb-2">Your Login PIN</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-bold text-[#003366] tracking-[0.3em]">
                {studentPin}
              </span>
              <button
                type="button"
                onClick={copyPin}
                className="p-2 hover:bg-[#003366]/10 rounded-lg transition-colors"
                title="Copy PIN"
              >
                <Copy className="h-5 w-5 text-[#003366]" />
              </button>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-[#C8102E]/5 border border-[#C8102E]/20 rounded-xl p-4">
            <p className="text-sm text-[#C8102E] font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Important: Save this PIN! You&apos;ll need it to login.
            </p>
          </div>

          {/* Email confirmation note */}
          <div className="bg-[#b5985b]/10 border border-[#b5985b]/30 rounded-xl p-4">
            <p className="text-sm text-[#64748b] flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#b5985b]" />
              A copy has also been sent to your email (check spam folder).
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            onClick={() => router.push('/student/login')}
            className="w-full bg-[#003366] hover:bg-[#002244] text-white"
          >
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
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
          Register with your email to start learning
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

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-[#1e293b]">
              <Mail className="h-4 w-4 text-[#003366]" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
              <Mail className="h-4 w-4 text-[#b5985b]" />
              Your login PIN will be sent to your email address.
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
