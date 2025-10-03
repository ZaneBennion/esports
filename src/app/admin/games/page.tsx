import { createGame } from "@/lib/actions/games"
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

    <form action={createGame}>
      <input type="text" name="name" placeholder="Game name" required />
      <input type="file" name="logo" accept="image/svg+xml" required />
      <button type="submit">Create Game</button>
    </form>
  </div>
}