import { Suspense } from 'react'
import { db } from '@/lib/db'
import { game, content } from '@/lib/db/schema'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'
import { GamesSkeleton, ContentGridSkeleton } from '@/components/skeletons'
import Link from 'next/link'

const REGIONS = [
  { href: '/orgs/amer', label: 'AMER' },
  { href: '/orgs/pac', label: 'PAC' },
  { href: '/orgs/emea', label: 'EMEA' },
  { href: '/orgs/cn', label: 'CN' },
]

// Sub-component: Region Link Button
function RegionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="w-full py-3 px-4 rounded-full text-foreground font-semibold text-center border border-gray-300 hover:border-gray-400"
    >
      {label}
    </Link>
  )
}

// Sub-component: Divider
function Divider() {
  return (
    <hr className="h-0.5 color-foreground mb-4 md:mb-8 flex-shrink-0" />
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden md:overflow-auto">
      {/* Main Content */}
      <main className="flex-1 max-w-[80rem] w-full mx-auto p-4 flex flex-col overflow-hidden md:overflow-visible">
        {/* Organization Content Cards Section - streams independently */}
        <Suspense fallback={<ContentGridSkeleton />}>
          <ContentSection />
        </Suspense>
        
        <Divider />

        {/* Games and Regions Section */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden lg:overflow-visible min-h-0">
          {/* Games Section - streams independently */}
          <Suspense fallback={<GamesSkeleton />}>
            <GamesSection />
          </Suspense>

          {/* Regions Section - Desktop Sidebar (renders immediately) */}
          <aside className="hidden lg:flex flex-col gap-4 w-32">
            {REGIONS.map((region) => (
              <RegionLink key={region.href} href={region.href} label={region.label} />
            ))}
          </aside>
        </div>
      </main>

      {/* Mobile Footer - Regions (renders immediately) */}
      <footer className="lg:hidden bg-background border-t-1 border-foreground p-2 flex-shrink-0 w-full fixed bottom-0 z-10">
        <div className="flex justify-center gap-4">
          {REGIONS.toReversed().map((region) => (
            <RegionLink key={region.href} href={region.href} label={region.label} />
          ))}
        </div>
      </footer>
    </div>
  )
}

async function ContentSection() {
  const contents = await db.select().from(content)
  
  return (
    <section className="mb-4 md:mb-8 flex-shrink-0">
      <div className="flex gap-4 overflow-x-auto overflow-y-hidden md:grid md:grid-cols-5 md:overflow-visible">
        {contents.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>
    </section>
  )
}

async function GamesSection() {
  const games = await db.select().from(game)
  
  return (
    <section className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 md:overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      {games.length === 0 && (
        <p className="text-gray-500 text-center py-8">No games found in the database.</p>
      )}
    </section>
  )
}
