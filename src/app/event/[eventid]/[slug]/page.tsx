import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventById } from '@/lib/actions/events'
import { getGameLogoPath } from '@/lib/utils/logos'
import { getStagesByEventId } from '@/lib/actions/stages'
import { getTableStageData } from '@/lib/actions/table-matches'
import { getBracketStageData } from '@/lib/actions/bracket-matches'
import Tabs, { type Tab } from '@/components/tabs'
import { TableStage } from '@/components/table-stage'
import { BracketStage } from '@/components/bracket-stage'
import { formatDate } from '@/lib/utils/date'

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
          <p className="text-lg">{formatDate(startDate)}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]/70 uppercase tracking-wider">
            End Date
          </h2>
          <p className="text-lg">{formatDate(endDate)}</p>
        </div>
      </div>
    </div>
  )
}

// Sub-component: Loading indicator
function LoadingStage() {
  return (
    <div className="text-center py-8 text-[var(--foreground)]/70">
      Loading...
    </div>
  )
}

// Sub-component: Table Stage Data Loader
async function TableStageContent({ stageId }: { stageId: number }) {
  const standings = await getTableStageData(stageId)
  return <TableStage standings={standings} />
}

// Sub-component: Bracket Stage Data Loader
async function BracketStageContent({ stageId }: { stageId: number }) {
  const rounds = await getBracketStageData(stageId)
  return <BracketStage rounds={rounds} />
}

// Sub-component: Stages Section
async function StagesSection({ eventId }: { eventId: number }) {
  const stages = await getStagesByEventId(eventId)

  if (stages.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--foreground)]/70">
        No stages found for this event.
      </div>
    )
  }

  const tabs: Tab[] = stages.map((stage) => ({
    id: stage.id.toString(),
    label: stage.name,
    content: (
      <Suspense fallback={<LoadingStage />}>
        {stage.type === 'table' ? (
          <TableStageContent stageId={stage.id} />
        ) : (
          <BracketStageContent stageId={stage.id} />
        )}
      </Suspense>
    ),
  }))

  return <Tabs tabs={tabs} />
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

        {/* Stages Section */}
        <div className="mt-6 bg-[var(--background)] rounded-xl p-6 md:p-8 border border-gray-200">
          <Suspense fallback={<LoadingStage />}>
            <StagesSection eventId={event.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

