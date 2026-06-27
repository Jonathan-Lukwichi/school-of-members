import { getStudentSessionFromCookie } from './session'
import { createServerClient } from '@/lib/supabase/server'

export type PortalViewer =
  | { kind: 'student'; studentId: string }
  | { kind: 'admin'; fullName: string | null }
  | { kind: 'none' }

/**
 * Resolves who is viewing the student portal:
 * - a phone+PIN student (via som_student_session JWT), or
 * - an admin/teacher (via Supabase auth) in read-only PREVIEW mode.
 * This lets admins open the student portal to see exactly what students see.
 */
export async function getPortalViewer(): Promise<PortalViewer> {
  const session = await getStudentSessionFromCookie()
  if (session?.studentId) {
    return { kind: 'student', studentId: session.studentId }
  }

  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('role, full_name')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin' || profile?.role === 'teacher') {
        return { kind: 'admin', fullName: profile.full_name ?? null }
      }
    }
  } catch {
    /* not an admin / no supabase session */
  }

  return { kind: 'none' }
}
