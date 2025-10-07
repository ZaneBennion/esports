'use server'

import { db } from '@/lib/db'
import { bracket, bracketMatch, match, org } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getOrgById } from './orgs'

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
 * Fetch a single parent match with its bracket match and match data
 */
async function fetchParentMatchData(parentMatchId: number | null) {
  if (!parentMatchId) {
    return []
  }

  return db
    .select({
      bracketMatch: bracketMatch,
      match: match,
    })
    .from(bracketMatch)
    .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
    .where(eq(bracketMatch.id, parentMatchId))
    .limit(1)
}

/**
 * Get teams for both sides of a match
 */
async function getTeamsForMatch(matchData: typeof match.$inferSelect | null) {
  if (!matchData) {
    return { teamA: null, teamB: null }
  }

  const [teamA, teamB] = await Promise.all([
    matchData.teamAId ? getOrgById(matchData.teamAId) : null,
    matchData.teamBId ? getOrgById(matchData.teamBId) : null,
  ])

  return { teamA, teamB }
}

/**
 * Enrich parent match data with team information
 */
async function enrichParentMatchData(
  parentMatchData: Array<{
    bracketMatch: typeof bracketMatch.$inferSelect
    match: typeof match.$inferSelect | null
  }>
) {
  if (parentMatchData.length === 0) {
    return {
      bracketMatch: null,
      match: null,
      teamA: null,
      teamB: null,
    }
  }

  const { teamA, teamB } = await getTeamsForMatch(parentMatchData[0].match)

  return {
    bracketMatch: parentMatchData[0].bracketMatch,
    match: parentMatchData[0].match,
    teamA,
    teamB,
  }
}

/**
 * Get detailed information for a single bracket match including parent matches
 */
async function getBracketMatchDetails(
  bracketMatchData: {
    bracketMatch: typeof bracketMatch.$inferSelect
    match: typeof match.$inferSelect | null
  }
): Promise<BracketMatchWithDetails> {
  // Fetch parent match data in parallel
  const [parentMatch1Data, parentMatch2Data] = await Promise.all([
    fetchParentMatchData(bracketMatchData.bracketMatch.parentMatch1Id),
    fetchParentMatchData(bracketMatchData.bracketMatch.parentMatch2Id),
  ])

  // Enrich parent matches with team data
  const [parentMatch1, parentMatch2] = await Promise.all([
    enrichParentMatchData(parentMatch1Data),
    enrichParentMatchData(parentMatch2Data),
  ])

  // Get teams for the current match
  const { teamA, teamB } = await getTeamsForMatch(bracketMatchData.match)

  return {
    bracketMatch: bracketMatchData.bracketMatch,
    match: bracketMatchData.match,
    teamA,
    teamB,
    parentMatch1,
    parentMatch2,
  }
}

/**
 * Get all bracket matches for a specific bracket with full details
 */
async function getBracketMatchesWithDetails(bracketId: number): Promise<BracketMatchWithDetails[]> {
  const bracketMatches = await db
    .select({
      bracketMatch: bracketMatch,
      match: match,
    })
    .from(bracketMatch)
    .leftJoin(match, eq(bracketMatch.id, match.bracketMatchId))
    .where(eq(bracketMatch.bracketId, bracketId))

  return Promise.all(bracketMatches.map(getBracketMatchDetails))
}

/**
 * Enrich a single bracket with its matches and all related details
 */
async function enrichBracketWithMatches(
  bracketData: typeof bracket.$inferSelect
): Promise<BracketWithMatches> {
  const matches = await getBracketMatchesWithDetails(bracketData.id)

  return {
    bracket: bracketData,
    matches,
  }
}

/**
 * Get all brackets for an event with their matches and team details
 */
export async function getBracketsForEvent(eventId: number): Promise<BracketWithMatches[]> {
  const brackets = await db
    .select()
    .from(bracket)
    .where(eq(bracket.eventId, eventId))

  return Promise.all(brackets.map(enrichBracketWithMatches))
}

