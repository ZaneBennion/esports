import { requireAuth } from '@/lib/auth/user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  // This will redirect to signin if user is not authenticated
  const user = await requireAuth()
  
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <form action={handleSignOut}>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </form>
      </div>
      
      <div className="space-y-6">
        {/* User Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
              <p className="text-gray-900 font-mono text-sm">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
              <p className="text-gray-900 font-medium">
                {user.isAdmin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    User
                  </span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
              <p className="text-gray-900 font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Profile
            </a>
            {user.isAdmin && (
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Admin Panel
              </a>
            )}
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Security</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Your account is secured with Supabase authentication. 
              Your password is encrypted and stored securely.
            </p>
            <p className="text-sm text-gray-600">
              Last session: {session?.user?.last_sign_in_at ? 
                new Date(session.user.last_sign_in_at).toLocaleString() : 
                'Unknown'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
