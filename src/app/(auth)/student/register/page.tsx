'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PhoneInput } from '@/components/ui/phone-input'
import { toast } from 'sonner'
import { Loader2, BookOpen, MessageCircle, Phone, User, Sparkles } from 'lucide-react'

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
    <Card className="glass border-purple-500/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 blur-xl bg-purple-500/30" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-medium mb-2">
          <Sparkles className="h-3 w-3" />
          Start your journey
        </div>
        <CardTitle className="text-2xl font-bold text-white">Join School of Members</CardTitle>
        <CardDescription className="text-slate-400">
          Register with your phone number to start learning
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2 text-slate-300">
              <User className="h-4 w-4 text-purple-400" />
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
            <Label className="flex items-center gap-2 text-slate-300">
              <Phone className="h-4 w-4 text-purple-400" />
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
              className="border-purple-500/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <Label
              htmlFor="sameAsPhone"
              className="text-sm font-normal cursor-pointer text-slate-400"
            >
              My WhatsApp number is the same as my phone number
            </Label>
          </div>

          {/* WhatsApp Number (if different) */}
          {!formData.sameAsPhone && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-300">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
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
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-cyan-400" />
              Your login PIN will be sent to your WhatsApp number.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-8">
          <Button
            type="submit"
            className="w-full btn-gradient"
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

          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/student/login" className="text-purple-400 hover:text-cyan-400 transition-colors">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
