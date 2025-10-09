'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, type AppRole } from '@/lib/auth/rbac'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Sub-component: Auth Button (reusable for links and buttons)
function AuthButton({ 
  children, 
  onClick, 
  href 
}: { 
  children: React.ReactNode
  onClick?: () => void
  href?: string 
}) {
  const className = "py-3 px-4 rounded-full text-[var(--foreground)] bg-[var(--background)] font-semibold text-center no-underline border border-gray-300 transition-all hover:border-gray-400"
  
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

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
        {(user.role === 'admin' || user.role === 'super_admin') && (
          <AuthButton href="/admin">Admin</AuthButton>
        )}
        <AuthButton onClick={handleSignOut}>Sign Out</AuthButton>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <AuthButton href="/auth/signin">Sign In</AuthButton>
    </div>
  )
}
