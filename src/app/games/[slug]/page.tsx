import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getGameBySlug, getEventsForGame } from '@/lib/actions/games'
import { getGameLogoPath } from '@/lib/logos'

interface GamePageProps {
  params: {
    slug: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.slug)

  if (!game) {
    notFound()
  }

  const events = await getEventsForGame(game.id)

  return (
    <div className="min-h-screen p-8">
      <Link 
        href="/" 
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to all games
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={getGameLogoPath(game.slug)} 
              alt={`${game.name} logo`}
              className="w-24 h-24 object-contain"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{game.name}</h1>
              <p className="text-gray-600 mt-2">Slug: {game.slug}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Events</h2>
          
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No events found for this game.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{event.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Start: {event.startDate}</span>
                    <span>•</span>
                    <span>End: {event.endDate}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Slug: {event.slug}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
