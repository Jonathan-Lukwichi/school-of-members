'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { PinInput } from '@/components/ui/pin-input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Phone, Lock, ArrowLeft, ArrowRight, Info } from 'lucide-react'

type Step = 'phone' | 'pin'

export function StudentLoginForm() {
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
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step === 'phone'
                ? 'bg-[#003366] text-white'
                : 'bg-[#003366]/10 text-[#003366]'
            }`}
          >
            1
          </div>
          <span className={`text-sm ${step === 'phone' ? 'text-[#003366] font-medium' : 'text-[#94a3b8]'}`}>
            Phone
          </span>
        </div>
        <div className="w-8 h-[2px] bg-[#e2e8f0]" />
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step === 'pin'
                ? 'bg-[#003366] text-white'
                : 'bg-[#e2e8f0] text-[#94a3b8]'
            }`}
          >
            2
          </div>
          <span className={`text-sm ${step === 'pin' ? 'text-[#003366] font-medium' : 'text-[#94a3b8]'}`}>
            PIN
          </span>
        </div>
      </div>

      {/* Phone Step */}
      {step === 'phone' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#64748b] text-sm">
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
            className="w-full h-12 bg-[#003366] hover:bg-[#002244] text-white font-medium text-base shadow-lg shadow-[#003366]/30 transition-all duration-200"
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
            <Label className="flex items-center justify-center gap-2 text-[#64748b] text-sm">
              <Lock className="h-4 w-4 text-[#003366]" />
              Enter your 6-digit PIN
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
              className="flex-1 h-12 border-[#003366]/30 text-[#003366] hover:bg-[#003366]/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => handleLogin()}
              className="flex-1 h-12 bg-[#003366] hover:bg-[#002244] text-white font-medium shadow-lg shadow-[#003366]/30"
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
              className="text-sm text-[#003366] hover:text-[#C8102E] hover:underline transition-colors"
            >
              Forgot PIN?
            </Link>
          </div>
        </div>
      )}

      {/* Register link */}
      <div className="pt-4 border-t border-[#e2e8f0] text-center text-sm text-[#64748b]">
        Don&apos;t have an account?{' '}
        <Link href="/student/register" className="text-[#003366] hover:text-[#C8102E] font-medium transition-colors">
          Register
        </Link>
      </div>
    </div>
  )
}
