import { getGameLogoPath } from '@/lib/logos'
import { getLatestEventForGame, getEventRoute } from '@/lib/actions/events'
import Link from 'next/link'

interface GameCardProps {
  game: {
    id: number
    name: string
    slug: string
  }
}

export async function GameCard({ game }: GameCardProps) {
  const latestEvent = await getLatestEventForGame(game.id)
  const eventRoute = latestEvent ? await getEventRoute(latestEvent.id) : null

  return (
    <div className="bg-gray-200 rounded-lg flex flex-row overflow-hidden border border-gray-300">
      {/* Game Section */}
      <Link 
        href={`/games/${game.slug}`} 
        className="flex flex-col items-center justify-center bg-gray-300 border-r-2 border-gray-900 p-4 min-w-[120px]"
      >
        <img 
          src={getGameLogoPath(game.slug)} 
          alt={`${game.name} logo`}
          className="w-16 h-16 object-contain mb-2"
        />
        <p className="text-sm text-gray-900">{game.name}</p>
      </Link>
      
      {/* Event Details Section */}
      <div className="flex-1 p-4 flex items-center">
        {latestEvent && eventRoute ? (
          <Link href={eventRoute} className="text-gray-900">
            <p className="font-medium mb-1">{latestEvent.name}</p>
            <p className="text-sm text-gray-600">
              {latestEvent.startDate} - {latestEvent.endDate}
            </p>
          </Link>
        ) : (
          <p className="text-gray-600">(Event Details)</p>
        )}
      </div>
    </div>
  )
}
