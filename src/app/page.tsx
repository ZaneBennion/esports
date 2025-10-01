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
    <div className="min-h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Esports Database</h1>
        <AuthHeader />
      </div>

      {/* Contents Section */}
      <section className="border-b pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>
      
      <div className="flex flex-row pt-12">
        {/* Games Section */}
        <section className="mb-12 border-r pr-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          {games.length === 0 && (
            <p className="text-gray-500 text-center py-8">No games found in the database.</p>
          )}
        </section>

        {/* Regions Section */}
        <section className="flex flex-col gap-4">
          <Link
            href="/orgs/amer"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            AMER
          </Link>
          <Link
            href="/orgs/pac"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            PAC
          </Link>
          <Link
            href="/orgs/emea"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            EMEA
          </Link>
          <Link
            href="/orgs/cn"
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            CN
          </Link>
        </section>
      </div>
    </div>
  )
}
