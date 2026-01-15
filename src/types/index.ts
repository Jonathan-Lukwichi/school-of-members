// Database types
export * from './database'

// Auth types
export type { UserRole } from './database'

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    role?: 'admin' | 'student'
    avatar_url?: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  phone?: string
}
