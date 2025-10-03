import { db } from '@/lib/db'
import { game, event, bracket, match, org, player, content } from '@/lib/db/schema'
import { AuthHeader } from '@/components/auth-header'
import { GameCard } from '@/components/game-card'
import { ContentCard } from '@/components/content-card'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import styles from './page.module.css'

export default async function Home() {
  // Fetch data from tables
  const games = await db.select().from(game)
  const contents = await db.select().from(content)
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Home/Logo
          </Link>
          <div className={styles.headerActions}>
            <ThemeToggle />
            <AuthHeader />
          </div>
        </div>
      </header>

      <hr className={styles.divider} />

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
            <Link
              href="/orgs/amer"
              className={styles.regionLink}
            >
              AMER
            </Link>
            <Link
              href="/orgs/pac"
              className={styles.regionLink}
            >
              PAC
            </Link>
            <Link
              href="/orgs/emea"
              className={styles.regionLink}
            >
              EMEA
            </Link>
            <Link
              href="/orgs/cn"
              className={styles.regionLink}
            >
              CN
            </Link>
          </aside>
        </div>
      </main>

      {/* Mobile Footer - Regions */}
      <footer className={styles.mobileFooter}>
        <div className={styles.footerContent}>
          <Link
            href="/orgs/cn"
            className={styles.regionLink}
          >
            CN
          </Link>
          <Link
            href="/orgs/emea"
            className={styles.regionLink}
          >
            EMEA
          </Link>
          <Link
            href="/orgs/pac"
            className={styles.regionLink}
          >
            PAC
          </Link>
          <Link
            href="/orgs/amer"
            className={styles.regionLink}
          >
            AMER
          </Link>
        </div>
      </footer>
    </div>
  )
}
