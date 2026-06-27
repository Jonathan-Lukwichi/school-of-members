'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GraduationCap, Sparkles, BookOpen, Trophy, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeOverlayProps {
  userName: string
  storageKey?: string
  onDismiss?: () => void
}

export function WelcomeOverlay({
  userName,
  storageKey = 'som_welcome_seen',
  onDismiss
}: WelcomeOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has already seen the welcome message this session
    const hasSeen = sessionStorage.getItem(storageKey)
    if (!hasSeen) {
      setIsVisible(true)
      setIsAnimating(true)
    }
  }, [storageKey])

  const handleDismiss = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem(storageKey, 'true')
      onDismiss?.()
    }, 500)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-deep via-ink to-ink-soft">
        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-deep/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Sparkle decorations */}
        <div className="absolute top-[10%] left-[15%] animate-bounce delay-100">
          <Sparkles className="h-8 w-8 text-emerald-light/60" />
        </div>
        <div className="absolute top-[20%] right-[20%] animate-bounce delay-300">
          <Sparkles className="h-6 w-6 text-emerald-light/40" />
        </div>
        <div className="absolute bottom-[30%] left-[10%] animate-bounce delay-500">
          <Sparkles className="h-10 w-10 text-emerald-light/50" />
        </div>
        <div className="absolute bottom-[15%] right-[15%] animate-bounce delay-700">
          <Sparkles className="h-7 w-7 text-emerald-light/60" />
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          'relative z-10 text-center px-4 max-w-2xl mx-auto transition-all duration-700',
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        {/* Logo */}
        <div className="mb-8 inline-flex items-center justify-center">
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <GraduationCap className="h-16 w-16 text-emerald-light" />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-light to-emerald">
            School of Members
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-mint mb-2">
          Hello, <span className="text-white font-semibold">{userName}</span>!
        </p>

        <p className="text-lg text-mint/80 mb-12 max-w-md mx-auto">
          Your journey to knowledge and growth starts here. We&apos;re excited to have you!
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <BookOpen className="h-8 w-8 text-emerald-light mx-auto mb-2" />
            <p className="text-sm text-white">Learn</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <Trophy className="h-8 w-8 text-emerald-light mx-auto mb-2" />
            <p className="text-sm text-white">Achieve</p>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <Sparkles className="h-8 w-8 text-emerald-light mx-auto mb-2" />
            <p className="text-sm text-white">Grow</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={handleDismiss}
          className="bg-emerald-btn text-white font-semibold px-8 py-6 text-lg rounded-full shadow-emerald transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Start Learning
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-mint/60 text-sm mt-6">
          Press anywhere or click the button to continue
        </p>
      </div>

      {/* Click anywhere to dismiss */}
      <button
        className="absolute inset-0 z-0"
        onClick={handleDismiss}
        aria-label="Dismiss welcome"
      />
    </div>
  )
}
