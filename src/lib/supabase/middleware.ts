import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import type { Database } from '@/types/database'

const STUDENT_JWT_SECRET = new TextEncoder().encode(
  process.env.STUDENT_JWT_SECRET || 'your-student-jwt-secret-key-min-32-chars'
)

// Edge-safe check for a valid phone+PIN student session (som_student_session JWT)
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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  // Handle both with and without trailing slashes
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') // Remove trailing slash

  // Auth pages (login/register) - these don't require authentication
  const isAuthPage = pathname === '/login' ||
                     pathname === '/register' ||
                     pathname === '/admin/login' ||
                     pathname === '/student/login' ||
                     pathname === '/student/register'

  // Route type detection
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isStudentRoute = pathname.startsWith('/student')

  // Public student pages that don't require authentication
  const isPublicStudentPage = pathname === '/student/register' ||
                              pathname === '/student/login'

  // Admin/teacher routes require a Supabase session; student routes accept the
  // phone+PIN student JWT (som_student_session) OR a Supabase session.
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isStudentRoute && !isPublicStudentPage) {
    const studentLoggedIn = await hasValidStudentSession(request)
    if (!user && !studentLoggedIn) {
      const url = request.nextUrl.clone()
      url.pathname = '/student/login'
      return NextResponse.redirect(url)
    }
  }

  // Allow access to auth pages (login/register) even when logged in
  // The login form will handle signing out and redirecting after new login
  // This allows users to switch accounts

  // Check role-based access
  if (user && isAdminRoute) {
    // First check user_metadata, then fallback to profiles table
    let role = user.user_metadata?.role

    if (!role || role !== 'admin') {
      // Query profiles table for role
      const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('role')
        .eq('id', user.id)
        .single()

      role = (profile as any)?.role || role
    }

    // Allow both admin and teacher roles to access admin routes
    if (role !== 'admin' && role !== 'teacher') {
      const url = request.nextUrl.clone()
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
