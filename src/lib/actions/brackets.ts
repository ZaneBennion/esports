'use server'

import { db } from '@/lib/db'
import { bracket, bracketMatch, match, org } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type BracketMatchWithDetails = {
  bracketMatch: typeof bracketMatch.$inferSelect
  match: typeof match.$inferSelect | null
  teamA: typeof org.$inferSelect | null
  teamB: typeof org.$inferSelect | null
}

export type BracketWithMatches = {
  bracket: typeof bracket.$inferSelect
  matches: BracketMatchWithDetails[]
}

/**
 * Get all brackets for an event with their matches and team details
 */
export async function getBracketsForEvent(eventId: number): Promise<BracketWithMatches[]> {
  // Get all brackets for the event
  const brackets = await db
    .select()
    .from(bracket)
    .where(eq(bracket.eventId, eventId))

  // For each bracket, get all its matches with team details
  const bracketsWithMatches = await Promise.all(
    brackets.map(async (b) => {
      const bracketMatches = await db
        .select({
          bracketMatch: bracketMatch,
          match: match,
        })
        .from(bracketMatch)
        .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
        .where(eq(bracketMatch.bracketId, b.id))

      // Get team details for each match
      const matchesWithTeams = await Promise.all(
        bracketMatches.map(async (bm) => {
          if (!bm.match) {
            return {
              bracketMatch: bm.bracketMatch,
              match: null,
              teamA: null,
              teamB: null,
            }
          }

          const [teamA, teamB] = await Promise.all([
            db.select().from(org).where(eq(org.id, bm.match.teamAId)).limit(1),
            db.select().from(org).where(eq(org.id, bm.match.teamBId)).limit(1),
          ])

          return {
            bracketMatch: bm.bracketMatch,
            match: bm.match,
            teamA: teamA[0] || null,
            teamB: teamB[0] || null,
          }
        })
      )

      return {
        bracket: b,
        matches: matchesWithTeams,
      }
    })
  )

  return bracketsWithMatches
}

