import type { Org } from '@/lib/db/schema'

type TableStageProps = {
  standings: {
    team: Org
    wins: number
    losses: number
  }[]
}

export function TableStage({ standings }: TableStageProps) {
  if (standings.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--foreground)]/70">
        No teams found in this stage.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[var(--foreground)]">
            <th className="text-left py-3 px-4 font-semibold">Team</th>
            <th className="text-center py-3 px-4 font-semibold">Wins</th>
            <th className="text-center py-3 px-4 font-semibold">Losses</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr
              key={standing.team.id}
              className={`border-b border-[var(--foreground)]/20 ${
                index % 2 === 0 ? 'bg-[var(--background)]' : 'bg-[var(--foreground)]/5'
              }`}
            >
              <td className="py-3 px-4">{standing.team.name}</td>
              <td className="py-3 px-4 text-center">{standing.wins}</td>
              <td className="py-3 px-4 text-center">{standing.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

