import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // Verify secret key for security
    const body = await request.json()
    const { secretKey } = body

    // Use a secret key to protect this endpoint
    const setupSecretKey = process.env.SETUP_SECRET_KEY || 'setup-admin-2024'

    if (secretKey !== setupSecretKey) {
      return NextResponse.json({ error: 'Invalid secret key' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const adminExists = existingUsers?.users?.some(
      (user) => user.email === 'admin1@schoolofmembers.com'
    )

    if (adminExists) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      )
    }

    // Create admin user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin1@schoolofmembers.com',
      password: 'schoolofmembers',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Administrator'
      }
    })

    if (error) {
      console.error('Error creating admin:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Create profile record
    const { error: profileError } = await (supabaseAdmin
      .from('profiles') as any)
      .upsert({
        id: data.user.id,
        email: 'admin1@schoolofmembers.com',
        full_name: 'Administrator',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // User was created but profile failed - still return success
      return NextResponse.json({
        success: true,
        userId: data.user.id,
        warning: 'User created but profile creation failed'
      })
    }

    return NextResponse.json({
      success: true,
      userId: data.user.id,
      message: 'Admin user created successfully'
    })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    )
  }
}
