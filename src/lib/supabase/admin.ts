import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Admin client with service role key - ONLY use server-side
// This bypasses Row Level Security
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
