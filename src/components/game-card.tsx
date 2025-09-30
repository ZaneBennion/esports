import { getGameLogoPath } from '@/lib/logos'
import { getLatestEventForGame } from '@/lib/actions/events'

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
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <img 
          src={getGameLogoPath(game.slug)} 
          alt={`${game.name} logo`}
          className="w-16 h-16 object-contain mb-4"
        />
        <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
        
        {latestEvent && (
          <div className="mt-3 text-sm text-gray-600">
            <p className="font-medium">{latestEvent.name}</p>
            <p className="text-xs text-gray-500">
              {latestEvent.startDate} - {latestEvent.endDate}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
