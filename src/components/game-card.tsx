import { getGameLogoPath } from '@/lib/logos'
import { getLatestEventForGame } from '@/lib/actions/events'
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

  return (
    <div className="bg-white rounded-lg flex flex-row">
      <Link href={`/games/${game.slug}`} className="flex flex-col items-center justify-center text-center border-r-2 border-black p-2">
        <img 
          src={getGameLogoPath(game.slug)} 
          alt={`${game.name} logo`}
          className="w-16 h-16 object-contain"
        />
        <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
      </Link>
        
        {latestEvent && (
          <div className="p-2 text-sm text-gray-600">
            <p className="font-medium">{latestEvent.name}</p>
            <p className="text-xs text-gray-500">
              {latestEvent.startDate} - {latestEvent.endDate}
            </p>
          </div>
        )}
    </div>
  )
}
