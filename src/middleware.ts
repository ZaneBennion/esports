import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/account']
  
  // Admin routes that require admin privileges
  const adminRoutes = ['/admin']
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If it's a protected route and user is not authenticated, redirect to signin
  if (isProtectedRoute && !session) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If it's an admin route and user is not authenticated, redirect to signin
  if (isAdminRoute && !session) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If it's an admin route, check admin privileges from JWT
  if (isAdminRoute && session) {
    const isAdmin = session.user.app_metadata?.isAdmin === true
    
    if (!isAdmin) {
      // Redirect non-admin users to account page
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
