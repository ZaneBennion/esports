import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEventBySlugAndYear } from '@/lib/actions/events'
import { getBracketsForEvent } from '@/lib/actions/brackets'
import { getGameLogoPath } from '@/lib/logos'
import Tabs from '@/components/tabs'
import BracketVisualization from '@/components/bracket-visualization'
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
  const brackets = await getBracketsForEvent(event.id)

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

          <div className={styles.bracketsSection}>
            <h2 className={styles.bracketsTitle}>Brackets</h2>
            {brackets.length > 0 ? (
              <Tabs
                tabs={brackets.map((b) => ({
                  id: b.bracket.id.toString(),
                  label: b.bracket.name,
                  content: <BracketVisualization matches={b.matches} />,
                }))}
              />
            ) : (
              <p className={styles.placeholder}>No brackets available for this event.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
