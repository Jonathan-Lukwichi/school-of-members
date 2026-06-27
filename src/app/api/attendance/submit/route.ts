import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { fullName, sessionDate, chaptersDone, takeaway1, takeaway2, takeaway3 } = body

    // Validate
    if (!fullName?.trim() || !sessionDate || !chaptersDone?.trim() || !takeaway1?.trim()) {
      return NextResponse.json(
        { error: 'Full name, session date, chapters covered, and at least one key takeaway are required.' },
        { status: 400 }
      )
    }

    const name = fullName.trim()

    // Best-effort: link to an existing student by matching full name (case-insensitive)
    let studentId: string | null = null
    try {
      const { data: match } = await (supabaseAdmin
        .from('students') as any)
        .select('id')
        .ilike('full_name', name)
        .limit(1)
        .maybeSingle()
      studentId = match?.id ?? null
    } catch {
      /* matching is optional — ignore */
    }

    const { error: insertError } = await (supabaseAdmin
      .from('attendance_records') as any)
      .insert({
        student_id: studentId,
        full_name: name,
        session_date: sessionDate,
        chapters_done: chaptersDone.trim(),
        takeaway_1: takeaway1.trim(),
        takeaway_2: takeaway2?.trim() || null,
        takeaway_3: takeaway3?.trim() || null,
      })

    if (insertError) {
      console.error('Attendance insert error:', insertError)
      return NextResponse.json(
        { error: `Could not record attendance: ${insertError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Attendance recorded successfully.' })
  } catch (error) {
    console.error('Attendance submit error:', error)
    return NextResponse.json({ error: 'Failed to submit attendance.' }, { status: 500 })
  }
}
