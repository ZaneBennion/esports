'use server'

import { db } from '@/lib/db'
import { tableMatch, match, org } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getTableStageData(stageId: number) {
  // Get all teams in this stage
  const tableMatches = await db
    .select({
      tableMatch: tableMatch,
      team: org,
    })
    .from(tableMatch)
    .innerJoin(org, eq(tableMatch.team, org.id))
    .where(eq(tableMatch.stageId, stageId))

  // Get all matches for this stage
  const matches = await db
    .select()
    .from(match)
    .where(eq(match.stageId, stageId))

  // Calculate win/loss records for each team
  const standings = tableMatches.map(({ tableMatch: tm, team }) => {
    let wins = 0
    let losses = 0

    matches.forEach((m) => {
      if (m.result === null) return // Skip unplayed matches

      if (m.teamAId === team.id) {
        if (m.result === 'team_a') wins++
        else if (m.result === 'team_b') losses++
        // Draws don't count as wins or losses
      } else if (m.teamBId === team.id) {
        if (m.result === 'team_b') wins++
        else if (m.result === 'team_a') losses++
      }
    })

    return {
      team,
      wins,
      losses,
    }
  })

  // Sort by wins (descending), then by team name
  standings.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return a.team.name.localeCompare(b.team.name)
  })

  return standings
}

