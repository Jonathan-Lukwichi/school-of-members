import { NextResponse } from 'next/server'
import { clearStudentSessionCookie } from '@/lib/auth/session'

export async function POST() {
  try {
    // Clear the session cookie
    await clearStudentSessionCookie()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
