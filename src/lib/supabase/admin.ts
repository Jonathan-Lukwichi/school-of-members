import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Lazy-loaded admin client to avoid build-time errors
let supabaseAdminInstance: SupabaseClient<Database> | null = null

// Admin client with service role key - ONLY use server-side
// This bypasses Row Level Security
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseAdminInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }

  return supabaseAdminInstance
}

// For backwards compatibility - deprecated, use getSupabaseAdmin() instead
export const supabaseAdmin = {
  get client() {
    return getSupabaseAdmin()
  }
}
