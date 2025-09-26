'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function getCurrentUser() {
  const supabase = await createClient()
  
  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    return null
  }
  
  // Get user data from our custom user table
  const userData = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1)
  
  if (userData.length === 0) {
    return null
  }
  
  return {
    id: userData[0].id,
    name: userData[0].name,
    isAdmin: userData[0].isAdmin,
    email: session.user.email,
    createdAt: session.user.created_at,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return user
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  if (!user.isAdmin) {
    redirect('/account')
  }
  
  return user
}
