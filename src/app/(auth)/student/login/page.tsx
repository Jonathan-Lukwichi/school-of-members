'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { PinInput } from '@/components/ui/pin-input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Phone, Lock, ArrowLeft, ArrowRight } from 'lucide-react'

type Step = 'phone' | 'pin'

export default function StudentLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [isLoading, setIsLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneValid, setPhoneValid] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handlePhoneChange = (value: string, isValid: boolean) => {
    setPhone(value)
    setPhoneValid(isValid)
    setError('')
  }

  const handlePinChange = (value: string) => {
    setPin(value)
    setError('')
  }

  const handlePhoneSubmit = () => {
    if (!phoneValid) {
      setError('Please enter a valid phone number')
      return
    }
    setStep('pin')
  }

  const handlePinComplete = async (completedPin: string) => {
    await handleLogin(completedPin)
  }

  const handleLogin = async (pinValue: string = pin) => {
    if (!phoneValid) {
      setError('Please enter a valid phone number')
      setStep('phone')
      return
    }

    if (pinValue.length !== 6) {
      setError('Please enter your 6-digit PIN code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin: pinValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success('Welcome!')
      router.push('/student')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      setPin('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <div className="h-1 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />
      <CardHeader className="space-y-1 text-center pt-6">
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
        <CardTitle className="text-2xl font-bold text-[#003366]">Welcome</CardTitle>
        <CardDescription className="text-[#64748b]">
          {step === 'phone'
            ? 'Enter your phone number to continue'
            : 'Enter your 6-digit PIN code'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`h-2 w-12 rounded-full transition-colors ${
              step === 'phone' ? 'bg-[#003366]' : 'bg-[#e2e8f0]'
            }`}
          />
          <div
            className={`h-2 w-12 rounded-full transition-colors ${
              step === 'pin' ? 'bg-[#003366]' : 'bg-[#e2e8f0]'
            }`}
          />
        </div>

        {/* Phone Step */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[#1e293b]">
                <Phone className="h-4 w-4 text-[#003366]" />
                Phone Number
              </Label>
              <PhoneInput
                value={phone}
                onChange={handlePhoneChange}
                defaultCountry="ZA"
                placeholder="Enter your number"
                disabled={isLoading}
                error={error}
              />
            </div>

            <Button
              onClick={handlePhoneSubmit}
              className="w-full"
              disabled={isLoading || !phoneValid}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* PIN Step */}
        {step === 'pin' && (
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className="flex items-center justify-center gap-2 text-[#1e293b]">
                <Lock className="h-4 w-4 text-[#003366]" />
                Enter PIN
              </Label>
              <PinInput
                value={pin}
                onChange={handlePinChange}
                onComplete={handlePinComplete}
                disabled={isLoading}
                error={error}
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('phone')
                  setPin('')
                  setError('')
                }}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => handleLogin()}
                className="flex-1"
                disabled={isLoading || pin.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>

            {/* Forgot PIN link */}
            <div className="text-center">
              <Link
                href="/student/forgot-pin"
                className="text-sm text-[#003366] hover:text-[#C8102E] hover:underline"
              >
                Forgot PIN?
              </Link>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pb-6">
        <div className="text-center text-sm text-[#64748b]">
          Don't have an account?{' '}
          <Link href="/student/register" className="text-[#003366] hover:text-[#C8102E] font-medium">
            Register
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-[#64748b] hover:text-[#003366]"
          >
            Admin / Teacher Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
