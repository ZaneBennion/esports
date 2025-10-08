import { getGameLogoPath } from '@/lib/utils/logos'
import { getLatestEventForGame, getEventRoute } from '@/lib/actions/events'
import Link from 'next/link'
import styles from './game-card.module.css'

interface GameCardProps {
  game: {
    id: number
    name: string
    slug: string
  }
}

export async function GameCard({ game }: GameCardProps) {
  const latestEvent = await getLatestEventForGame(game.id)
  const eventRoute = latestEvent ? await getEventRoute(latestEvent.id) : null

  return (
    <div className={styles.card}>
      {/* Game Section */}
      <Link 
        href={`/${game.slug}`} 
        className={styles.gameSection}
      >
        <img 
          src={getGameLogoPath(game.id)} 
          alt={`${game.name} logo`}
          className={styles.gameLogo}
        />
        <p className={styles.gameName}>{game.name}</p>
      </Link>
      
      {/* Event Details Section */}
      <div className={styles.eventSection}>
        {latestEvent && eventRoute ? (
          <Link href={eventRoute} className={styles.eventLink}>
            <p className={styles.eventName}>{latestEvent.name}</p>
            <p className={styles.eventDates}>
              {latestEvent.startDate} - {latestEvent.endDate}
            </p>
          </Link>
        ) : (
          <p className={styles.noEventText}>(Event Details)</p>
        )}
      </div>
    </div>
  )
}
