'use client'

import { BracketMatchWithDetails } from '@/lib/actions/brackets'
import styles from './bracket-visualization.module.css'

type BracketVisualizationProps = {
  matches: BracketMatchWithDetails[]
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
                const { bracketMatch, match, teamA, teamB } = matchData
                const isWinnerA = match?.result === 'team_a'
                const isWinnerB = match?.result === 'team_b'

                return (
                  <div key={bracketMatch.id} className={styles.matchCard}>
                    <div className={styles.matchPosition}>
                      Match {bracketMatch.matchInRound}
                    </div>
                    
                    {match && teamA && teamB ? (
                      <>
                        <div className={`${styles.team} ${isWinnerA ? styles.winner : ''}`}>
                          <span className={styles.teamName}>{teamA.name}</span>
                          <span className={styles.teamScore}>
                            {match.teamAScore ?? '-'}
                          </span>
                        </div>
                        <div className={`${styles.team} ${isWinnerB ? styles.winner : ''}`}>
                          <span className={styles.teamName}>{teamB.name}</span>
                          <span className={styles.teamScore}>
                            {match.teamBScore ?? '-'}
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

