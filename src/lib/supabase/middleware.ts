import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

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
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isStudentRoute = request.nextUrl.pathname.startsWith('/student')

  // Public student pages that don't require authentication
  // Handle both with and without trailing slashes
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') // Remove trailing slash
  const isPublicStudentPage = pathname === '/student/register' ||
                              pathname === '/student/login'

  const isProtectedRoute = isAdminRoute || (isStudentRoute && !isPublicStudentPage)

  // Redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
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
