import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { verifyPin, isValidPin } from '@/lib/auth/pin'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/auth/phone'
import { createStudentSession, setStudentSessionCookie } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const body = await request.json()
    const { phone, pin } = body

    // Validate required fields
    if (!phone || !pin) {
      return NextResponse.json(
        { error: 'Phone number and PIN are required' },
        { status: 400 }
      )
    }

    // Validate PIN format
    if (!isValidPin(pin)) {
      return NextResponse.json(
        { error: 'Invalid PIN format. PIN must be 6 digits.' },
        { status: 400 }
      )
    }

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Format phone number
    const formattedPhone = formatPhoneNumber(phone) || phone

    // Find student by phone
    const { data: student, error: findError } = await (supabaseAdmin
      .from('students') as any)
      .select('*')
      .eq('phone', formattedPhone)
      .single()

    if (findError || !student) {
      return NextResponse.json(
        { error: 'No account found with this phone number' },
        { status: 404 }
      )
    }

    // Check if student is pending approval
    if (student.status === 'pending') {
      return NextResponse.json(
        { error: 'Your account is pending approval. You will receive your PIN via WhatsApp once approved.' },
        { status: 403 }
      )
    }

    // Check if student is inactive
    if (student.status === 'inactive') {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify PIN
    const isPinValid = await verifyPin(pin, student.pin_hash)
    if (!isPinValid) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Update last login and login count
    await (supabaseAdmin
      .from('students') as any)
      .update({
        last_login: new Date().toISOString(),
        login_count: (student.login_count || 0) + 1,
      })
      .eq('id', student.id)

    // Create session token
    const token = await createStudentSession({
      id: student.id,
      phone: student.phone,
      fullName: student.full_name,
    })

    // Set session cookie
    await setStudentSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      student: {
        id: student.id,
        phone: student.phone,
        fullName: student.full_name,
        status: student.status,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
}
