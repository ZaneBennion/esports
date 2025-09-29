'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, type AppRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AuthHeader() {
  const [user, setUser] = useState<{ email: string; role: AppRole } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = getUserRole(session.access_token)
        setUser({ email: session.user.email!, role })
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = getUserRole(session.access_token)
        setUser({ email: session.user.email!, role })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  if (isLoading) {
    return <div className="flex gap-4">Loading...</div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user.email} ({user.role})
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Link 
        href="/auth/signin"
        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/auth/signup"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  )
}
