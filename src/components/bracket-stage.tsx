import type { BracketMatch, Match, Org } from '@/lib/db/schema'

type BracketStageProps = {
  rounds: Record<number, {
    bracketMatch: BracketMatch
    match: Match | null
    teamA: Org | null
    teamB: Org | null
  }[]>
}

type BracketMatchCardProps = {
  bracketMatch: BracketMatch
  match: Match | null
  teamA: Org | null
  teamB: Org | null
}

function BracketMatchCard({ bracketMatch, match, teamA, teamB }: BracketMatchCardProps) {
  return (
    <div
      className="border border-[var(--foreground)]/20 rounded-lg p-4 bg-[var(--background)]"
    >
      <div className="space-y-2">
        {/* Team A */}
        <div className="flex justify-between items-center py-2 border-b border-[var(--foreground)]/10">
          <span className={match?.result === 'team_a' ? 'font-semibold' : ''}>
            {teamA?.name || 'TBD'}
          </span>
          <span className="ml-4 font-mono">
            {match?.teamAScore ?? '-'}
          </span>
        </div>

        {/* Team B */}
        <div className="flex justify-between items-center py-2">
          <span className={match?.result === 'team_b' ? 'font-semibold' : ''}>
            {teamB?.name || 'TBD'}
          </span>
          <span className="ml-4 font-mono">
            {match?.teamBScore ?? '-'}
          </span>
        </div>
      </div>

      {/* Match info */}
      {match?.matchTime && (
        <div className="mt-3 pt-3 border-t border-[var(--foreground)]/10 text-sm text-[var(--foreground)]/70">
          {new Date(match.matchTime).toLocaleString()}
        </div>
      )}
    </div>
  )
}

export function BracketStage({ rounds }: BracketStageProps) {
  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b)

  if (roundNumbers.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--foreground)]/70">
        No matches found in this bracket.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {roundNumbers.map((roundNum) => (
        <div key={roundNum} className="space-y-4">
          <h3 className="text-xl font-semibold">Round {roundNum}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rounds[roundNum].map((item) => (
              <BracketMatchCard
                key={item.bracketMatch.id}
                bracketMatch={item.bracketMatch}
                match={item.match}
                teamA={item.teamA}
                teamB={item.teamB}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

