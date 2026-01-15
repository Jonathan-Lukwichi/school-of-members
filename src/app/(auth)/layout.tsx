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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px]"
             style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(7, 121, 191, 0.15), transparent)' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0779bf]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b5985b]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md p-4 z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0779bf] to-[#0e56b9] flex items-center justify-center shadow-lg shadow-[#0779bf]/30">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              School<span className="text-[#b5985b]">.</span>Members
            </h1>
            <p className="text-zinc-500 text-xs mt-0.5">Learning Management System</p>
          </div>
        </Link>

        {/* Card Container */}
        <div className="rounded-2xl border border-white/[0.08] p-1 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="bg-[#13131a]/95 rounded-xl backdrop-blur-sm">
            {children}
          </div>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-zinc-500 text-sm mt-6">
          <Link href="/" className="hover:text-[#0779bf] transition-colors">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
