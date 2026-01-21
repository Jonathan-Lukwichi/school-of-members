'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/forms/login-form'
import { StudentLoginForm } from '@/components/forms/student-login-form'
import { Shield, GraduationCap, Sparkles } from 'lucide-react'

export default function UnifiedLoginPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('student')

  return (
    <Card className="border-0 shadow-none overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#003366] via-[#b5985b] to-[#C8102E]" />

      <CardContent className="pt-8 pb-8 px-6 sm:px-8">
        {/* Circular Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#003366]/20 shadow-xl ring-4 ring-[#b5985b]/20">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#b5985b] text-sm font-medium mb-2">
            <Sparkles className="h-4 w-4" />
            Welcome Back
          </div>
          <p className="text-[#64748b] text-sm">
            Sign in to access your account
          </p>
        </div>

        {/* User Type Tabs */}
        <Tabs
          defaultValue="student"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'admin' | 'student')}
          className="w-full"
        >
          <TabsList className="w-full h-14 p-1.5 bg-[#f1f5f9] rounded-xl mb-6">
            <TabsTrigger
              value="student"
              className="flex-1 h-full rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#003366] data-[state=active]:shadow-md data-[state=inactive]:text-[#64748b] data-[state=inactive]:hover:text-[#1e293b]"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Student
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="flex-1 h-full rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-[#C8102E] data-[state=active]:shadow-md data-[state=inactive]:text-[#64748b] data-[state=inactive]:hover:text-[#1e293b]"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin / Teacher
            </TabsTrigger>
          </TabsList>

          {/* User type description */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#003366]/5 to-[#C8102E]/5 border border-[#003366]/10">
            <div className="flex items-center gap-3">
              {activeTab === 'student' ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-5 w-5 text-[#003366]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1e293b]">Student Portal</p>
                    <p className="text-xs text-[#64748b]">Sign in with your phone number and 6-digit PIN</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[#C8102E]/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-[#C8102E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1e293b]">Admin / Teacher Portal</p>
                    <p className="text-xs text-[#64748b]">Sign in with your email address and password</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Student Login Content */}
          <TabsContent value="student" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <StudentLoginForm />
          </TabsContent>

          {/* Admin Login Content */}
          <TabsContent value="admin" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <LoginForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
