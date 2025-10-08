import { Suspense } from 'react'
import { db } from '@/lib/db'
import { game, content } from '@/lib/db/schema'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'
import { GamesSkeleton, ContentGridSkeleton } from '@/components/skeletons'
import Link from 'next/link'
import styles from './page.module.css'

const REGIONS = [
  { href: '/orgs/amer', label: 'AMER' },
  { href: '/orgs/pac', label: 'PAC' },
  { href: '/orgs/emea', label: 'EMEA' },
  { href: '/orgs/cn', label: 'CN' },
]

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Organization Content Cards Section - streams independently */}
        <Suspense fallback={<ContentGridSkeleton />}>
          <ContentSection />
        </Suspense>
        
        <hr className={styles.divider} />

        {/* Games and Regions Section */}
        <div className={styles.gamesRegionsContainer}>
          {/* Games Section - streams independently */}
          <Suspense fallback={<GamesSkeleton />}>
            <GamesSection />
          </Suspense>

          {/* Regions Section - Desktop Sidebar (renders immediately) */}
          <aside className={styles.regionsSidebar}>
            {REGIONS.map((region) => (
              <Link
                key={region.href}
                href={region.href}
                className={styles.regionLink}
              >
                {region.label}
              </Link>
            ))}
          </aside>
        </div>
      </main>

      {/* Mobile Footer - Regions (renders immediately) */}
      <footer className={styles.mobileFooter}>
        <div className={styles.footerContent}>
          {REGIONS.toReversed().map((region) => (
            <Link
              key={region.href}
              href={region.href}
              className={styles.regionLink}
            >
              {region.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}

async function ContentSection() {
  const contents = await db.select().from(content)
  
  return (
    <section className={styles.contentSection}>
      <div className={styles.contentGrid}>
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
    <section className={styles.gamesSection}>
      <div className={styles.gamesGrid}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      {games.length === 0 && (
        <p className={styles.noGames}>No games found in the database.</p>
      )}
    </section>
  )
}
