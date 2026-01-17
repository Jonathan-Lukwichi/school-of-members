'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  photo_url?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, testimonials.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Main testimonial card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#003366]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#b5985b]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Quote icon */}
        <div className="relative z-10">
          <Quote className="h-12 w-12 text-[#b5985b] mb-6" />

          {/* Content */}
          <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
            "{currentTestimonial.content}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4">
            {currentTestimonial.photo_url ? (
              <img
                src={currentTestimonial.photo_url}
                alt={currentTestimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#003366]/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold text-lg">
                {currentTestimonial.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-[#003366] text-lg">
                {currentTestimonial.name}
              </p>
              <p className="text-gray-500">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {testimonials.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-[#003366] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
