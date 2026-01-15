import bcrypt from 'bcryptjs'

/**
 * Generate a random 6-digit PIN
 */
export function generatePin(): string {
  const pin = Math.floor(100000 + Math.random() * 900000).toString()
  return pin
}

/**
 * Hash a PIN using bcrypt
 */
export async function hashPin(pin: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(pin, salt)
}

/**
 * Verify a PIN against a hash
 */
export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash)
}

/**
 * Validate PIN format (6 digits)
 */
export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin)
}
