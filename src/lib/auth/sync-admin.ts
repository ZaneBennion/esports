'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Syncs the admin status from the database to the user's JWT metadata
 * This should be called whenever a user's admin status changes
 */
export async function syncAdminStatus(userId: string) {
  const supabase = await createClient()
  
  // Get the current admin status from the database
  const userData = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  
  if (userData.length === 0) {
    throw new Error('User not found')
  }
  
  const isAdmin = userData[0].isAdmin
  
  // Update the user's app_metadata in Supabase Auth
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { isAdmin }
  })
  
  if (error) {
    throw new Error(`Failed to sync admin status: ${error.message}`)
  }
  
  return { success: true, isAdmin }
}

/**
 * Gets the current admin status from the database
 */
export async function getAdminStatus(userId: string): Promise<boolean> {
  const userData = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  
  if (userData.length === 0) {
    return false
  }
  
  return userData[0].isAdmin
}
