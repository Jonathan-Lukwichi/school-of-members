import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: moduleId } = await params
    const supabase = await createServerClient()

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

    // Check access: admin can download any module, students need enrollment
    if (profile?.role !== 'admin') {
      const { data: enrollment } = await (supabase
        .from('enrollments') as any)
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', module.course_id)
        .eq('status', 'active')
        .single()

      if (!enrollment) {
        return NextResponse.json(
          { error: 'You must be enrolled in this course to download modules' },
          { status: 403 }
        )
      }
    }

    // Update or create module progress for students
    if (profile?.role !== 'admin') {
      const { data: existingProgress } = await (supabase
        .from('module_progress') as any)
        .select('id, download_count')
        .eq('student_id', user.id)
        .eq('module_id', moduleId)
        .single()

      if (existingProgress) {
        await (supabaseAdmin
          .from('module_progress') as any)
          .update({ download_count: (existingProgress.download_count || 0) + 1 })
          .eq('id', existingProgress.id)
      } else {
        await (supabaseAdmin
          .from('module_progress') as any)
          .insert({
            student_id: user.id,
            module_id: moduleId,
            download_count: 1
          })
      }
    }

    // Generate a signed URL for the file
    if (!module.file_url) {
      return NextResponse.json({ error: 'No file attached to this module' }, { status: 404 })
    }

    // Extract the path from the public URL
    const urlParts = module.file_url.split('/modules/')
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 500 })
    }
    const filePath = urlParts[1]

    // Create a signed URL for secure download
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('modules')
      .createSignedUrl(filePath, 60) // 60 seconds expiry

    if (signedUrlError) {
      console.error('Signed URL error:', signedUrlError)
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({
      downloadUrl: signedUrlData.signedUrl,
      fileName: module.file_name,
      fileSize: module.file_size
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}
