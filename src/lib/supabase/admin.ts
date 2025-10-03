import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role privileges
 * This bypasses RLS and should ONLY be used in secure server-side contexts
 * for administrative operations
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
