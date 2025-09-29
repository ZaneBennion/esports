import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { getUserRole, hasRole } from '@/lib/auth/rbac'

export async function middleware(request: NextRequest) {
  const { response, session } = await updateSession(request)

  const path = request.nextUrl.pathname

  // Protected routes that require authentication
  const authRoutes = ['/profile']
  
  // Admin-only routes
  const adminRoutes = ['/admin']

  // Check if route requires authentication
  const requiresAuth = authRoutes.some(route => path.startsWith(route))
  const requiresAdmin = adminRoutes.some(route => path.startsWith(route))

  // Redirect to login if not authenticated
  if (requiresAuth && !session) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin access
  if (requiresAdmin) {
    if (!session) {
      const redirectUrl = new URL('/auth/signin', request.url)
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    if (!hasRole(session.access_token, 'admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
