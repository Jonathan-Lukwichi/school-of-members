import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { generatePin, hashPin } from '@/lib/auth/pin'
import { sendNewPinNotification, sendTeacherAssignmentNotification } from '@/lib/whatsapp/twilio'

// GET - List all students
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const teacherId = searchParams.get('teacherId')

    // Build query
    let query = (supabaseAdmin
      .from('students') as any)
      .select(`
        *,
        assigned_teacher:teachers(id, full_name, email)
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (teacherId) {
      query = query.eq('assigned_teacher_id', teacherId)
    }

    const { data: students, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Fetch students error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// PATCH - Update student (status, teacher assignment, reset PIN)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, assignedTeacherId, resetPin } = body

    if (!id) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    // Get current student data
    const { data: student } = await (supabaseAdmin
      .from('students') as any)
      .select('*, assigned_teacher:teachers(id, full_name)')
      .eq('id', id)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    let newPin: string | null = null

    // Handle PIN reset
    if (resetPin) {
      newPin = generatePin()
      const pinHash = await hashPin(newPin)
      updateData.pin_hash = pinHash

      // Send new PIN via WhatsApp
      await sendNewPinNotification(student.whatsapp_number, newPin)

      // Log the message
      await (supabaseAdmin
        .from('whatsapp_messages') as any)
        .insert({
          student_id: id,
          message_type: 'pin',
          template_name: 'new_pin',
          message_content: 'New PIN sent to student',
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
    }

    // Handle status update
    if (status) {
      updateData.status = status
    }

    // Handle teacher assignment
    if (assignedTeacherId !== undefined) {
      updateData.assigned_teacher_id = assignedTeacherId

      // If assigning a new teacher, send notification
      if (assignedTeacherId && assignedTeacherId !== student.assigned_teacher_id) {
        const { data: newTeacher } = await (supabaseAdmin
          .from('teachers') as any)
          .select('full_name')
          .eq('id', assignedTeacherId)
          .single()

        if (newTeacher) {
          await sendTeacherAssignmentNotification(
            student.whatsapp_number,
            student.full_name,
            newTeacher.full_name
          )

          // Log the message
          await (supabaseAdmin
            .from('whatsapp_messages') as any)
            .insert({
              student_id: id,
              teacher_id: assignedTeacherId,
              message_type: 'notification',
              template_name: 'teacher_assigned',
              message_content: `Teacher ${newTeacher.full_name} assigned to student`,
              status: 'sent',
              sent_at: new Date().toISOString(),
            })
        }
      }
    }

    // Update student
    const { data: updatedStudent, error } = await (supabaseAdmin
      .from('students') as any)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        assigned_teacher:teachers(id, full_name, email)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      student: updatedStudent,
      ...(newPin && process.env.NODE_ENV === 'development' && { newPin }),
    })
  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a student
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('id')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 })
    }

    const { error } = await (supabaseAdmin
      .from('students') as any)
      .delete()
      .eq('id', studentId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    )
  }
}
