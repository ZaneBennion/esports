'use server'

import { db } from '@/lib/db'
import { bracket, bracketMatch, match, org } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type BracketMatchWithDetails = {
  bracketMatch: typeof bracketMatch.$inferSelect
  match: typeof match.$inferSelect | null
  teamA: typeof org.$inferSelect | null
  teamB: typeof org.$inferSelect | null
  parentMatch1: {
    bracketMatch: typeof bracketMatch.$inferSelect | null
    match: typeof match.$inferSelect | null
    teamA: typeof org.$inferSelect | null
    teamB: typeof org.$inferSelect | null
  }
  parentMatch2: {
    bracketMatch: typeof bracketMatch.$inferSelect | null
    match: typeof match.$inferSelect | null
    teamA: typeof org.$inferSelect | null
    teamB: typeof org.$inferSelect | null
  }
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

      // Get team details and parent match info for each match
      const matchesWithTeams = await Promise.all(
        bracketMatches.map(async (bm) => {
          // Get parent match information
          const [parentMatch1Data, parentMatch2Data] = await Promise.all([
            bm.bracketMatch.parentMatch1Id
              ? db
                  .select({
                    bracketMatch: bracketMatch,
                    match: match,
                  })
                  .from(bracketMatch)
                  .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
                  .where(eq(bracketMatch.id, bm.bracketMatch.parentMatch1Id))
                  .limit(1)
              : Promise.resolve([]),
            bm.bracketMatch.parentMatch2Id
              ? db
                  .select({
                    bracketMatch: bracketMatch,
                    match: match,
                  })
                  .from(bracketMatch)
                  .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
                  .where(eq(bracketMatch.id, bm.bracketMatch.parentMatch2Id))
                  .limit(1)
              : Promise.resolve([]),
          ])

          // Get team info for parent matches
          const [parent1TeamA, parent1TeamB, parent2TeamA, parent2TeamB] = await Promise.all([
            parentMatch1Data[0]?.match?.teamAId
              ? db.select().from(org).where(eq(org.id, parentMatch1Data[0].match.teamAId)).limit(1)
              : Promise.resolve([]),
            parentMatch1Data[0]?.match?.teamBId
              ? db.select().from(org).where(eq(org.id, parentMatch1Data[0].match.teamBId)).limit(1)
              : Promise.resolve([]),
            parentMatch2Data[0]?.match?.teamAId
              ? db.select().from(org).where(eq(org.id, parentMatch2Data[0].match.teamAId)).limit(1)
              : Promise.resolve([]),
            parentMatch2Data[0]?.match?.teamBId
              ? db.select().from(org).where(eq(org.id, parentMatch2Data[0].match.teamBId)).limit(1)
              : Promise.resolve([]),
          ])

          const parentMatch1 = {
            bracketMatch: parentMatch1Data[0]?.bracketMatch || null,
            match: parentMatch1Data[0]?.match || null,
            teamA: parent1TeamA[0] || null,
            teamB: parent1TeamB[0] || null,
          }

          const parentMatch2 = {
            bracketMatch: parentMatch2Data[0]?.bracketMatch || null,
            match: parentMatch2Data[0]?.match || null,
            teamA: parent2TeamA[0] || null,
            teamB: parent2TeamB[0] || null,
          }

          if (!bm.match) {
            return {
              bracketMatch: bm.bracketMatch,
              match: null,
              teamA: null,
              teamB: null,
              parentMatch1,
              parentMatch2,
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
            parentMatch1,
            parentMatch2,
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

