import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import type { Database } from '@/types/database'

const STUDENT_JWT_SECRET = new TextEncoder().encode(
  process.env.STUDENT_JWT_SECRET || 'your-student-jwt-secret-key-min-32-chars'
)

// Edge-safe check for a valid phone+PIN student session (som_student_session JWT).
// Purely local (no network) — just verifies the JWT signature.
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

// Never let a slow Supabase call hang the Edge middleware (avoids 504
// MIDDLEWARE_INVOCATION_TIMEOUT). Resolves to null if it takes too long.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ])
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') // strip trailing slash

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isStudentRoute = pathname.startsWith('/student')
  const isPublicStudentPage = pathname === '/student/register' || pathname === '/student/login'
  const isStudentProtected = isStudentRoute && !isPublicStudentPage

  // Fast path: a valid student JWT gets straight into student pages — no network.
  if (isStudentProtected && (await hasValidStudentSession(request))) {
    return NextResponse.next({ request })
  }

  // Everything else that doesn't need the Supabase (admin) session — the public
  // site, /login, /student/login, /student/register, all /api/* — passes through
  // untouched. This keeps the Supabase auth call off the hot path.
  if (!isAdminRoute && !isStudentProtected) {
    return NextResponse.next({ request })
  }

  // --- Only admin routes (and student-protected routes being previewed by an
  // admin) reach here and validate the Supabase session. ---
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const result = await withTimeout(supabase.auth.getUser(), 8000)
  const user = result?.data?.user ?? null

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isStudentProtected && !user) {
    // No student JWT and no admin session → send to student login
    const url = request.nextUrl.clone()
    url.pathname = '/student/login'
    return NextResponse.redirect(url)
  }

  // Role gate for admin routes (admins + teachers allowed)
  if (user && isAdminRoute) {
    let role = user.user_metadata?.role
    if (!role || role !== 'admin') {
      const { data: profile } = await (supabase.from('profiles') as any)
        .select('role')
        .eq('id', user.id)
        .single()
      role = (profile as any)?.role || role
    }
    if (role !== 'admin' && role !== 'teacher') {
      const url = request.nextUrl.clone()
      url.pathname = '/student'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
