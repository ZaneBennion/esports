import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { getGameLogoPath } from '@/lib/utils/logos'

interface EventPageProps {
  params: Promise<{
    eventid: string
    slug: string
  }>
}

// Sub-component: Event Header
function EventHeader({ gameName, gameLogoPath, eventName }: { 
  gameName: string
  gameLogoPath: string
  eventName: string 
}) {
  return (
    <div className="flex items-center gap-6 mb-6">
      <img 
        src={gameLogoPath} 
        alt={`${gameName} logo`}
        className="w-24 h-24 object-contain"
      />
      <div>
        <div className="text-lg text-[var(--foreground)]/70 mb-2">{gameName}</div>
        <h1 className="text-4xl font-bold">{eventName}</h1>
      </div>
    </div>
  )
}

// Sub-component: Event Details
function EventDetails({ startDate, endDate, slug }: { 
  startDate: string
  endDate: string
  slug: string 
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]/70 uppercase tracking-wider">
            Start Date
          </h2>
          <p className="text-lg">{startDate}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]/70 uppercase tracking-wider">
            End Date
          </h2>
          <p className="text-lg">{endDate}</p>
        </div>
      </div>
    </div>
  )
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventid, slug: eventSlug } = await params
  const data = await getEventById(parseInt(eventid))

  if (!data) {
    notFound()
  }

  const { event, game } = data
  
  // Verify the slug matches (for SEO and URL consistency)
  if (event.slug !== eventSlug) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[var(--background)] rounded-xl p-6 md:p-8 border border-gray-200">
          <EventHeader 
            gameName={game.name} 
            gameLogoPath={getGameLogoPath(game.id)} 
            eventName={event.name} 
          />
          <EventDetails 
            startDate={event.startDate} 
            endDate={event.endDate} 
            slug={event.slug} 
          />
        </div>
      </div>
    </div>
  )
}

