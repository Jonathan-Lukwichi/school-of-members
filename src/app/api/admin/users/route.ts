import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// GET - List all admin users
export async function GET() {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get all admin users
    const { data: admins, error } = await (supabaseAdmin
      .from('profiles') as any)
      .select('id, email, full_name, phone, created_at')
      .eq('role', 'admin')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ admins })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    )
  }
}

// POST - Create a new admin user
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { fullName, email, phone, password } = body

    // Validate required fields
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
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

    // Update the profile to ensure admin role
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
        email: authData.user?.email,
        full_name: fullName
      }
    })
  } catch (error) {
    console.error('Create admin error:', error)
    return NextResponse.json(
      { error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}

// DELETE - Remove an admin user
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const supabaseAdmin = getSupabaseAdmin()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: currentProfile } = await (supabase
      .from('profiles') as any)
      .select('role')
      .eq('id', user.id)
      .single()

    if (currentProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Delete the user from auth (this will cascade to profiles)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account deleted successfully'
    })
  } catch (error) {
    console.error('Delete admin error:', error)
    return NextResponse.json(
      { error: 'Failed to delete admin account' },
      { status: 500 }
    )
  }
}
