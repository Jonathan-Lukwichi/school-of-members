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
        <div className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              step === 'phone'
                ? 'bg-emerald text-ink'
                : 'bg-emerald/15 text-emerald'
            }`}
          >
            1
          </div>
          <span className={`text-sm ${step === 'phone' ? 'font-medium text-white' : 'text-white/40'}`}>
            Phone
          </span>
        </div>
        <div className="h-[2px] w-8 bg-white/15" />
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              step === 'pin'
                ? 'bg-emerald text-ink'
                : 'bg-white/10 text-white/40'
            }`}
          >
            2
          </div>
          <span className={`text-sm ${step === 'pin' ? 'font-medium text-white' : 'text-white/40'}`}>
            PIN
          </span>
        </div>
      </div>

      {/* Phone Step */}
      {step === 'phone' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm text-white/70">
              <Phone className="h-4 w-4 text-emerald" />
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
            className="h-12 w-full bg-emerald-btn text-base font-semibold text-ink shadow-emerald transition-all duration-200 hover:brightness-105"
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
            <Label className="flex items-center justify-center gap-2 text-sm text-white/70">
              <Lock className="h-4 w-4 text-emerald" />
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
              className="h-12 flex-1 border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => handleLogin()}
              className="h-12 flex-1 bg-emerald-btn font-semibold text-ink shadow-emerald hover:brightness-105"
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
              className="text-sm text-white/60 transition-colors hover:text-emerald hover:underline"
            >
              Forgot PIN?
            </Link>
          </div>
        </div>
      )}

      {/* Register link */}
      <div className="border-t border-white/10 pt-4 text-center text-sm text-white/60">
        Don&apos;t have an account?{' '}
        <Link href="/student/register" className="font-medium text-emerald transition-colors hover:underline">
          Register
        </Link>
      </div>
    </div>
  )
}
