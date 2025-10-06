import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlugAndYear } from '@/lib/actions/events'
import { getGameLogoPath } from '@/lib/logos'
import styles from './page.module.css'

interface EventPageProps {
  params: Promise<{
    slug: string
    year: string
    event: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug: gameSlug, year, event: eventSlug } = await params
  const data = await getEventBySlugAndYear(gameSlug, year, eventSlug)

  if (!data) {
    notFound()
  }

  const { event, game } = data

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>

        <div className={styles.card}>
          <div className={styles.header}>
            <img 
              src={getGameLogoPath(game.slug)} 
              alt={`${game.name} logo`}
              className={styles.logo}
            />
            <div className={styles.headerContent}>
              <div className={styles.gameName}>{game.name}</div>
              <h1 className={styles.title}>{event.name}</h1>
            </div>
          </div>

          <div className={styles.divider}>
            <div className={styles.grid}>
              <div className={styles.fieldGroup}>
                <h2 className={styles.fieldLabel}>
                  Start Date
                </h2>
                <p className={styles.fieldValue}>{event.startDate}</p>
              </div>
              <div className={styles.fieldGroup}>
                <h2 className={styles.fieldLabel}>
                  End Date
                </h2>
                <p className={styles.fieldValue}>{event.endDate}</p>
              </div>
            </div>

            <div className={styles.slugSection}>
              <h2 className={styles.fieldLabel}>
                Event Slug
              </h2>
              <p className={styles.slugValue}>{event.slug}</p>
            </div>
          </div>

          {/* TODO: Add brackets, matches, and other event details */}
          <div className={styles.bracketsSection}>
            <h2 className={styles.bracketsTitle}>Brackets</h2>
            <p className={styles.placeholder}>Bracket information coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
