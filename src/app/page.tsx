import { db } from '@/lib/db'
import { game, event, bracket, match, org, player } from '@/lib/db/schema'
import Link from 'next/link'

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
    <div className="flex justify-between">
      <h1 className="text-3xl font-bold mb-8">Esports Database</h1>
      <Link href="/auth/signup" className="text-blue-500">Signup</Link>
      <Link href="/auth/signin" className="text-blue-500">Signin</Link>
    </div>

      <div className="grid gap-8">
        {/* Games */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Games ({games.length})</h2>
          {games.length > 0 ? (
            <ul className="space-y-2">
              {games.map((g) => (
                <li key={g.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {g.id} - {g.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No games found</p>
          )}
        </div>

        {/* Events */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Events ({events.length})</h2>
          {events.length > 0 ? (
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {e.id} - {e.name} (Game ID: {e.gameId})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No events found</p>
          )}
        </div>

        {/* Brackets */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Brackets ({brackets.length})</h2>
          {brackets.length > 0 ? (
            <ul className="space-y-2">
              {brackets.map((b) => (
                <li key={b.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {b.id} - {b.name} (Event ID: {b.eventId})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No brackets found</p>
          )}
        </div>

        {/* Organizations */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Organizations ({orgs.length})</h2>
          {orgs.length > 0 ? (
            <ul className="space-y-2">
              {orgs.map((o) => (
                <li key={o.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {o.id} - {o.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No organizations found</p>
          )}
        </div>

        {/* Matches */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Matches ({matches.length})</h2>
          {matches.length > 0 ? (
            <ul className="space-y-2">
              {matches.map((m) => (
                <li key={m.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {m.id} - Team A: {m.teamAId} vs Team B: {m.teamBId} (Bracket ID: {m.bracketId})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No matches found</p>
          )}
        </div>

        {/* Players */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Players ({players.length})</h2>
          {players.length > 0 ? (
            <ul className="space-y-2">
              {players.map((p) => (
                <li key={p.id} className="p-2 bg-gray-100 rounded text-black">
                  ID: {p.id} - {p.name} (Org ID: {p.orgId || 'None'})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No players found</p>
          )}
        </div>
      </div>
    </div>
  )
}
