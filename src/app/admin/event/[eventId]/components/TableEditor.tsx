import { getTableTeamsById } from "@/lib/actions/table-matches"
import DeleteButton from "./DeleteButton";

export default async function TableEditor({ stageId }: { stageId: number }) {
  const teams = await getTableTeamsById(stageId);

  console.log(stageId);
  console.log(teams);

  return (
    <div>
      <div>Table editor</div>
      <div>
        {teams.length === 0 ? (
          <div>No teams yet</div>
        ) : (
          teams.map((team) => {
            return <div key={team.tableMatch.id}>
              <span>{team.team.name}</span>
              <DeleteButton tableMatchId={team.tableMatch.id}/>
            </div>
          })
        )}
      </div>
    </div>
  )
}