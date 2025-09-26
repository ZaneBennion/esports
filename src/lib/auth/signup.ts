'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { redirect } from 'next/navigation'

export async function signupUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    throw new Error('All fields are required')
  }

  const supabase = await createClient()

  try {
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Add user to our custom user table
    await db.insert(user).values({
      id: authData.user.id,
      name: name,
      isAdmin: false,
    })

    // Redirect to a success page or dashboard
    redirect('/auth/signin?message=Account created successfully! Please sign in.')
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}
