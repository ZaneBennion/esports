'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, type AppRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './auth-header.module.css'

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
    return <div className={styles.placeholder}></div>
  }

  if (user) {
    return (
      <div className={styles.container}>
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <Link 
            href="/admin"
            className={styles.button}
          >
            Admin
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className={styles.button}
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Link 
        href="/auth/signin"
        className={styles.button}
      >
        Sign In
      </Link>
    </div>
  )
}
