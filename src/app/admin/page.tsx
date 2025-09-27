import { getCurrentUser } from '@/lib/auth/user'
import Link from 'next/link'

export default async function AdminPage() {
  // Middleware handles admin checking, so we just need to get the current user
  const user = await getCurrentUser()
  
  if (!user) {
    // This shouldn't happen due to middleware, but just in case
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md text-black">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/account"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            My Account
          </Link>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Home
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Admin Status */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Administrator Access Confirmed
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>You have full administrative privileges to manage the esports platform.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tools Placeholder */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-3">Manage user accounts and permissions</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Game Management</h3>
              <p className="text-sm text-gray-600 mb-3">Add, edit, and manage games</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Event Management</h3>
              <p className="text-sm text-gray-600 mb-3">Create and manage tournaments</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Organization Management</h3>
              <p className="text-sm text-gray-600 mb-3">Manage teams and organizations</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">System Settings</h3>
              <p className="text-sm text-gray-600 mb-3">Configure platform settings</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-3">View platform usage statistics</p>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Active Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Live Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Organizations</div>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Admin Panel Under Development
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This admin panel is currently being developed. Additional features and tools will be added in future updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
