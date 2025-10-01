import { db } from '@/lib/db'
import { game, event, bracket, match, org, player, content } from '@/lib/db/schema'
import { AuthHeader } from '@/components/auth-header'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'
import Link from 'next/link'

export default async function Home() {
  // Fetch data from tables
  const games = await db.select().from(game)
  const contents = await db.select().from(content)
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-300 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            Home/Logo
          </Link>
          <div className="flex items-center gap-3">
            <AuthHeader />
            <button className="px-4 py-2 border-2 border-gray-900 rounded-full text-gray-900 font-medium hover:bg-gray-100 transition-colors">
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {/* Organization Content Cards Section */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </section>
        
        <hr className="border-gray-300 mb-8" />

        {/* Games and Regions Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Games Section */}
          <section className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            {games.length === 0 && (
              <p className="text-gray-500 text-center py-8">No games found in the database.</p>
            )}
          </section>

          {/* Regions Section - Desktop Sidebar */}
          <aside className="hidden lg:flex lg:flex-col gap-4 lg:w-32">
            <Link
              href="/orgs/amer"
              className="px-4 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              AMER
            </Link>
            <Link
              href="/orgs/pac"
              className="px-4 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              PAC
            </Link>
            <Link
              href="/orgs/emea"
              className="px-4 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              EMEA
            </Link>
            <Link
              href="/orgs/cn"
              className="px-4 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              CN
            </Link>
          </aside>
        </div>
      </main>

      {/* Mobile Footer - Regions */}
      <footer className="lg:hidden bg-white border-t border-gray-300 px-4 py-3 mt-auto">
        <div className="flex justify-center gap-4">
          <Link
            href="/orgs/cn"
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            CN
          </Link>
          <Link
            href="/orgs/emea"
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            EMEA
          </Link>
          <Link
            href="/orgs/pac"
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            PAC
          </Link>
          <Link
            href="/orgs/amer"
            className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            AMER
          </Link>
        </div>
      </footer>
    </div>
  )
}
