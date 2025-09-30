import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlugAndYear } from '@/lib/actions/events'
import { getGameLogoPath } from '@/lib/logos'

interface EventPageProps {
  params: Promise<{
    game: string
    year: string
    event: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { game: gameSlug, year, event: eventSlug } = await params
  const data = await getEventBySlugAndYear(gameSlug, year, eventSlug)

  if (!data) {
    notFound()
  }

  const { event, game } = data

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href={`/games/${game.slug}`}
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to {game.name}
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={getGameLogoPath(game.slug)} 
              alt={`${game.name} logo`}
              className="w-16 h-16 object-contain"
            />
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">{game.name}</div>
              <h1 className="text-4xl font-bold text-gray-900">{event.name}</h1>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Start Date
                </h2>
                <p className="text-xl text-gray-900">{event.startDate}</p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  End Date
                </h2>
                <p className="text-xl text-gray-900">{event.endDate}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Event Slug
              </h2>
              <p className="text-gray-700">{event.slug}</p>
            </div>
          </div>

          {/* TODO: Add brackets, matches, and other event details */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Brackets</h2>
            <p className="text-gray-500 text-center py-8">Bracket information coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
