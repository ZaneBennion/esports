'use server'

import { db } from '@/lib/db'
import { bracketMatch, match, org } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export async function getBracketStageData(stageId: number) {
  const teamA = alias(org, 'teamA')
  const teamB = alias(org, 'teamB')

  const bracketMatches = await db
    .select({
      bracketMatch: bracketMatch,
      match: match,
      teamA: teamA,
      teamB: teamB,
    })
    .from(bracketMatch)
    .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
    .leftJoin(teamA, eq(match.teamAId, teamA.id))
    .leftJoin(teamB, eq(match.teamBId, teamB.id))
    .where(eq(bracketMatch.stageId, stageId))
    .orderBy(asc(bracketMatch.roundNumber), asc(bracketMatch.matchInRound))

  const rounds: Record<number, any[]> = {}

  bracketMatches.forEach((bm) => {
    const roundNum = bm.bracketMatch.roundNumber
    if (!rounds[roundNum]) {
      rounds[roundNum] = []
    }

    rounds[roundNum].push({
      bracketMatch: bm.bracketMatch,
      match: bm.match,
      teamA: bm.teamA,
      teamB: bm.teamB,
    })
  })

  return rounds
}

