'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Phone, User, Sparkles, Mail, Clock, ArrowRight, MessageCircle, MapPin, Church, Droplets, Globe } from 'lucide-react'

export default function StudentRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    churchOfProvenance: '',
    baptizedByImmersion: '',
    preferredLanguage: '',
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

    if (!formData.address.trim()) {
      toast.error('Please enter your address')
      return
    }

    if (!formData.baptizedByImmersion) {
      toast.error('Please indicate if you have been baptized by immersion')
      return
    }

    if (!formData.preferredLanguage) {
      toast.error('Please select your preferred language')
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
          address: formData.address.trim(),
          churchOfProvenance: formData.churchOfProvenance.trim() || null,
          baptizedByImmersion: formData.baptizedByImmersion === 'yes',
          preferredLanguage: formData.preferredLanguage,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Show success screen (awaiting approval)
      setStudentName(formData.fullName.trim())
      setRegistrationSuccess(true)
      toast.success('Registration submitted!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen after registration (awaiting approval)
  if (registrationSuccess) {
    return (
      <div className="overflow-hidden">
        {/* Emerald accent bar */}
        <div className="h-1.5 bg-emerald-btn" />

        <div className="px-6 pb-8 pt-8 sm:px-8">
          <div className="mb-6 space-y-2 text-center">
            {/* Pending Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                <Clock className="h-12 w-12" />
              </div>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Registration Submitted!
            </h1>
            <p className="text-sm text-white/60">
              Thank you, {studentName}! Your application is being reviewed.
            </p>
          </div>

          <div className="space-y-4">
            {/* What happens next */}
            <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium text-white">
                <Sparkles className="h-4 w-4 text-emerald" />
                What happens next?
              </h4>
              <ol className="list-inside list-decimal space-y-2 text-sm text-white/60">
                <li>Our team will review your registration</li>
                <li>Once approved, you&apos;ll receive your PIN via WhatsApp</li>
                <li>Use your phone number and PIN to login</li>
              </ol>
            </div>

            {/* WhatsApp Note */}
            <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-4">
              <p className="flex items-center gap-2 text-sm text-white/70">
                <MessageCircle className="h-4 w-4 text-emerald" />
                Keep your WhatsApp notifications on to receive your login PIN.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              onClick={() => router.push('/')}
              className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald transition-all duration-200 hover:brightness-105"
            >
              Return to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Emerald accent bar */}
      <div className="h-1.5 bg-emerald-btn" />

      <div className="px-6 pb-8 pt-8 sm:px-8">
        <div className="mb-6 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald">
            <Sparkles className="h-4 w-4" />
            Start your journey
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Join School of Members</h1>
          <p className="text-sm text-white/60">
            Register with your details to start learning
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-sm text-white/70">
              <User className="h-4 w-4 text-emerald" />
              Full Name <span className="text-emerald">*</span>
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
            <Label htmlFor="email" className="flex items-center gap-2 text-sm text-white/70">
              <Mail className="h-4 w-4 text-emerald" />
              Email Address <span className="text-emerald">*</span>
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
            <Label className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="h-4 w-4 text-emerald" />
              Phone Number <span className="text-emerald">*</span>
            </Label>
            <PhoneInput
              value={formData.phone}
              onChange={handlePhoneChange}
              defaultCountry="ZA"
              placeholder="Enter phone number"
              disabled={isLoading}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4 text-emerald" />
              Address <span className="text-emerald">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Church of Provenance */}
          <div className="space-y-2">
            <Label htmlFor="churchOfProvenance" className="flex items-center gap-2 text-sm text-white/70">
              <Church className="h-4 w-4 text-emerald" />
              Church of Provenance <span className="text-xs text-white/40">(optional)</span>
            </Label>
            <Input
              id="churchOfProvenance"
              placeholder="Enter your previous church (if any)"
              value={formData.churchOfProvenance}
              onChange={(e) => setFormData(prev => ({ ...prev, churchOfProvenance: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          {/* Baptized by Immersion */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm text-white/70">
              <Droplets className="h-4 w-4 text-emerald" />
              Have you been baptized by immersion? <span className="text-emerald">*</span>
            </Label>
            <RadioGroup
              value={formData.baptizedByImmersion}
              onValueChange={(value) => setFormData(prev => ({ ...prev, baptizedByImmersion: value }))}
              className="flex gap-6"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="baptized-yes" />
                <Label htmlFor="baptized-yes" className="cursor-pointer font-normal text-white/80">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="baptized-no" />
                <Label htmlFor="baptized-no" className="cursor-pointer font-normal text-white/80">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-white/70">
              <Globe className="h-4 w-4 text-emerald" />
              Preferred Language <span className="text-emerald">*</span>
            </Label>
            <Select
              value={formData.preferredLanguage}
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 border-white/15 bg-white/5 text-white data-[placeholder]:text-white/40 hover:border-white/25 focus:border-emerald/60 focus:ring-2 focus:ring-emerald/30">
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
              </SelectContent>
            </Select>
          </div>

            {/* Info message */}
            <div className="space-y-2 rounded-xl border border-emerald/20 bg-emerald/5 p-4">
              <p className="flex items-center gap-2 text-sm text-white/70">
                <MessageCircle className="h-4 w-4 flex-shrink-0 text-emerald" />
                After approval, your login PIN will be sent via <strong className="text-white">Email</strong> or <strong className="text-white">WhatsApp</strong>.
              </p>
              <p className="text-xs text-white/50">
                Don&apos;t have an email address? You can use{' '}
                <span className="font-medium text-emerald">jonathanlukwichi25@gmail.com</span>.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              type="submit"
              className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald transition-all duration-200 hover:brightness-105"
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

            <div className="text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link href="/student/login" className="font-medium text-emerald transition-colors hover:underline">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
