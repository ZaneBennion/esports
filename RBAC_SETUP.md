# RBAC Setup Instructions

## 1. Run the SQL Migration

Execute the SQL migration file in your Supabase SQL Editor:
```sql
-- Copy and paste the contents of supabase/migrations/rbac_setup.sql
```

Or if using Supabase CLI:
```bash
supabase db push
```

## 2. Enable the Auth Hook in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Hooks (Beta)**
3. Under **Custom Access Token Hook**, select `public.custom_access_token_hook` from the dropdown
4. Click Save

## 3. Usage Examples

### Frontend (Client Component)
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserRole, hasRole, type AppRole } from '@/lib/auth/rbac'

export default function ProtectedComponent() {
  const [userRole, setUserRole] = useState<AppRole>('user')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        const role = getUserRole(session.access_token)
        setUserRole(role)
      }
    })
  }, [])

  return (
    <div>
      <p>Your role: {userRole}</p>
      {hasRole(userRole, 'admin') && (
        <button>Admin Only Action</button>
      )}
    </div>
  )
}
```

### Backend (Server Component / API Route)
```tsx
import { createClient } from '@/lib/supabase/server'
import { getUserRole, hasRole } from '@/lib/auth/rbac'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.access_token || !hasRole(session.access_token, 'admin')) {
    redirect('/unauthorized')
  }

  const userRole = getUserRole(session.access_token)

  return <div>Welcome Admin! Your role: {userRole}</div>
}
```

### Middleware (Route Protection)
```tsx
// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { getUserRole, hasRole } from '@/lib/auth/rbac'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Get session from cookies
  const accessToken = request.cookies.get('sb-access-token')?.value
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!accessToken || !hasRole(accessToken, 'admin')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return response
}
```

## 4. Assigning Roles to Users

### Via SQL (Supabase SQL Editor)
```sql
-- Insert a new role for a user
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');

-- Update existing role
UPDATE public.user_roles 
SET role = 'super_admin'
WHERE user_id = 'user-uuid-here';

-- View all user roles
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
```

### Via API Route (Admin Function)
```tsx
// app/api/admin/assign-role/route.ts
import { createClient } from '@/lib/supabase/server'
import { hasRole } from '@/lib/auth/rbac'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  // Only super_admin can assign roles
  if (!session?.access_token || !hasRole(session.access_token, 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  const { userId, role } = await request.json()
  
  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}
```

## Role Hierarchy

- **user**: Basic access (default)
- **admin**: Admin access (can manage content)
- **super_admin**: Full access (can manage users and roles)

The `hasRole()` function uses hierarchy, so:
- `super_admin` has access to `admin` and `user` routes
- `admin` has access to `user` routes
- `user` only has access to `user` routes

Use `hasExactRole()` if you need to check for an exact role match.
