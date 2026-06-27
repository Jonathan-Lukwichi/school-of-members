import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getStudentSessionFromCookie } from '@/lib/auth/session'

/**
 * Returns the currently logged-in student (from the som_student_session JWT),
 * refreshed against the DB for live name/status. 401 if not logged in.
 */
export async function GET() {
  try {
    const session = await getStudentSessionFromCookie()
    if (!session?.studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: student } = await (supabaseAdmin.from('students') as any)
      .select('id, full_name, email, phone, status, preferred_language, created_at, last_login, login_count')
      .eq('id', session.studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error('student/me error:', error)
    return NextResponse.json({ error: 'Failed to load session' }, { status: 500 })
  }
}
