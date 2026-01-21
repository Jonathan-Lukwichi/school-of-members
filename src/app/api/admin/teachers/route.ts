import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// GET - List all teachers
export async function GET() {
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

    // Get all teachers with their assigned students count
    const { data: teachers, error } = await (supabaseAdmin
      .from('teachers') as any)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('Fetch teachers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    )
  }
}

// POST - Create a new teacher
export async function POST(request: NextRequest) {
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
    const { fullName, email, phone, whatsappNumber, password, maxStudents } = body

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      )
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        role: 'teacher'
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create the profile record with teacher role
    if (authData.user) {
      await (supabaseAdmin
        .from('profiles') as any)
        .upsert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          phone: phone || null,
          role: 'teacher',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      // Create teacher record
      const { data: teacher, error: teacherError } = await (supabaseAdmin
        .from('teachers') as any)
        .insert({
          user_id: authData.user.id,
          full_name: fullName,
          email,
          phone: phone || null,
          whatsapp_number: whatsappNumber || phone || null,
          max_students: maxStudents || 50,
          is_active: true,
        })
        .select()
        .single()

      if (teacherError) {
        console.error('Teacher record creation error:', teacherError)
        // Delete the auth user if teacher record creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: teacherError.message }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Teacher account created successfully',
        teacher: {
          id: teacher.id,
          userId: authData.user.id,
          email: authData.user.email,
          fullName: teacher.full_name,
        }
      })
    }

    return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 })
  } catch (error) {
    console.error('Create teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to create teacher account' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a teacher
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
    const teacherId = searchParams.get('id')

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 })
    }

    // Get the teacher to find the user_id
    const { data: teacher } = await (supabaseAdmin
      .from('teachers') as any)
      .select('user_id')
      .eq('id', teacherId)
      .single()

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    // Delete the auth user (this will cascade to teacher record via trigger)
    if (teacher.user_id) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(teacher.user_id)
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Teacher account deleted successfully'
    })
  } catch (error) {
    console.error('Delete teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to delete teacher account' },
      { status: 500 }
    )
  }
}

// PATCH - Update teacher
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
    const { id, fullName, phone, whatsappNumber, maxStudents, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 })
    }

    // Update teacher record
    const updateData: Record<string, unknown> = {}
    if (fullName !== undefined) updateData.full_name = fullName
    if (phone !== undefined) updateData.phone = phone
    if (whatsappNumber !== undefined) updateData.whatsapp_number = whatsappNumber
    if (maxStudents !== undefined) updateData.max_students = maxStudents
    if (isActive !== undefined) updateData.is_active = isActive

    const { data: teacher, error } = await (supabaseAdmin
      .from('teachers') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      teacher
    })
  } catch (error) {
    console.error('Update teacher error:', error)
    return NextResponse.json(
      { error: 'Failed to update teacher' },
      { status: 500 }
    )
  }
}
