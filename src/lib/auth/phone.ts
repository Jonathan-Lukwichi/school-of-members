import {
  parsePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js'

export interface CountryOption {
  code: CountryCode
  name: string
  dialCode: string
  flag: string
}

// Common countries for the platform (prioritized list)
const PRIORITY_COUNTRIES: CountryCode[] = [
  'ZA', // South Africa
  'CD', // Democratic Republic of Congo
  'CG', // Republic of Congo
  'FR', // France
  'BE', // Belgium
  'GB', // United Kingdom
  'US', // United States
  'CA', // Canada
  'NG', // Nigeria
  'KE', // Kenya
  'GH', // Ghana
  'CM', // Cameroon
]

// Country names mapping
const COUNTRY_NAMES: Record<string, string> = {
  ZA: 'South Africa',
  CD: 'DR Congo',
  CG: 'Congo',
  FR: 'France',
  BE: 'Belgium',
  GB: 'United Kingdom',
  US: 'United States',
  CA: 'Canada',
  NG: 'Nigeria',
  KE: 'Kenya',
  GH: 'Ghana',
  CM: 'Cameroon',
  AO: 'Angola',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
  BW: 'Botswana',
  NA: 'Namibia',
  MZ: 'Mozambique',
  TZ: 'Tanzania',
  UG: 'Uganda',
  RW: 'Rwanda',
  BI: 'Burundi',
  ET: 'Ethiopia',
  EG: 'Egypt',
  MA: 'Morocco',
  TN: 'Tunisia',
  DZ: 'Algeria',
  SN: 'Senegal',
  CI: "Cote d'Ivoire",
  ML: 'Mali',
  BF: 'Burkina Faso',
  NE: 'Niger',
  TD: 'Chad',
  CF: 'Central African Republic',
  GA: 'Gabon',
  GQ: 'Equatorial Guinea',
  DE: 'Germany',
  NL: 'Netherlands',
  IT: 'Italy',
  ES: 'Spain',
  PT: 'Portugal',
  CH: 'Switzerland',
  AT: 'Austria',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  PL: 'Poland',
  IE: 'Ireland',
  AU: 'Australia',
  NZ: 'New Zealand',
  IN: 'India',
  BR: 'Brazil',
  MX: 'Mexico',
}

// Flag emoji helper
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

/**
 * Get list of countries with dial codes for phone input
 */
export function getCountryOptions(): CountryOption[] {
  const allCountries = getCountries()

  // Create options for priority countries first
  const priorityOptions: CountryOption[] = PRIORITY_COUNTRIES
    .filter(code => allCountries.includes(code))
    .map(code => ({
      code,
      name: COUNTRY_NAMES[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: getCountryFlag(code),
    }))

  // Create options for remaining countries
  const remainingOptions: CountryOption[] = allCountries
    .filter(code => !PRIORITY_COUNTRIES.includes(code))
    .map(code => ({
      code,
      name: COUNTRY_NAMES[code] || code,
      dialCode: `+${getCountryCallingCode(code)}`,
      flag: getCountryFlag(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return [...priorityOptions, ...remainingOptions]
}

/**
 * Validate a phone number
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode?: CountryCode
): boolean {
  try {
    return isValidPhoneNumber(phoneNumber, countryCode)
  } catch {
    return false
  }
}

/**
 * Parse and format a phone number
 */
export function formatPhoneNumber(
  phoneNumber: string,
  countryCode?: CountryCode
): string | null {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    if (parsed) {
      return parsed.format('E.164') // International format: +27123456789
    }
    return null
  } catch {
    return null
  }
}

/**
 * Format phone number for display
 */
export function formatPhoneForDisplay(
  phoneNumber: string,
  countryCode?: CountryCode
): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    if (parsed) {
      return parsed.formatInternational() // +27 12 345 6789
    }
    return phoneNumber
  } catch {
    return phoneNumber
  }
}

/**
 * Format phone number for WhatsApp
 */
export function formatPhoneForWhatsApp(phoneNumber: string): string {
  // WhatsApp expects format: whatsapp:+27123456789
  const formatted = formatPhoneNumber(phoneNumber)
  if (formatted) {
    return `whatsapp:${formatted}`
  }
  // Fallback: remove any non-digit characters except +
  return `whatsapp:${phoneNumber.replace(/[^\d+]/g, '')}`
}

/**
 * Get country code from phone number
 */
export function getCountryFromPhone(phoneNumber: string): CountryCode | undefined {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed?.country
  } catch {
    return undefined
  }
}
