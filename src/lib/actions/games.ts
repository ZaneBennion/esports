'use server'

import { db } from '@/lib/db'
import { game, event } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

/**
 * Get all games
 */
export async function getAllGames() {
  const games = await db
    .select()
    .from(game)
    .orderBy(game.name)

  return games
}

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
    .orderBy(event.startDate)

  return events
}

export async function createGame(formData: FormData) {
  const gameName = formData.get('name') as string
  const slug = gameName.toLowerCase().replace(/\s+/g, '')
  const logoFile = formData.get('logo') as File

  // Upload logo to Supabase Storage
  if (logoFile && logoFile.size > 0) {
    const supabase = createAdminClient()
    const arrayBuffer = await logoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabase.storage
      .from('Images')
      .upload(`games/${slug}.svg`, buffer, {
        contentType: 'image/svg+xml',
        upsert: true, // Overwrite if exists
      })

    if (error) {
      throw new Error(`Failed to upload logo: ${error.message}`)
    }
  }

  await db.insert(game).values({
    name: gameName,
    slug,
  })

  revalidatePath('/admin/games')
  revalidatePath('/admin')
}