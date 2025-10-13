import { getEventById } from "@/lib/actions/events"
import { notFound } from "next/navigation"

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
    <div>
      <h1>{game.name}</h1>
      <div>{event.name}</div>
    </div>
  )
}