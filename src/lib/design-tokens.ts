// Design tokens for unified UI across the application
// These constants ensure visual consistency between admin and student portals

export const colors = {
  // Primary brand colors
  primary: {
    navy: '#003366',
    navyLight: '#004080',
    navyDark: '#002244',
  },
  // Accent colors
  accent: {
    gold: '#b5985b',
    goldLight: '#D4AF37',
    red: '#C8102E',
    redLight: '#E91E3E',
  },
  // Neutral colors
  neutral: {
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
  },
  // Status colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const

// Gradient for accent bar at top of cards
export const gradients = {
  brandBar: 'linear-gradient(to right, #003366, #b5985b, #C8102E)',
  goldShine: 'linear-gradient(135deg, #D4AF37 0%, #b5985b 50%, #D4AF37 100%)',
  navyGlow: 'radial-gradient(circle at 50% 0%, rgba(0,51,102,0.1) 0%, transparent 50%)',
} as const

// Consistent spacing values
export const spacing = {
  cardPadding: '2rem',
  sectionGap: '1.5rem',
  inputGap: '0.5rem',
} as const

// Animation durations
export const animations = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const

// Shadow presets
export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  button: '0 4px 14px 0 rgba(0, 51, 102, 0.3)',
  input: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
} as const

// User type configuration
export const userTypes = {
  admin: {
    label: 'Admin / Teacher',
    color: colors.accent.red,
    description: 'Sign in with your email and password',
    icon: 'Shield',
  },
  student: {
    label: 'Student',
    color: colors.primary.navy,
    description: 'Sign in with your phone number and PIN',
    icon: 'GraduationCap',
  },
} as const

// Tailwind class presets for consistent styling
export const tailwindPresets = {
  // Input field styling
  input: `
    flex h-11 w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-2
    text-base text-[#1e293b] shadow-sm transition-all duration-200 outline-none
    placeholder:text-[#9ca3af] hover:border-[#cbd5e1]
    focus:border-[#003366]/50 focus:ring-2 focus:ring-[#003366]/20
    disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
  `.replace(/\s+/g, ' ').trim(),

  // Primary button styling
  buttonPrimary: `
    w-full h-12 bg-[#003366] hover:bg-[#002244] text-white font-medium
    text-base shadow-lg shadow-[#003366]/30 transition-all duration-200
  `.replace(/\s+/g, ' ').trim(),

  // Secondary/outline button styling
  buttonOutline: `
    border-[#003366]/30 text-[#003366] hover:bg-[#003366]/5
  `.replace(/\s+/g, ' ').trim(),

  // Card container styling
  card: `
    bg-white rounded-lg shadow-xl border border-[#e2e8f0]
  `.replace(/\s+/g, ' ').trim(),

  // Label styling
  label: `
    flex items-center gap-2 text-[#64748b] text-sm
  `.replace(/\s+/g, ' ').trim(),

  // Error message styling
  error: `
    p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2
  `.replace(/\s+/g, ' ').trim(),
} as const
