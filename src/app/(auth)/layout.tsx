import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Radial gradient at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-radial" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md p-4 z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              school<span className="text-cyan-400">.</span>members
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">Learning Management System</p>
          </div>
        </Link>

        {/* Card Container */}
        <div className="glass rounded-2xl p-1">
          <div className="bg-[#13131a]/90 rounded-xl backdrop-blur-sm">
            {children}
          </div>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
