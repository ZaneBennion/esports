import { db } from '@/lib/db'
import { game, event, bracket, match, org, player, content } from '@/lib/db/schema'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'
import Link from 'next/link'
import styles from './page.module.css'

const REGIONS = [
  { href: '/orgs/amer', label: 'AMER' },
  { href: '/orgs/pac', label: 'PAC' },
  { href: '/orgs/emea', label: 'EMEA' },
  { href: '/orgs/cn', label: 'CN' },
]

export default async function Home() {
  // Fetch data from tables
  const games = await db.select().from(game)
  const contents = await db.select().from(content)
  
  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Organization Content Cards Section */}
        <section className={styles.contentSection}>
          <div className={styles.contentGrid}>
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </section>
        
        <hr className={styles.divider} />

        {/* Games and Regions Section */}
        <div className={styles.gamesRegionsContainer}>
          {/* Games Section */}
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

          {/* Regions Section - Desktop Sidebar */}
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

      {/* Mobile Footer - Regions */}
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
