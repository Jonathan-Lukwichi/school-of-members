'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { getCountryOptions, formatPhoneNumber, validatePhoneNumber, type CountryOption } from '@/lib/auth/phone'
import type { CountryCode } from 'libphonenumber-js'

interface PhoneInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  defaultCountry?: CountryCode
  placeholder?: string
  disabled?: boolean
  error?: string
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = 'ZA',
  placeholder = 'Enter phone number',
  disabled = false,
  error,
}: PhoneInputProps) {
  const [countries] = useState<CountryOption[]>(getCountryOptions())
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null)
  const [open, setOpen] = useState(false)
  const [localValue, setLocalValue] = useState('')

  // Initialize with default country
  useEffect(() => {
    if (!selectedCountry) {
      const defaultOption = countries.find(c => c.code === defaultCountry)
      if (defaultOption) {
        setSelectedCountry(defaultOption)
      }
    }
  }, [countries, defaultCountry, selectedCountry])

  // Parse existing value if provided
  useEffect(() => {
    if (value && !localValue) {
      // Try to extract the phone number without country code
      const parsed = value.replace(/^\+\d{1,3}/, '').trim()
      setLocalValue(parsed)
    }
  }, [value, localValue])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d]/g, '') // Only allow digits
    setLocalValue(inputValue)

    if (selectedCountry && inputValue) {
      const fullNumber = `${selectedCountry.dialCode}${inputValue}`
      const formatted = formatPhoneNumber(fullNumber, selectedCountry.code)
      const isValid = validatePhoneNumber(fullNumber, selectedCountry.code)
      onChange(formatted || fullNumber, isValid)
    } else {
      onChange('', false)
    }
  }

  const handleCountryChange = (country: CountryOption) => {
    setSelectedCountry(country)
    setOpen(false)

    if (localValue) {
      const fullNumber = `${country.dialCode}${localValue}`
      const formatted = formatPhoneNumber(fullNumber, country.code)
      const isValid = validatePhoneNumber(fullNumber, country.code)
      onChange(formatted || fullNumber, isValid)
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        {/* Country Selector */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[120px] justify-between"
              disabled={disabled}
            >
              {selectedCountry ? (
                <span className="flex items-center gap-1">
                  <span>{selectedCountry.flag}</span>
                  <span className="text-xs">{selectedCountry.dialCode}</span>
                </span>
              ) : (
                'Select'
              )}
              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.dialCode}`}
                      onSelect={() => handleCountryChange(country)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedCountry?.code === country.code
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <span className="mr-2">{country.flag}</span>
                      <span className="flex-1">{country.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {country.dialCode}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <Input
          type="tel"
          placeholder={placeholder}
          value={localValue}
          onChange={handlePhoneChange}
          disabled={disabled}
          className={cn('flex-1', error && 'border-red-500')}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
