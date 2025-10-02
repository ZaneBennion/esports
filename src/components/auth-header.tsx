'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, type AppRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AuthHeader() {
  const [user, setUser] = useState<{ email: string; role: AppRole } | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = getUserRole(session.access_token)
        setUser({ email: session.user.email!, role })
      }
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

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted) {
    return <div className="flex gap-4 w-[200px]"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border-2 border-foreground rounded-full text-foreground font-medium hover:bg-gray-100 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <Link 
      href="/auth/signin"
      className="px-4 py-2 border-2 border-foreground rounded-full text-foreground font-medium hover:bg-gray-100 transition-colors"
    >
      Account
    </Link>
  )
}
