import { getCurrentUser } from '@/lib/auth/user'
import Link from 'next/link'

export async function AuthNav() {
  const user = await getCurrentUser()
  
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, {user.name}!</span>
        <Link 
          href="/account" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          My Account
        </Link>
        {user.isAdmin && (
          <Link 
            href="/admin" 
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Admin Panel
          </Link>
        )}
      </div>
    )
  }
  
  return (
    <div className="flex gap-4">
      <Link 
        href="/auth/signup" 
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Sign Up
      </Link>
      <Link 
        href="/auth/signin" 
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Sign In
      </Link>
    </div>
  )
}
