import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generatePin, hashPin } from '@/lib/auth/pin'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/auth/phone'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const body = await request.json()
    const { phone, email, fullName } = body

    // Validate required fields
    if (!phone || !fullName || !email) {
      return NextResponse.json(
        { error: 'Phone number, email, and full name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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
    const normalizedEmail = email.toLowerCase().trim()

    // Check if phone or email already exists
    const { data: existingByPhone } = await (supabaseAdmin
      .from('students') as any)
      .select('id')
      .eq('phone', formattedPhone)
      .single()

    if (existingByPhone) {
      return NextResponse.json(
        { error: 'A student with this phone number already exists' },
        { status: 409 }
      )
    }

    const { data: existingByEmail } = await (supabaseAdmin
      .from('students') as any)
      .select('id')
      .eq('email', normalizedEmail)
      .single()

    if (existingByEmail) {
      return NextResponse.json(
        { error: 'A student with this email already exists' },
        { status: 409 }
      )
    }

    // Generate PIN
    const pin = generatePin()
    const pinHash = await hashPin(pin)

    // Get next available teacher (round-robin) - non-blocking
    let assignedTeacherId = null
    try {
      const { data: teacherData, error: teacherError } = await supabaseAdmin.rpc('get_next_available_teacher')
      if (teacherError) {
        console.warn('Teacher assignment warning:', teacherError.message)
      } else {
        assignedTeacherId = teacherData
      }
    } catch (teacherErr) {
      console.warn('Teacher assignment failed, continuing without:', teacherErr)
    }

    // Create student record
    const { data: student, error: studentError } = await (supabaseAdmin
      .from('students') as any)
      .insert({
        phone: formattedPhone,
        email: normalizedEmail,
        whatsapp_number: formattedPhone, // Use phone as fallback for whatsapp
        full_name: fullName,
        pin_hash: pinHash,
        status: 'pending',
        assigned_teacher_id: assignedTeacherId,
      })
      .select()
      .single()

    if (studentError) {
      console.error('Student creation error:', studentError)
      // Return specific error message
      if (studentError.code === '23505') {
        return NextResponse.json(
          { error: 'A student with this phone number or email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: `Database error: ${studentError.message}` },
        { status: 500 }
      )
    }

    // Log the registration (no PIN sent yet - admin approval required)
    try {
      await (supabaseAdmin
        .from('whatsapp_messages') as any)
        .insert({
          student_id: student.id,
          message_type: 'notification',
          template_name: 'registration',
          message_content: `New student registration: ${fullName} - awaiting admin approval`,
          status: 'pending',
          sent_at: new Date().toISOString(),
        })
    } catch (logError) {
      console.warn('Failed to log registration:', logError)
    }

    // Return success - NO PIN, NO session (requires admin approval)
    return NextResponse.json({
      success: true,
      message: 'Registration submitted! Awaiting admin approval.',
      requiresApproval: true,
      student: {
        id: student.id,
        fullName: student.full_name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Registration failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
