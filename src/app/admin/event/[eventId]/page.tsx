import { getEventById } from "@/lib/actions/events"
import { notFound } from "next/navigation"
import EventEditor from "./components/EventEditor"

interface EventPageProps {
  params: Promise<{
    eventId: string
  }>
}

export default async function Admin({ params }: EventPageProps){
  const { eventId } = await params
  const data = await getEventById(parseInt(eventId))

  if (!data) {
    notFound()
  }

  const { event, game } = data

  return (
    <div className="p-6">
      <div>{game.name}</div>
      <EventEditor event={event} />
    </div>
  )
}