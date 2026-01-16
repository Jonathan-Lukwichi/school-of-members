import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#003366]/5 to-transparent" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} />
      </div>

      <div className="relative w-full max-w-md p-4 z-10">
        {/* Logo Section */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#003366]/20 shadow-lg flex-shrink-0">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#003366]">
              School of Members
            </h1>
            <p className="text-[#64748b] text-xs mt-0.5">Ramah Full Gospel Church Pretoria</p>
          </div>
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-xl border border-[#e2e8f0]">
          {children}
        </div>

        {/* Bottom Link */}
        <p className="text-center text-[#64748b] text-sm mt-6">
          <Link href="/" className="hover:text-[#003366] transition-colors">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
