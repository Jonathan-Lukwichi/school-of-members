import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: moduleId } = await params
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    // Get the module
    const { data: module, error: moduleError } = await (supabaseAdmin
      .from('modules') as any)
      .select('*, courses(id, title)')
      .eq('id', moduleId)
      .single()

    if (moduleError || !module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Check access: admin can preview any module, students need enrollment
    if (profile?.role !== 'admin' && profile?.role !== 'teacher') {
      const { data: enrollment } = await (supabase
        .from('enrollments') as any)
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', module.course_id)
        .eq('status', 'active')
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course to preview modules' },
          { status: 403 }
        )
      }
    }

    // Generate a signed URL for the file (read-only preview)
    if (!module.file_url) {
      return NextResponse.json({ error: 'No file attached to this module' }, { status: 404 })
    }

    // The file_url is stored as the path in storage (e.g., "en/123456-file.pdf")
    // Handle both full URL and just path formats
    let filePath = module.file_url
    if (module.file_url.includes('/modules/')) {
      const urlParts = module.file_url.split('/modules/')
      if (urlParts.length >= 2) {
        filePath = urlParts[1]
      }
    }

    // Create a signed URL for preview (longer expiry for reading)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('modules')
      .createSignedUrl(filePath, 300) // 5 minutes expiry for preview

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError)
      return NextResponse.json({ error: 'Failed to generate preview URL' }, { status: 500 })
    }

    return NextResponse.json({
      previewUrl: signedUrlData.signedUrl,
      fileName: module.file_name,
      fileSize: module.file_size,
      title: module.title
    })
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to process preview request' },
      { status: 500 }
    )
  }
}
