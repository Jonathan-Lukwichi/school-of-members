import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient with brand colors */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#003366]/8 via-[#b5985b]/5 to-transparent" />

        {/* Decorative circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#003366]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#C8102E]/5 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#b5985b]/5 blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'linear-gradient(#003366 1px, transparent 1px), linear-gradient(90deg, #003366 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Subtle gold accent lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-[#b5985b]/20 via-transparent to-[#b5985b]/20" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#b5985b]/20 to-transparent" />
      </div>

      <div className="relative w-full max-w-md p-4 z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#003366]/20 shadow-lg flex-shrink-0 ring-2 ring-[#b5985b]/20 group-hover:ring-[#b5985b]/40 transition-all duration-300">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#003366] group-hover:text-[#002244] transition-colors">
              School of Members
            </h1>
            <p className="text-[#64748b] text-xs mt-0.5">Ramah Full Gospel Church Pretoria</p>
          </div>
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden backdrop-blur-sm">
          {children}
        </div>

        {/* Bottom Link */}
        <p className="text-center text-[#64748b] text-sm mt-6">
          <Link href="/" className="hover:text-[#003366] transition-colors inline-flex items-center gap-2 group">
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </p>

        {/* Footer branding */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-[#e2e8f0] shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-[#64748b]">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}
