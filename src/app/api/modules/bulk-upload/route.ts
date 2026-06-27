import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

interface ModuleUploadData {
  title: string
  description?: string
  orderIndex: number
  language: 'en' | 'fr'
}

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
    const courseId = formData.get('courseId') as string
    const language = formData.get('language') as 'en' | 'fr'
    const files = formData.getAll('files') as File[]
    const modulesData = JSON.parse(formData.get('modulesData') as string) as ModuleUploadData[]

    if (!courseId || !language || files.length === 0) {
      return NextResponse.json(
        { error: 'courseId, language, and files are required' },
        { status: 400 }
      )
    }

    const results: { success: boolean; title: string; error?: string }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const moduleInfo = modulesData[i]

      try {
        // Validate file type (PDF or Word)
        const allowedBulkTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]
        if (!allowedBulkTypes.includes(file.type)) {
          results.push({
            success: false,
            title: moduleInfo.title,
            error: 'Only PDF and Word files are allowed'
          })
          continue
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${courseId}/${language}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        // Convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('modules')
          .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600'
          })

        if (uploadError) {
          results.push({
            success: false,
            title: moduleInfo.title,
            error: uploadError.message
          })
          continue
        }

        // Get the public URL
        const urlData = supabaseAdmin.storage
          .from('modules')
          .getPublicUrl(fileName)

        // Create module record in database
        const { error: moduleError } = await (supabaseAdmin
          .from('modules') as any)
          .insert({
            course_id: courseId,
            title: moduleInfo.title,
            description: moduleInfo.description || null,
            file_url: urlData.data.publicUrl,
            file_name: file.name,
            file_size: file.size,
            order_index: moduleInfo.orderIndex,
            language: language
          })

        if (moduleError) {
          // Try to delete the uploaded file if database insert fails
          await supabaseAdmin.storage.from('modules').remove([fileName])
          results.push({
            success: false,
            title: moduleInfo.title,
            error: moduleError.message
          })
          continue
        }

        results.push({
          success: true,
          title: moduleInfo.title
        })
      } catch (error) {
        results.push({
          success: false,
          title: moduleInfo.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      summary: {
        total: files.length,
        uploaded: successCount,
        failed: failCount
      },
      results
    })
  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload modules' },
      { status: 500 }
    )
  }
}
