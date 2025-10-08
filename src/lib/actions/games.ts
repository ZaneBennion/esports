'use server'

import { db } from '@/lib/db'
import { game, event } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { uploadImage } from './storage'


export async function getAllGames() {
  const games = await db
    .select()
    .from(game)
    .orderBy(game.name)

  return games
}

export async function getGameBySlug(slug: string) {
  const games = await db
    .select()
    .from(game)
    .where(eq(game.slug, slug))
    .limit(1)

  return games.length > 0 ? games[0] : null
}

export async function getEventsForGame(gameId: number) {
  const events = await db
    .select()
    .from(event)
    .where(eq(event.gameId, gameId))
    .orderBy(event.startDate)

  return events
}

export async function createGame(formData: FormData) {
  const gameName = formData.get('name') as string
  const slug = gameName.toLowerCase().replace(/\s+/g, '')
  const logoFile = formData.get('logo') as File

  const result = await db.insert(game).values({
    name: gameName,
    slug,
  }).returning({ id: game.id })

  const gameId = result[0].id
  await uploadImage(logoFile, gameId, 'games')

  revalidatePath('/admin')
}