import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

/*
  Fully LOCAL middleware — no network calls, so it can never hang the Edge
  runtime (previously supabase.auth.getUser() timed out from the edge → 504
  MIDDLEWARE_INVOCATION_TIMEOUT).

  This only gates routing/redirects. Real authentication is still enforced
  downstream: admin API routes call supabase.auth.getUser() + role checks,
  student APIs verify the session, and RLS protects the data.
*/

const STUDENT_JWT_SECRET = new TextEncoder().encode(
  process.env.STUDENT_JWT_SECRET || 'your-student-jwt-secret-key-min-32-chars'
)

// Valid phone+PIN student session (som_student_session JWT) — local signature check.
async function hasValidStudentSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('som_student_session')?.value
  if (!token) return false
  try {
    await jwtVerify(token, STUDENT_JWT_SECRET)
    return true
  } catch {
    return false
  }
}

// Presence of a Supabase auth cookie (admins/teachers) — local, no network.
// @supabase/ssr stores the session as `sb-<ref>-auth-token` (possibly chunked).
function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.includes('-auth-token'))
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') // strip trailing slash

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isStudentRoute = pathname.startsWith('/student')
  const isPublicStudentPage = pathname === '/student/register' || pathname === '/student/login'
  const isStudentProtected = isStudentRoute && !isPublicStudentPage

  // Admin/teacher area: require a Supabase auth cookie.
  if (isAdminRoute) {
    if (!hasSupabaseAuthCookie(request)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Student portal: a valid student JWT, or an admin previewing.
  if (isStudentProtected) {
    const allowed = (await hasValidStudentSession(request)) || hasSupabaseAuthCookie(request)
    if (!allowed) {
      const url = request.nextUrl.clone()
      url.pathname = '/student/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Everything else (public site, logins, /api/*) — straight through.
  return NextResponse.next()
}
