import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0118] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md p-4 z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="relative">
            <GraduationCap className="h-12 w-12 text-purple-400 group-hover:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 blur-xl bg-purple-500/40 group-hover:bg-cyan-500/40 transition-colors" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient">School of Members</h1>
            <p className="text-slate-400 text-sm mt-1">Learning Management System</p>
          </div>
        </Link>

        {/* Card Container */}
        <div className="glass rounded-2xl p-1">
          <div className="bg-[#1a0a2e]/80 rounded-xl">
            {children}
          </div>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-purple-400 transition-colors">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
