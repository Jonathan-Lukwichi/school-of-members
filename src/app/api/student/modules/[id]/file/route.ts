import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { getPortalViewer } from '@/lib/auth/portal-access'

/**
 * Returns a short-lived signed URL for a module's file, for the logged-in
 * (active) student. Used for both preview and download in the student portal.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: moduleId } = await params

    const viewer = await getPortalViewer()
    if (viewer.kind === 'none') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    if (viewer.kind === 'student') {
      const { data: student } = await (supabaseAdmin.from('students') as any)
        .select('status')
        .eq('id', viewer.studentId)
        .single()
      if (!student || student.status === 'pending' || student.status === 'inactive') {
        return NextResponse.json({ error: 'Account not active' }, { status: 403 })
      }
    }

    const { data: module } = await (supabaseAdmin.from('modules') as any)
      .select('id, title, file_url, file_name, file_size')
      .eq('id', moduleId)
      .single()

    if (!module?.file_url) {
      return NextResponse.json({ error: 'No file attached to this module' }, { status: 404 })
    }

    const parts = module.file_url.split('/modules/')
    if (parts.length < 2) {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 500 })
    }

    const { data: signed, error } = await supabaseAdmin.storage
      .from('modules')
      .createSignedUrl(parts[1], 300) // 5 minutes

    if (error || !signed) {
      console.error('Signed URL error:', error)
      return NextResponse.json({ error: 'Failed to generate file URL' }, { status: 500 })
    }

    return NextResponse.json({
      url: signed.signedUrl,
      fileName: module.file_name,
      fileSize: module.file_size,
      title: module.title,
    })
  } catch (error) {
    console.error('student module file error:', error)
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 })
  }
}
