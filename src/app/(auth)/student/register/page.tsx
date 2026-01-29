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
      <Card className="border-0 shadow-none">
        <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          {/* Pending Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#003366]">
            Registration Submitted!
          </CardTitle>
          <CardDescription className="text-[#64748b]">
            Thank you, {studentName}! Your application is being reviewed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* What happens next */}
          <div className="bg-[#003366]/5 border border-[#003366]/20 rounded-xl p-4">
            <h4 className="font-medium text-[#003366] mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              What happens next?
            </h4>
            <ol className="text-sm text-[#64748b] space-y-2 list-decimal list-inside">
              <li>Our team will review your registration</li>
              <li>Once approved, you&apos;ll receive your PIN via WhatsApp</li>
              <li>Use your phone number and PIN to login</li>
            </ol>
          </div>

          {/* WhatsApp Note */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Keep your WhatsApp notifications on to receive your login PIN.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-[#003366] hover:bg-[#002244] text-white"
          >
            Return to Home
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
          Register with your details to start learning
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-[#1e293b]">
              <User className="h-4 w-4 text-[#003366]" />
              Full Name <span className="text-red-500">*</span>
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
              Email Address <span className="text-red-500">*</span>
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
              Phone Number <span className="text-red-500">*</span>
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
            <Label htmlFor="address" className="flex items-center gap-2 text-[#1e293b]">
              <MapPin className="h-4 w-4 text-[#003366]" />
              Address <span className="text-red-500">*</span>
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
            <Label htmlFor="churchOfProvenance" className="flex items-center gap-2 text-[#1e293b]">
              <Church className="h-4 w-4 text-[#003366]" />
              Church of Provenance <span className="text-[#64748b] text-xs">(optional)</span>
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
            <Label className="flex items-center gap-2 text-[#1e293b]">
              <Droplets className="h-4 w-4 text-[#003366]" />
              Have you been baptized by immersion? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.baptizedByImmersion}
              onValueChange={(value) => setFormData(prev => ({ ...prev, baptizedByImmersion: value }))}
              className="flex gap-6"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="baptized-yes" />
                <Label htmlFor="baptized-yes" className="font-normal cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="baptized-no" />
                <Label htmlFor="baptized-no" className="font-normal cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1e293b]">
              <Globe className="h-4 w-4 text-[#003366]" />
              Preferred Language <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.preferredLanguage}
              onValueChange={(value) => setFormData(prev => ({ ...prev, preferredLanguage: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info message */}
          <div className="bg-[#003366]/5 border border-[#003366]/20 rounded-xl p-4">
            <p className="text-sm text-[#64748b] flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#b5985b]" />
              After approval, your login PIN will be sent via WhatsApp.
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
