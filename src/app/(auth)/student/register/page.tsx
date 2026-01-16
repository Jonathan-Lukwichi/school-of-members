'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PhoneInput } from '@/components/ui/phone-input'
import { toast } from 'sonner'
import { Loader2, MessageCircle, Phone, User, Sparkles } from 'lucide-react'

export default function StudentRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsappNumber: '',
    sameAsPhone: true,
  })
  const [phoneValid, setPhoneValid] = useState(false)
  const [whatsappValid, setWhatsappValid] = useState(true)

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      phone: value,
      ...(prev.sameAsPhone && { whatsappNumber: value }),
    }))
    setPhoneValid(isValid)
    if (formData.sameAsPhone) {
      setWhatsappValid(isValid)
    }
  }

  const handleWhatsAppChange = (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, whatsappNumber: value }))
    setWhatsappValid(isValid)
  }

  const handleSameAsPhoneChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsPhone: checked,
      whatsappNumber: checked ? prev.phone : prev.whatsappNumber,
    }))
    if (checked) {
      setWhatsappValid(phoneValid)
    }
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

    if (!formData.sameAsPhone && !whatsappValid) {
      toast.error('Please enter a valid WhatsApp number')
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
          whatsappNumber: formData.sameAsPhone ? formData.phone : formData.whatsappNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Check your WhatsApp for your PIN.')

      // Redirect to student dashboard
      router.push('/student')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
      <CardHeader className="space-y-1 text-center pb-4 pt-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-[#003366]/20 shadow-lg">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-[#C8102E] text-xs font-medium mb-2">
          <Sparkles className="h-3 w-3" />
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

          {/* Same as phone checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsPhone"
              checked={formData.sameAsPhone}
              onCheckedChange={handleSameAsPhoneChange}
              disabled={isLoading}
              className="border-[#003366]/30 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
            />
            <Label
              htmlFor="sameAsPhone"
              className="text-sm font-normal cursor-pointer text-[#64748b]"
            >
              My WhatsApp number is the same as my phone number
            </Label>
          </div>

          {/* WhatsApp Number (if different) */}
          {!formData.sameAsPhone && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[#1e293b]">
                <MessageCircle className="h-4 w-4 text-[#b5985b]" />
                WhatsApp Number
              </Label>
              <PhoneInput
                value={formData.whatsappNumber}
                onChange={handleWhatsAppChange}
                defaultCountry="ZA"
                placeholder="Enter WhatsApp number"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Info message */}
          <div className="bg-[#003366]/5 border border-[#003366]/20 rounded-xl p-4">
            <p className="text-sm text-[#64748b] flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#b5985b]" />
              Your login PIN will be sent to your WhatsApp number.
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
