'use server'

import { db } from '@/lib/db'
import { game, event } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Get a game by its slug
 */
export async function getGameBySlug(slug: string) {
  const games = await db
    .select()
    .from(game)
    .where(eq(game.slug, slug))
    .limit(1)

  return games.length > 0 ? games[0] : null
}

/**
 * Get all events for a specific game
 */
export async function getEventsForGame(gameId: number) {
  const events = await db
    .select()
    .from(event)
    .where(eq(event.gameId, gameId))

  return events
}
