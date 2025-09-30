'use server'

import { db } from '@/lib/db'
import { event } from '@/lib/db/schema'
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm'

/**
 * Get the latest event for a specific game
 * Priority:
 * 1. Current event (between start and end date)
 * 2. Next upcoming event (closest start date in the future)
 * 3. Latest past event (most recent end date)
 */
export async function getLatestEventForGame(gameId: number) {
  const now = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format

  // First, try to find a current event (today is between start and end date)
  const currentEvent = await db
    .select()
    .from(event)
    .where(
      and(
        eq(event.gameId, gameId),
        lte(event.startDate, now),
        gte(event.endDate, now)
      )
    )
    .limit(1)

  if (currentEvent.length > 0) {
    return currentEvent[0]
  }

  // If no current event, find the next upcoming event (start date in the future)
  const upcomingEvent = await db
    .select()
    .from(event)
    .where(
      and(
        eq(event.gameId, gameId),
        gte(event.startDate, now)
      )
    )
    .orderBy(asc(event.startDate))
    .limit(1)

  if (upcomingEvent.length > 0) {
    return upcomingEvent[0]
  }

  // If no upcoming event, find the latest past event (most recent end date)
  const pastEvent = await db
    .select()
    .from(event)
    .where(
      and(
        eq(event.gameId, gameId),
        lte(event.endDate, now)
      )
    )
    .orderBy(desc(event.endDate))
    .limit(1)

  if (pastEvent.length > 0) {
    return pastEvent[0]
  }

  // No events found for this game
  return null
}
