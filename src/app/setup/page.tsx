'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminForm } from '@/components/forms/admin-form'
import { toast } from 'sonner'
import { Shield, CheckCircle, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [hasAdmins, setHasAdmins] = useState(false)
  const [setupKey, setSetupKey] = useState('')
  const [setupComplete, setSetupComplete] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setHasAdmins(data.hasAdmins)

      if (data.hasAdmins) {
        toast.info('Admin account already exists. Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error) {
      toast.error('Failed to check admin status')
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = async (data: { fullName: string; email: string; phone?: string; password: string }) => {
    if (!setupKey) {
      toast.error('Please enter the setup key')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupKey,
          ...data
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin')
      }

      setSetupComplete(true)
      toast.success('Admin account created successfully!')

      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create admin')
    } finally {
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="dark auth-gradient min-h-screen flex items-center justify-center text-white">
        <div className="text-center text-white animate-reveal">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald" />
          <p className="text-lg">Checking system status...</p>
        </div>
      </div>
    )
  }

  if (hasAdmins) {
    return (
      <div className="dark auth-gradient min-h-screen flex items-center justify-center text-white">
        <div className="text-center text-white animate-reveal">
          <Shield className="h-16 w-16 mx-auto mb-4 text-emerald" />
          <h1 className="font-display text-2xl font-bold mb-2">Setup Already Complete</h1>
          <p className="text-white/60">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  if (setupComplete) {
    return (
      <div className="dark auth-gradient min-h-screen flex items-center justify-center text-white">
        <div className="text-center text-white animate-reveal">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-emerald" />
          <h1 className="font-display text-2xl font-bold mb-2">Setup Complete!</h1>
          <p className="text-white/60">Your admin account has been created.</p>
          <p className="text-white/60 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dark auth-gradient min-h-screen flex items-center justify-center p-4 text-white relative overflow-hidden">
      {/* Soft emerald orbs (decorative) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-tint/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-reveal">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald/40 bg-emerald/10 text-emerald">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">School of Members</h1>
          <p className="text-white/60 mt-2">Initial System Setup</p>
        </div>

        <div className="glass overflow-hidden rounded-2xl shadow-premium-xl">
          {/* Emerald accent bar */}
          <div className="h-1.5 bg-emerald-btn" />
          <div className="px-6 pb-8 pt-8 sm:px-8">
            <div className="mb-6 space-y-1.5">
              <h2 className="font-display text-xl font-bold text-white">Create First Admin</h2>
              <p className="text-sm text-white/60">
                Set up your first administrator account to get started.
                You will need the setup key provided by the system administrator.
              </p>
            </div>
            <AdminForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel="Create Admin Account"
              showSetupKey={true}
              setupKey={setupKey}
              onSetupKeyChange={setSetupKey}
            />
          </div>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          This setup page is only available when no admin accounts exist.
        </p>
      </div>
    </div>
  )
}
