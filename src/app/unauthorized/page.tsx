import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this page.
        </p>
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
