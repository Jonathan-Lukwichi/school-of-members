import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getPortalViewer } from '@/lib/auth/portal-access'

/**
 * Active courses + their modules for the logged-in student (or an admin previewing).
 * Every active student has access to the active courses (one membership program).
 */
export async function GET() {
  try {
    const viewer = await getPortalViewer()
    if (viewer.kind === 'none') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Students must be active; admins preview freely
    if (viewer.kind === 'student') {
      const { data: student } = await (supabaseAdmin.from('students') as any)
        .select('status')
        .eq('id', viewer.studentId)
        .single()
      if (!student || student.status === 'pending' || student.status === 'inactive') {
        return NextResponse.json({ error: 'Account not active' }, { status: 403 })
      }
    }

    const { data: courses } = await (supabaseAdmin.from('courses') as any)
      .select('id, title, description, thumbnail_url')
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    const courseList = courses || []
    const ids = courseList.map((c: { id: string }) => c.id)

    let modulesByCourse: Record<string, unknown[]> = {}
    if (ids.length > 0) {
      const { data: modules } = await (supabaseAdmin.from('modules') as any)
        .select('id, course_id, title, description, order_index, language, file_name, file_size')
        .in('course_id', ids)
        .order('order_index', { ascending: true })

      modulesByCourse = (modules || []).reduce(
        (acc: Record<string, unknown[]>, m: { course_id: string }) => {
          ;(acc[m.course_id] ||= []).push(m)
          return acc
        },
        {}
      )
    }

    const result = courseList.map((c: { id: string }) => ({
      ...c,
      modules: modulesByCourse[c.id] || [],
      moduleCount: (modulesByCourse[c.id] || []).length,
    }))

    return NextResponse.json({ courses: result })
  } catch (error) {
    console.error('student/courses error:', error)
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 })
  }
}
