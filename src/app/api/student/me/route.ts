import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getPortalViewer } from '@/lib/auth/portal-access'

/**
 * Returns the current portal viewer:
 * - a logged-in student (from the som_student_session JWT), or
 * - an admin/teacher in read-only PREVIEW mode (isAdminPreview: true).
 * 401 if neither.
 */
export async function GET() {
  try {
    const viewer = await getPortalViewer()

    if (viewer.kind === 'admin') {
      return NextResponse.json({
        student: {
          full_name: viewer.fullName || 'Admin',
          email: null,
          phone: '',
          status: 'active',
          preferred_language: 'en',
          created_at: new Date(0).toISOString(),
          last_login: null,
          login_count: 0,
        },
        isAdminPreview: true,
      })
    }

    if (viewer.kind !== 'student') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: student } = await (supabaseAdmin.from('students') as any)
      .select('id, full_name, email, phone, status, preferred_language, created_at, last_login, login_count')
      .eq('id', viewer.studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({ student, isAdminPreview: false })
  } catch (error) {
    console.error('student/me error:', error)
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 })
  }
}
