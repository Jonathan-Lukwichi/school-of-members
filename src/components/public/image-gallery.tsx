'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: string[]
  title?: string
  subtitle?: string
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  height?: string
  overlay?: boolean
}

export function ImageGallery({
  images,
  title,
  subtitle,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  height = '60vh',
  overlay = true,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, images.length, interval])

  if (images.length === 0) return null

  return (
    <div
      className="panoramic-gallery relative overflow-hidden"
      style={{ height }}
    >
      {/* Images with Ken Burns effect */}
      {images.map((image, index) => (
        <div
          key={image}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={image}
            alt={`Gallery image ${index + 1}`}
            fill
            className="panoramic-image object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1419]/30 via-transparent to-[#0a1419]/80 z-10" />
      )}

      {/* Blue Glow Effect */}
      <div className="absolute inset-0 bg-forest-400/5 z-10" />

      {/* Content Overlay */}
      {(title || subtitle) && (
        <div className="gallery-overlay z-20">
          <div className="text-center px-6">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 drop-shadow-lg">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Dots */}
      {showDots && images.length > 1 && (
        <div className="gallery-dots">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'gallery-dot',
                index === currentIndex && 'active'
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Leader Gallery with thumbnails for Patriarch/Apostle photos
interface LeaderGalleryProps {
  images: string[]
  name: string
  title: string
}

export function LeaderGallery({ images, name, title }: LeaderGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="leader-gallery">
      {/* Main Image */}
      <div className="leader-image-container">
        <Image
          src={images[currentIndex]}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p className="text-forest-400 text-sm font-semibold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white">{name}</h3>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="leader-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'leader-thumbnail',
                index === currentIndex && 'active'
              )}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                width={60}
                height={60}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
