'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signinUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const supabase = await createClient()

  try {
    // Sign in user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to sign in')
    }

    // Redirect to the intended page or account page
    redirect(redirectTo || '/account')
  } catch (error) {
    console.error('Signin error:', error)
    throw error
  }
}
