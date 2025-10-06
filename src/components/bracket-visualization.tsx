'use client'

import { BracketMatchWithDetails } from '@/lib/actions/brackets'
import styles from './bracket-visualization.module.css'

type BracketVisualizationProps = {
  matches: BracketMatchWithDetails[]
}

type TeamInfo = {
  id: number
  name: string
  slug: string
  country: string
  region: string
}

// Helper function to determine which team advanced from a parent match
function getAdvancingTeam(
  parentMatch: BracketMatchWithDetails['parentMatch1'] | BracketMatchWithDetails['parentMatch2'],
  advanceWinner: boolean | null
): TeamInfo | null {
  if (!parentMatch?.match || !parentMatch.match.result) {
    return null
  }

  const match = parentMatch.match
  const isTeamAWinner = match.result === 'team_a'
  
  // If advanceWinner is true, the winner advances; if false, the loser advances
  if (advanceWinner === true) {
    return isTeamAWinner ? parentMatch.teamA : parentMatch.teamB
  } else if (advanceWinner === false) {
    return isTeamAWinner ? parentMatch.teamB : parentMatch.teamA
  }
  
  return null
}

export default function BracketVisualization({ matches }: BracketVisualizationProps) {
  if (matches.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No matches in this bracket yet.</p>
      </div>
    )
  }

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.bracketMatch.roundNumber
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(match)
    return acc
  }, {} as Record<number, BracketMatchWithDetails[]>)

  // Sort rounds and matches within rounds
  const sortedRounds = Object.entries(matchesByRound)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([round, roundMatches]) => ({
      round: parseInt(round),
      matches: roundMatches.sort(
        (a, b) => a.bracketMatch.matchInRound - b.bracketMatch.matchInRound
      ),
    }))

  return (
    <div className={styles.bracketContainer}>
      <div className={styles.bracket}>
        {sortedRounds.map(({ round, matches: roundMatches }) => (
          <div key={round} className={styles.round}>
            <div className={styles.roundHeader}>Round {round}</div>
            <div className={styles.roundMatches}>
              {roundMatches.map((matchData) => {
                const { bracketMatch, match, teamA, teamB, parentMatch1, parentMatch2 } = matchData
                const isWinnerA = match?.result === 'team_a'
                const isWinnerB = match?.result === 'team_b'

                // Determine teams to display (either from match or derived from parent matches)
                let displayTeamA = teamA
                let displayTeamB = teamB
                let isDerived = false

                if (!match) {
                  // Get teams from parent matches if available
                  const derivedTeamA = getAdvancingTeam(parentMatch1, bracketMatch.advanceWinner1)
                  const derivedTeamB = getAdvancingTeam(parentMatch2, bracketMatch.advanceWinner2)

                  if (derivedTeamA) {
                    displayTeamA = derivedTeamA
                    isDerived = true
                  }

                  if (derivedTeamB) {
                    displayTeamB = derivedTeamB
                    isDerived = true
                  }
                }

                const hasTeams = displayTeamA || displayTeamB

                return (
                  <div key={bracketMatch.id} className={styles.matchCard}>
                    <div className={styles.matchPosition}>
                      Match {bracketMatch.matchInRound}
                    </div>
                    
                    {hasTeams ? (
                      <>
                        <div className={`${styles.team} ${isWinnerA ? styles.winner : ''} ${isDerived && !match ? styles.derived : ''}`}>
                          <span className={styles.teamName}>
                            {displayTeamA?.name || 'TBD'}
                          </span>
                          <span className={styles.teamScore}>
                            {match?.teamAScore ?? '-'}
                          </span>
                        </div>
                        <div className={`${styles.team} ${isWinnerB ? styles.winner : ''} ${isDerived && !match ? styles.derived : ''}`}>
                          <span className={styles.teamName}>
                            {displayTeamB?.name || 'TBD'}
                          </span>
                          <span className={styles.teamScore}>
                            {match?.teamBScore ?? '-'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className={styles.tbd}>TBD</div>
                    )}

                    {bracketMatch.matchTime && (
                      <div className={styles.matchTime}>
                        {new Date(bracketMatch.matchTime).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

