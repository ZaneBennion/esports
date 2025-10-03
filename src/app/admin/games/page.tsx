import { db } from "@/lib/db"
import { game } from "@/lib/db/schema"

export default async function Games() {
  const games = await db.select().from(game)
  return <div>
    {games.map((game) => (
      <div key={game.id}>
        {game.name}
      </div>
    ))}
  </div>
}