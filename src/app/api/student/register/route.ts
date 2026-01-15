import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generatePin, hashPin } from '@/lib/auth/pin'
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/auth/phone'
import { createStudentSession, setStudentSessionCookie } from '@/lib/auth/session'
import { sendWelcomeMessage } from '@/lib/whatsapp/twilio'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const body = await request.json()
    const { phone, whatsappNumber, fullName } = body

    // Validate required fields
    if (!phone || !fullName) {
      return NextResponse.json(
        { error: 'Phone number and full name are required' },
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

    // Format phone numbers
    const formattedPhone = formatPhoneNumber(phone) || phone
    const formattedWhatsApp = whatsappNumber
      ? formatPhoneNumber(whatsappNumber) || whatsappNumber
      : formattedPhone

    // Check if phone already exists
    const { data: existingStudent } = await (supabaseAdmin
      .from('students') as any)
      .select('id')
      .eq('phone', formattedPhone)
      .single()

    if (existingStudent) {
      return NextResponse.json(
        { error: 'A student with this phone number already exists' },
        { status: 409 }
      )
    }

    // Generate PIN
    const pin = generatePin()
    const pinHash = await hashPin(pin)

    // Get next available teacher (round-robin)
    const { data: teacherData } = await supabaseAdmin.rpc('get_next_available_teacher')
    const assignedTeacherId = teacherData || null

    // Create student record
    const { data: student, error: studentError } = await (supabaseAdmin
      .from('students') as any)
      .insert({
        phone: formattedPhone,
        whatsapp_number: formattedWhatsApp,
        full_name: fullName,
        pin_hash: pinHash,
        status: 'pending',
        assigned_teacher_id: assignedTeacherId,
      })
      .select()
      .single()

    if (studentError) {
      console.error('Student creation error:', studentError)
      return NextResponse.json(
        { error: studentError.message },
        { status: 500 }
      )
    }

    // Send welcome message with PIN via WhatsApp
    const whatsappResult = await sendWelcomeMessage(formattedWhatsApp, pin)

    // Log the WhatsApp message
    await (supabaseAdmin
      .from('whatsapp_messages') as any)
      .insert({
        student_id: student.id,
        message_type: 'welcome',
        template_name: 'welcome',
        message_content: `Welcome message with PIN sent`,
        twilio_sid: whatsappResult.sid || null,
        status: whatsappResult.success ? 'sent' : 'failed',
        error_message: whatsappResult.error || null,
        sent_at: whatsappResult.success ? new Date().toISOString() : null,
      })

    // Create session
    const token = await createStudentSession({
      id: student.id,
      phone: student.phone,
      fullName: student.full_name,
    })

    // Set session cookie
    await setStudentSessionCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your PIN has been sent via WhatsApp.',
      student: {
        id: student.id,
        phone: student.phone,
        fullName: student.full_name,
        status: student.status,
      },
      whatsappSent: whatsappResult.success,
      // Only return PIN in development for testing
      ...(process.env.NODE_ENV === 'development' && { pin }),
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register student' },
      { status: 500 }
    )
  }
}
