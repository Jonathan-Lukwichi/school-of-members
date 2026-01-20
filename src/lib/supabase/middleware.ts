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
  const isProtectedRoute = isAdminRoute || isStudentRoute

  // Redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    // Get user role from metadata first, then check profiles table
    let role = user.user_metadata?.role

    if (!role) {
      // Query profiles table for role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      role = profile?.role || 'student'
    }

    url.pathname = role === 'admin' ? '/admin' : (role === 'teacher' ? '/teacher' : '/student')
    return NextResponse.redirect(url)
  }

  // Check role-based access
  if (user && isAdminRoute) {
    // First check user_metadata, then fallback to profiles table
    let role = user.user_metadata?.role

    if (!role || role !== 'admin') {
      // Query profiles table for role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      role = profile?.role || role
    }

    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
