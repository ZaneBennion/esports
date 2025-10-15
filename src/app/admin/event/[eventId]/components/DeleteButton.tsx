'use client'

import { deleteTableMatch } from "@/lib/actions/table-matches";
import { table } from "console";

export default function DeleteButton({ tableMatchId }: { tableMatchId: number}){
  return (
    <button onClick={() => {deleteTableMatch(tableMatchId)}}>x</button>
  )  
}