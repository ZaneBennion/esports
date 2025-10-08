'use server'

import { db } from '@/lib/db'
import { event, game } from '@/lib/db/schema'
import { eq, and, gte, lte, asc, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'


async function getCurrentEventForGame(gameId: number, now: string) {
  const result = await db
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

  return result.length > 0 ? result[0] : null
}

async function getUpcomingEventForGame(gameId: number, now: string) {
  const result = await db
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

  return result.length > 0 ? result[0] : null
}

async function getPastEventForGame(gameId: number, now: string) {
  const result = await db
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

  return result.length > 0 ? result[0] : null
}

export async function getLatestEventForGame(gameId: number) {
  const now = new Date().toISOString().split('T')[0] // Get current date in YYYY-MM-DD format

  const currentEvent = await getCurrentEventForGame(gameId, now)
  if (currentEvent) {
    return currentEvent
  }

  const upcomingEvent = await getUpcomingEventForGame(gameId, now)
  if (upcomingEvent) {
    return upcomingEvent
  }

  const pastEvent = await getPastEventForGame(gameId, now)
  if (pastEvent) {
    return pastEvent
  }

  return null
}

export async function getEventById(eventId: number) {
  const result = await db
    .select({
      event: event,
      game: game,
    })
    .from(event)
    .innerJoin(game, eq(event.gameId, game.id))
    .where(eq(event.id, eventId))
    .limit(1)

  return result.length > 0 ? result[0] : null
}

export async function createEvent(formData: FormData) {
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '');
  const gameId = parseInt(formData.get('gameId') as string)
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  await db.insert(event).values({
    name,
    gameId,
    slug,
    startDate,
    endDate,
  })

  revalidatePath(`/admin/games/${gameId}`)
}
