# Admin Setup Guide

This project now uses a full middleware approach for admin checking, which provides better performance and security.

## How It Works

1. **Middleware Level**: Admin status is checked in `middleware.ts` using JWT metadata
2. **JWT Metadata**: Admin status is stored in `session.user.app_metadata.isAdmin`
3. **Database Sync**: Admin status is synced from the database to JWT metadata when needed

## Setting Up Admin Users

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Find the user you want to make an admin
4. Click on the user to edit
5. In the **Raw User Meta Data** section, add:
   ```json
   {
     "isAdmin": true
   }
   ```
6. Save the changes

### Method 2: Using Database + Sync Function

1. Update the user's `isAdmin` field in your database:
   ```sql
   UPDATE "user" SET is_admin = true WHERE id = 'user-id-here';
   ```

2. Call the sync function to update the JWT metadata:
   ```typescript
   import { syncAdminStatus } from '@/lib/auth/sync-admin'
   
   await syncAdminStatus('user-id-here')
   ```

## Key Benefits

- ✅ **Better Performance**: Admin checks happen at middleware level (before page render)
- ✅ **More Secure**: Admin status is verified before any page logic runs
- ✅ **No Database Queries**: Admin status comes from JWT metadata
- ✅ **Consistent**: Same admin status across all requests

## Important Notes

- Admin status changes require syncing to JWT metadata
- Use the `syncAdminStatus()` function when changing admin status programmatically
- The middleware will redirect non-admin users to `/account` when accessing `/admin` routes
- Unauthenticated users are redirected to `/auth/signin`

## Files Modified

- `src/middleware.ts` - Added admin checking logic
- `src/lib/auth/user.ts` - Updated to use JWT metadata for admin status
- `src/app/admin/page.tsx` - Simplified (no longer needs `requireAdmin`)
- `src/lib/auth/sync-admin.ts` - New utility for syncing admin status
- `src/lib/auth/user-management.ts` - New utility for user management
