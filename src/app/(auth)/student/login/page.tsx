'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { PinInput } from '@/components/ui/pin-input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, BookOpen, Phone, Lock, ArrowLeft, ArrowRight } from 'lucide-react'

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
      setError('Please enter your 6-digit PIN')
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

      toast.success('Welcome back!')
      router.push('/student')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      // Clear PIN on error
      setPin('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            {step === 'phone'
              ? 'Enter your phone number to continue'
              : 'Enter your 6-digit PIN'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`h-2 w-12 rounded-full transition-colors ${
                step === 'phone' ? 'bg-purple-600' : 'bg-purple-200'
              }`}
            />
            <div
              className={`h-2 w-12 rounded-full transition-colors ${
                step === 'pin' ? 'bg-purple-600' : 'bg-purple-200'
              }`}
            />
          </div>

          {/* Phone Step */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <PhoneInput
                  value={phone}
                  onChange={handlePhoneChange}
                  defaultCountry="ZA"
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                  error={error}
                />
              </div>

              <Button
                onClick={handlePhoneSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
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
                <Label className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
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
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  disabled={isLoading || pin.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>

              {/* Forgot PIN link */}
              <div className="text-center">
                <Link
                  href="/student/forgot-pin"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Forgot your PIN?
                </Link>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/student/register" className="text-purple-600 hover:underline">
              Register
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-purple-600"
            >
              Admin / Teacher Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
