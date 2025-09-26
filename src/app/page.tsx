import { db } from '@/lib/db'
import { game, event, bracket, match, org, player } from '@/lib/db/schema'
import { AuthNav } from '@/components/auth-nav'
import { getGameLogoPath, getFallbackLogoPath } from '@/lib/logos'

export default async function Home() {
  // Fetch data from all tables
  const games = await db.select().from(game)
  const events = await db.select().from(event)
  const brackets = await db.select().from(bracket)
  const matches = await db.select().from(match)
  const orgs = await db.select().from(org)
  const players = await db.select().from(player)

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Esports Database</h1>
        <AuthNav />
      </div>
      
      {/* Games Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={getGameLogoPath(game.slug)} 
                  alt={`${game.name} logo`}
                  className="w-16 h-16 object-contain mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {games.length === 0 && (
          <p className="text-gray-500 text-center py-8">No games found in the database.</p>
        )}
      </section>
    </div>
  )
}
