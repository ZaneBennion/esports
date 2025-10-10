'use server'

import { db } from '@/lib/db'
import { stage } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getStagesByEventId(eventId: number) {
  const stages = await db
    .select()
    .from(stage)
    .where(eq(stage.eventId, eventId))

  return stages
}

