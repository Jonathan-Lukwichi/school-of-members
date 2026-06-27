'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Crown, Star, ChevronLeft, ChevronRight } from 'lucide-react'

export interface Leader {
  name: string
  title: string
  role: string
  description: string
  images: string[]
  badgeIcon?: 'crown' | 'star'
  color?: 'amber' | 'forest'
}

interface LeaderShowcaseProps {
  leaders: Leader[]
  autoPlay?: boolean
  interval?: number
}

export function LeaderShowcase({
  leaders,
  autoPlay = true,
  interval = 8000,
}: LeaderShowcaseProps) {
  const [currentLeaderIndex, setCurrentLeaderIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const currentLeader = leaders[currentLeaderIndex]
  const BadgeIcon = currentLeader.badgeIcon === 'crown' ? Crown : Star

  // Get emerald-tinted accent classes. The two legacy tones (amber/forest)
  // map to a lighter vs. core emerald so the two leaders stay distinguishable.
  const getColorClasses = (color: string = 'forest') => {
    if (color === 'amber') {
      return {
        badge: 'bg-emerald-light/10 border-emerald-light/30 text-emerald-light',
        glow: 'shadow-emerald',
        border: 'border-emerald-light/50',
        text: 'text-emerald-light',
        progressBar: 'bg-gradient-to-r from-emerald-top to-emerald-light',
        progressGlow: 'shadow-[0_0_10px_rgba(95,227,188,0.5)]',
      }
    }
    return {
      badge: 'bg-emerald/10 border-emerald/30 text-emerald',
      glow: 'shadow-emerald',
      border: 'border-emerald/50',
      text: 'text-emerald',
      progressBar: 'bg-gradient-to-r from-emerald to-emerald-dark',
      progressGlow: 'shadow-[0_0_10px_rgba(20,206,150,0.5)]',
    }
  }

  const colors = getColorClasses(currentLeader.color)

  // Navigate to next leader
  const goToNext = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentLeaderIndex((prev) => (prev + 1) % leaders.length)
      setCurrentImageIndex(0)
      setProgress(0)
      setIsAnimating(true)
    }, 100)
  }, [leaders.length])

  // Navigate to previous leader
  const goToPrevious = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentLeaderIndex((prev) => (prev - 1 + leaders.length) % leaders.length)
      setCurrentImageIndex(0)
      setProgress(0)
      setIsAnimating(true)
    }, 100)
  }, [leaders.length])

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (interval / 50))
      })
    }, 50)

    const slideInterval = setInterval(() => {
      goToNext()
    }, interval)

    return () => {
      clearInterval(progressInterval)
      clearInterval(slideInterval)
    }
  }, [autoPlay, interval, goToNext])

  // Cycle through images within current leader
  useEffect(() => {
    if (currentLeader.images.length <= 1) return

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentLeader.images.length)
    }, 4000)

    return () => clearInterval(imageInterval)
  }, [currentLeader.images.length, currentLeaderIndex])

  return (
    <section className="leader-showcase relative overflow-hidden bg-gradient-to-br from-ink-green to-ink-deep">
      {/* Main Content */}
      <div className="leader-slide grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        {/* Image Side */}
        <div className="relative h-[40vh] lg:h-auto overflow-hidden">
          {/* Background glow */}
          <div className={`absolute inset-0 ${currentLeader.color === 'amber' ? 'bg-emerald-light/5' : 'bg-emerald/5'}`} />

          {/* Images with Ken Burns effect */}
          {currentLeader.images.map((image, index) => (
            <div
              key={`${currentLeaderIndex}-${index}`}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={currentLeader.name}
                fill
                className="object-cover panoramic-image"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink-green/90 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-green via-transparent to-transparent lg:hidden" />

          {/* Image indicators (mobile) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
            {currentLeader.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                  index === currentImageIndex
                    ? `${currentLeader.color === 'amber' ? 'bg-emerald-light' : 'bg-emerald'} scale-125`
                    : 'bg-white/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Side */}
        <div className="relative flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16">
          {/* Animated content */}
          <div className={`space-y-6 ${isAnimating ? 'animate-content-reveal' : 'opacity-0'}`}>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 ${colors.badge} border rounded-full px-4 py-2 animate-slide-in-top`}
              style={{ animationDelay: '0.1s' }}
            >
              <BadgeIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{currentLeader.role}</span>
            </div>

            {/* Title */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <p className={`text-sm font-semibold uppercase tracking-widest ${colors.text} mb-2`}>
                {currentLeader.title}
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {currentLeader.name}
              </h2>
            </div>

            {/* Decorative line */}
            <div
              className={`w-24 h-1 rounded-full ${colors.progressBar} ${colors.progressGlow} animate-fade-in-up`}
              style={{ animationDelay: '0.5s' }}
            />

            {/* Description */}
            <p
              className="text-white/70 text-lg leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              {currentLeader.description}
            </p>

            {/* Image thumbnails (desktop) */}
            <div
              className="hidden lg:flex gap-3 pt-4 animate-fade-in-up"
              style={{ animationDelay: '0.8s' }}
            >
              {currentLeader.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                    index === currentImageIndex
                      ? `${colors.border} scale-110 ${colors.glow} shadow-lg`
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${currentLeader.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          {leaders.length > 1 && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                aria-label="Previous leader"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                aria-label="Next leader"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-ink-green/80 backdrop-blur-sm">
        {/* Progress bar */}
        <div className="showcase-progress h-1 bg-white/10">
          <div
            className={`showcase-progress-bar h-full ${colors.progressBar} ${colors.progressGlow}`}
            style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
          />
        </div>

        {/* Dots and info */}
        <div className="flex items-center justify-between px-6 py-3">
          {/* Leader dots */}
          <div className="flex gap-3">
            {leaders.map((leader, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(false)
                  setTimeout(() => {
                    setCurrentLeaderIndex(index)
                    setCurrentImageIndex(0)
                    setProgress(0)
                    setIsAnimating(true)
                  }, 100)
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
                  index === currentLeaderIndex
                    ? `${getColorClasses(leader.color).badge} border`
                    : 'text-white/40 hover:text-white/60'
                }`}
                aria-label={`View ${leader.title}`}
              >
                {leader.badgeIcon === 'crown' ? (
                  <Crown className="h-4 w-4" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
                <span className="text-sm font-medium hidden sm:inline">{leader.title}</span>
              </button>
            ))}
          </div>

          {/* Slide counter */}
          <div className="text-white/40 text-sm">
            <span className="text-white">{currentLeaderIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{leaders.length}</span>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {leaders.length > 1 && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 lg:hidden">
          <button
            onClick={goToPrevious}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            aria-label="Previous leader"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            aria-label="Next leader"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  )
}
