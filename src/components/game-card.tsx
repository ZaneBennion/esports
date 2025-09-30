import { getGameLogoPath } from '@/lib/logos'

interface GameCardProps {
  game: {
    id: number
    name: string
    slug: string
  }
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <img 
          src={getGameLogoPath(game.slug)} 
          alt={`${game.name} logo`}
          className="w-16 h-16 object-contain mb-4"
        />
        <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
      </div>
    </div>
  )
}
