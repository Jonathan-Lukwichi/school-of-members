'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'

export interface StaffShowcaseMember {
  name: string
  role: string
  description: string
  image: string
}

interface StaffShowcaseProps {
  staff: StaffShowcaseMember[]
  autoPlay?: boolean
  interval?: number
}

export function StaffShowcase({
  staff,
  autoPlay = true,
  interval = 6000,
}: StaffShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const currentStaff = staff[currentIndex]

  // Navigate to next staff
  const goToNext = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % staff.length)
      setProgress(0)
      setIsAnimating(true)
    }, 100)
  }, [staff.length])

  // Navigate to previous staff
  const goToPrevious = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + staff.length) % staff.length)
      setProgress(0)
      setIsAnimating(true)
    }, 100)
  }, [staff.length])

  // Navigate to specific staff
  const goToStaff = (index: number) => {
    if (index === currentIndex) return
    setIsAnimating(false)
    setTimeout(() => {
      setCurrentIndex(index)
      setProgress(0)
      setIsAnimating(true)
    }, 100)
  }

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

  return (
    <section className="staff-showcase relative bg-ink-green overflow-hidden">
      {/* Header */}
      <div className="text-center pt-12 pb-6 px-6">
        <div className="inline-flex items-center gap-2 bg-emerald/10 border border-emerald/30 rounded-full px-4 py-2 mb-6">
          <Users className="h-5 w-5 text-emerald" />
          <span className="text-sm font-medium text-emerald">Our Team</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
          Meet Our Staff
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          Dedicated servants leading the School of Members with passion and excellence.
        </p>
      </div>

      {/* Featured Staff */}
      <div className="staff-featured flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6 py-8">
        {/* Photo */}
        <div className={`relative ${isAnimating ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-emerald/20 rounded-3xl blur-2xl" />

          {/* Photo container */}
          <div className="staff-photo-large relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border-4 border-emerald/40 shadow-[0_0_40px_rgba(20,206,150,0.3),0_25px_50px_rgba(0,0,0,0.5)]">
            <Image
              src={currentStaff.image}
              alt={currentStaff.name}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-green/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Content */}
        <div className={`text-center md:text-left max-w-md ${isAnimating ? 'animate-content-reveal' : 'opacity-0'}`}>
          {/* Role badge */}
          <div
            className="inline-block bg-emerald/10 border border-emerald/30 rounded-full px-4 py-1.5 mb-4 animate-slide-in-top"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-emerald text-sm font-semibold uppercase tracking-wider">
              {currentStaff.role}
            </span>
          </div>

          {/* Name */}
          <h3
            className="font-display text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-in-left"
            style={{ animationDelay: '0.4s' }}
          >
            {currentStaff.name}
          </h3>

          {/* Decorative line */}
          <div
            className="w-16 h-1 bg-gradient-to-r from-emerald to-emerald-dark rounded-full mb-6 mx-auto md:mx-0 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          />

          {/* Description */}
          <p
            className="text-white/70 text-lg leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            &ldquo;{currentStaff.description}&rdquo;
          </p>

          {/* Navigation arrows (mobile) */}
          <div className="flex justify-center gap-4 mt-8 md:hidden">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation arrows (desktop) */}
        <div className="hidden md:flex flex-col gap-3">
          <button
            onClick={goToPrevious}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            aria-label="Previous staff"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald"
            aria-label="Next staff"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="staff-thumbnails flex flex-wrap justify-center gap-4 px-6 py-6">
        {staff.map((member, index) => (
          <button
            key={index}
            onClick={() => goToStaff(index)}
            aria-label={`View ${member.name}`}
            className={`group relative transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald ${
              index === currentIndex
                ? 'scale-110'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            {/* Thumbnail image */}
            <div
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 transition-all duration-300 ${
                index === currentIndex
                  ? 'border-emerald shadow-[0_0_20px_rgba(20,206,150,0.5)]'
                  : 'border-white/20 group-hover:border-white/40'
              }`}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Name tooltip */}
            <div
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-opacity ${
                index === currentIndex ? 'text-emerald opacity-100' : 'text-white/50 opacity-0 group-hover:opacity-100'
              }`}
            >
              {member.name.split(' ')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="showcase-progress h-1 bg-white/10 mt-4">
        <div
          className="showcase-progress-bar h-full bg-gradient-to-r from-emerald to-emerald-dark shadow-[0_0_10px_rgba(20,206,150,0.5)]"
          style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
        />
      </div>

      {/* Slide counter */}
      <div className="text-center py-4">
        <span className="text-white/40 text-sm">
          <span className="text-emerald font-semibold">{currentIndex + 1}</span>
          <span className="mx-2">/</span>
          <span>{staff.length}</span>
        </span>
      </div>
    </section>
  )
}
