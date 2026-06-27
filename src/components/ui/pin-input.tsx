'use client'

import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface PinInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
  autoFocus?: boolean
  onComplete?: (value: string) => void
}

export function PinInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = false,
  onComplete,
}: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Convert value to array for display
  const valueArray = value.split('').slice(0, length)
  while (valueArray.length < length) {
    valueArray.push('')
  }

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  // Handle completion
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value)
    }
  }, [value, length, onComplete])

  const handleChange = (index: number, inputValue: string) => {
    // Only allow single digit
    const digit = inputValue.replace(/[^\d]/g, '').slice(-1)

    if (digit) {
      // Build new value
      const newValueArray = [...valueArray]
      newValueArray[index] = digit
      const newValue = newValueArray.join('')
      onChange(newValue)

      // Move to next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()

      if (valueArray[index]) {
        // Clear current cell
        const newValueArray = [...valueArray]
        newValueArray[index] = ''
        onChange(newValueArray.join(''))
      } else if (index > 0) {
        // Move to previous cell and clear it
        const newValueArray = [...valueArray]
        newValueArray[index - 1] = ''
        onChange(newValueArray.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, length)
    if (pastedData) {
      onChange(pastedData)

      // Focus the last filled or next empty input
      const focusIndex = Math.min(pastedData.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    // Select the input content
    inputRefs.current[index]?.select()
  }

  const handleBlur = () => {
    setFocusedIndex(-1)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2 sm:gap-3">
        {valueArray.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete="one-time-code"
            className={cn(
              'w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold text-white',
              'border-2 rounded-lg outline-none transition-all duration-200 bg-white/5',
              'focus:border-emerald/60 focus:ring-2 focus:ring-emerald/30',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-400/60',
              focusedIndex === index
                ? 'border-emerald/60 ring-2 ring-emerald/30'
                : 'border-white/15 hover:border-white/25',
              digit && 'bg-emerald/10'
            )}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-300 text-center">{error}</p>
      )}

      <p className="text-xs text-white/50 text-center">
        Enter your 6-digit PIN
      </p>
    </div>
  )
}
