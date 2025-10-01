import { db } from '@/lib/db'
import { game, event, bracket, match, org, player, content } from '@/lib/db/schema'
import { AuthHeader } from '@/components/auth-header'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'

export default async function Home() {
  // Fetch data from all tables
  const games = await db.select().from(game)
  const events = await db.select().from(event)
  const brackets = await db.select().from(bracket)
  const matches = await db.select().from(match)
  const orgs = await db.select().from(org)
  const players = await db.select().from(player)
  const contents = await db.select().from(content)
  
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Esports Database</h1>
        <AuthHeader />
      </div>

      {/* Contents Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Contents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>
      
      {/* Games Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        {games.length === 0 && (
          <p className="text-gray-500 text-center py-8">No games found in the database.</p>
        )}
      </section>
    </div>
  )
}
