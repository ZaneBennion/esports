import { getEventById } from "@/lib/actions/events"
import { Suspense } from 'react'
import { notFound } from "next/navigation"
import EventEditor from "./components/EventEditor"
import Tabs, { type Tab } from '@/components/tabs'
import TableEditor from "./components/TableEditor"
import BracketEditor from "./components/BracketEditor"
import { getStagesByEventId } from "@/lib/actions/stages"

interface EventPageProps {
  params: Promise<{
    eventId: string
  }>
}

// Sub-component: Loading indicator
function LoadingStage() {
  return (
    <div className="text-center py-8 text-[var(--foreground)]/70">
      Loading...
    </div>
  )
}

// Sub-component: Stages Section
async function StagesSection({ eventId }: { eventId: number }) {
  const stages = await getStagesByEventId(eventId)

  if (stages.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--foreground)]/70">
        No stages found for this event.
      </div>
    )
  }

  const tabs: Tab[] = stages.map((stage) => ({
    id: stage.id.toString(),
    label: stage.name,
    content: (
      <Suspense fallback={<LoadingStage />}>
        {stage.type === 'table' ? (
          <TableEditor/>
        ) : (
          <BracketEditor/>
        )}
      </Suspense>
    ),
  }))

  return <Tabs tabs={tabs} />
}
export default async function Admin({ params }: EventPageProps){
  const { eventId } = await params
  const data = await getEventById(parseInt(eventId))

  if (!data) {
    notFound()
  }

  const { event, game } = data

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[80rem] p-6 w-full"> 
        <div>{game.name}</div>
        <EventEditor event={event} />
        <StagesSection eventId={event.id}/>
      </div>
    </div>
  )
}