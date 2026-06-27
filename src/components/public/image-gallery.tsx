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
  textPosition?: 'top' | 'center' | 'bottom'
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
  textPosition = 'center',
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
        <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/30 via-transparent to-ink-deep/90 z-10" />
      )}

      {/* Emerald Glow Effect */}
      <div className="absolute inset-0 bg-emerald/5 z-10 mix-blend-overlay" />

      {/* Content Overlay */}
      {(title || subtitle) && (
        <div className={cn(
          "absolute inset-0 flex justify-center z-20",
          textPosition === 'top' && "items-start pt-20",
          textPosition === 'bottom' && "items-end pb-20",
          textPosition === 'center' && "items-center"
        )}>
          <div className="text-center px-6 py-8 mx-4 rounded-2xl glass">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tight [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%),_0_0_30px_rgb(0_0_0_/_50%)]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-medium leading-relaxed [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
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
                'gallery-dot h-2 w-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald',
                index === currentIndex
                  ? 'bg-emerald w-8'
                  : 'bg-white/40 hover:bg-white/60'
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
    <div className="relative max-w-lg mx-auto">
      {/* Main Image */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-premium-xl">
        <Image
          src={images[currentIndex]}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <p className="text-emerald text-sm font-bold uppercase tracking-widest mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-display font-bold text-white tracking-tight">{name}</h3>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 justify-center mt-6">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald',
                index === currentIndex
                  ? 'border-emerald opacity-100 ring-2 ring-emerald/30'
                  : 'border-transparent opacity-50 hover:opacity-80'
              )}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}