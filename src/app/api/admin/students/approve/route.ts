import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generatePin, hashPin } from '@/lib/auth/pin'
import { sendWhatsAppMessage } from '@/lib/whatsapp/twilio'

export async function POST(request: NextRequest) {
  try {
    // Verify admin is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user is admin
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile as any).role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { studentId } = body

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Get student details
    const { data: student, error: fetchError } = await (supabaseAdmin
      .from('students') as any)
      .select('*')
      .eq('id', studentId)
      .single()

    if (fetchError || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (student.status !== 'pending') {
      return NextResponse.json(
        { error: 'Student is not pending approval' },
        { status: 400 }
      )
    }

    // Generate new PIN
    const pin = generatePin()
    const pinHash = await hashPin(pin)

    // Update student status to active with new PIN
    const { error: updateError } = await (supabaseAdmin
      .from('students') as any)
      .update({
        status: 'active',
        pin_hash: pinHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to approve student' },
        { status: 500 }
      )
    }

    // Send WhatsApp message with PIN
    const whatsappNumber = student.whatsapp_number || student.phone
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://schoolofmembers.com'

    const message = `🎉 Welcome to School of Members, ${student.full_name}!

Your registration has been approved!

📱 Your Login PIN: *${pin}*

Login at: ${appUrl}/student/login

Use your phone number and this PIN to access your courses.

God bless you! 🙏`

    const whatsappResult = await sendWhatsAppMessage(whatsappNumber, message)

    // Log the message
    try {
      await (supabaseAdmin
        .from('whatsapp_messages') as any)
        .insert({
          student_id: studentId,
          message_type: 'notification',
          template_name: 'approval',
          message_content: message,
          twilio_sid: whatsappResult.sid || null,
          status: whatsappResult.success ? 'sent' : 'failed',
          error_message: whatsappResult.error || null,
          sent_at: whatsappResult.success ? new Date().toISOString() : null,
        })
    } catch (logError) {
      console.warn('Failed to log WhatsApp message:', logError)
    }

    return NextResponse.json({
      success: true,
      message: 'Student approved and PIN sent via WhatsApp',
      whatsappSent: whatsappResult.success,
      whatsappError: whatsappResult.error || null,
    })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Failed to approve student' },
      { status: 500 }
    )
  }
}
