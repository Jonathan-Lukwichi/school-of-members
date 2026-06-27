import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `dark` so tokens + glass resolve to the dark surface; auth-gradient is the emerald→ink backdrop
    <div className="dark auth-gradient min-h-screen flex items-center justify-center relative overflow-hidden text-white">
      {/* Soft emerald orbs (decorative, behind content) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-tint/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md p-4 animate-reveal">
        {/* Logo */}
        <Link href="/" className="group mb-8 flex items-center justify-center gap-3">
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-emerald/40 transition-all duration-300 group-hover:ring-emerald/70">
            <Image
              src="/images/logo-fresco.png"
              alt="School of Members Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">
              School of Members
            </h1>
            <p className="mt-0.5 text-xs text-white/60">Ramah Full Gospel Church Pretoria</p>
          </div>
        </Link>

        {/* Glass card */}
        <div className="glass overflow-hidden rounded-2xl shadow-premium-xl">
          {children}
        </div>

        {/* Back link */}
        <p className="mt-6 text-center text-sm text-white/60">
          <Link href="/" className="group inline-flex items-center gap-2 transition-colors hover:text-emerald">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </p>

        {/* Secure-connection pill */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
            <span className="text-xs text-white/70">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}
