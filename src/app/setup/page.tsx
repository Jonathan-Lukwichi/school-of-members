'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center text-white">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Checking system status...</p>
        </div>
      </div>
    )
  }

  if (hasAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center text-white">
          <Shield className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-2xl font-bold mb-2">Setup Already Complete</h1>
          <p className="text-purple-200">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center text-white">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
          <h1 className="text-2xl font-bold mb-2">Setup Complete!</h1>
          <p className="text-purple-200">Your admin account has been created.</p>
          <p className="text-purple-200 mt-2">Redirecting to login page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-full">
              <Shield className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">School of Members</h1>
          <p className="text-purple-200 mt-2">Initial System Setup</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle>Create First Admin</CardTitle>
            <CardDescription>
              Set up your first administrator account to get started.
              You will need the setup key provided by the system administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitLabel="Create Admin Account"
              showSetupKey={true}
              setupKey={setupKey}
              onSetupKeyChange={setSetupKey}
            />
          </CardContent>
        </Card>

        <p className="text-center text-purple-200 text-sm mt-6">
          This setup page is only available when no admin accounts exist.
        </p>
      </div>
    </div>
  )
}
