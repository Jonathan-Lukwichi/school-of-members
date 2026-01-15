import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Check if any admins exist
    const { data: admins, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      hasAdmins: admins && admins.length > 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    const body = await request.json()
    const { setupKey, fullName, email, phone, password } = body

    // Validate setup key
    if (setupKey !== process.env.SETUP_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      )
    }

    // Check if any admins already exist
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json(
        { error: 'Admin already exists. Please login.' },
        { status: 400 }
      )
    }

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        role: 'admin'
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // The trigger should create the profile, but we'll update it to ensure admin role
    if (authData.user) {
      const { error: updateError } = await (supabaseAdmin
        .from('profiles') as any)
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('Error updating profile role:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      user: {
        id: authData.user?.id,
        email: authData.user?.email
      }
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}
