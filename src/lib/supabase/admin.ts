import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role privileges
 * 
 * ⚠️ WARNING: This bypasses ALL RLS policies!
 * 
 * ONLY use this for:
 * - System operations with no user context (cron jobs, background tasks)
 * - Truly administrative operations that must bypass all security
 * - Operations that cannot be secured via RLS
 * 
 * For most operations, use the regular server client (../supabase/server.ts)
 * which respects RLS policies and uses the authenticated user's JWT (including their role).
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
