import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { StudentSession } from './types'

const JWT_SECRET = new TextEncoder().encode(
  process.env.STUDENT_JWT_SECRET || 'your-student-jwt-secret-key-min-32-chars'
)

const COOKIE_NAME = 'som_student_session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

/**
 * Create a JWT token for a student session
 */
export async function createStudentSession(student: {
  id: string
  phone: string
  fullName: string
}): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION

  const token = await new SignJWT({
    studentId: student.id,
    phone: student.phone,
    fullName: student.fullName,
    exp: Math.floor(expiresAt / 1000),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify and decode a student session token
 */
export async function verifyStudentSession(token: string): Promise<StudentSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as StudentSession
  } catch {
    return null
  }
}

/**
 * Set the student session cookie (server-side)
 */
export async function setStudentSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })
}

/**
 * Get the student session from cookie (server-side)
 */
export async function getStudentSessionFromCookie(): Promise<StudentSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyStudentSession(token)
}

/**
 * Clear the student session cookie (server-side)
 */
export async function clearStudentSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Hash a session token for storage in database
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
