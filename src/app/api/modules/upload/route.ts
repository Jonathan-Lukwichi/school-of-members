import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const courseId = formData.get('courseId') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const orderIndex = parseInt(formData.get('orderIndex') as string) || 0

    if (!courseId || !title) {
      return NextResponse.json(
        { error: 'courseId and title are required' },
        { status: 400 }
      )
    }

    let publicUrl = null
    let originalFileName = null
    let fileSize = null

    // Handle file upload if file is provided
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF and images are allowed.' },
          { status: 400 }
        )
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10MB.' },
          { status: 400 }
        )
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${courseId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

      // Convert file to buffer for upload
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('modules')
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600'
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
      }

      // Get the public URL
      const urlData = supabaseAdmin.storage
        .from('modules')
        .getPublicUrl(fileName)

      publicUrl = urlData.data.publicUrl
      originalFileName = file.name
      fileSize = file.size
    }

    // Create module record in database
    const { data: moduleData, error: moduleError } = await (supabaseAdmin
      .from('modules') as any)
      .insert({
        course_id: courseId,
        title,
        description,
        file_url: publicUrl,
        file_name: originalFileName,
        file_size: fileSize,
        order_index: orderIndex
      })
      .select()
      .single()

    if (moduleError) {
      // Try to delete the uploaded file if database insert fails
      if (publicUrl) {
        const urlParts = publicUrl.split('/modules/')
        if (urlParts.length > 1) {
          await supabaseAdmin.storage.from('modules').remove([urlParts[1]])
        }
      }
      return NextResponse.json({ error: moduleError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      module: moduleData
    })
  } catch (error) {
    console.error('Module upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload module' },
      { status: 500 }
    )
  }
}
