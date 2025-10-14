import { getGameLogoPath } from '@/lib/utils/logos'
import { getLatestEventForGame } from '@/lib/actions/events'
import { buildEventRoute } from '@/lib/utils/routes'
import { formatDate } from '@/lib/utils/date'
import Link from 'next/link'

interface GameCardProps {
  game: {
    id: number
    name: string
    slug: string
  }
}

// Sub-component: Game Logo and Name
function GameInfo({ game }: { game: GameCardProps['game'] }) {
  return (
    <Link 
      href={`/${game.slug}`} 
      className="flex flex-col items-center justify-center border-r border-[var(--shadow)] p-4 min-w-[120px] no-underline"
    >
      <img 
        src={getGameLogoPath(game.id)} 
        alt={`${game.name} logo`}
        className="w-16 h-16 object-contain mb-2"
      />
      <p className="text-sm text-[var(--foreground)]">{game.name}</p>
    </Link>
  )
}

// Sub-component: Event Details
function EventInfo({ event, eventRoute }: { 
  event: { name: string; startDate: string; endDate: string } | null
  eventRoute: string | null 
}) {
  return (
    <div className="flex-1 p-4 flex items-center">
      {event && eventRoute ? (
        <Link href={eventRoute} className="text-[var(--foreground)] no-underline">
          <p className="font-medium mb-1">{event.name}</p>
          <p className="text-sm text-[var(--foreground)]">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </p>
        </Link>
      ) : (
        <p className="text-gray-600">(Event Details)</p>
      )}
    </div>
  )
}

export async function GameCard({ game }: GameCardProps) {
  const latestEvent = await getLatestEventForGame(game.id)
  const eventRoute = latestEvent ? buildEventRoute(latestEvent.id, latestEvent.slug) : null

  return (
    <div className="bg-[var(--background)] rounded-lg flex flex-row overflow-hidden border border-gray-200">
      <GameInfo game={game} />
      <EventInfo event={latestEvent} eventRoute={eventRoute} />
    </div>
  )
}
