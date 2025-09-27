'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { syncAdminStatus } from './sync-admin'

/**
 * Creates a new user and syncs their admin status to JWT metadata
 */
export async function createUser(userData: {
  id: string
  name: string
  isAdmin?: boolean
}) {
  // Insert user into database
  const newUser = await db.insert(user).values({
    id: userData.id,
    name: userData.name,
    isAdmin: userData.isAdmin || false,
  }).returning()

  // Sync admin status to JWT metadata
  await syncAdminStatus(userData.id)

  return newUser[0]
}

/**
 * Updates a user's admin status and syncs to JWT metadata
 */
export async function updateUserAdminStatus(userId: string, isAdmin: boolean) {
  // Update in database
  const updatedUser = await db
    .update(user)
    .set({ isAdmin })
    .where(eq(user.id, userId))
    .returning()

  if (updatedUser.length === 0) {
    throw new Error('User not found')
  }

  // Sync admin status to JWT metadata
  await syncAdminStatus(userId)

  return updatedUser[0]
}

/**
 * Gets all users (admin only)
 */
export async function getAllUsers() {
  return await db.select().from(user)
}
