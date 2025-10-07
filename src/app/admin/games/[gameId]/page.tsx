import { getAllGames, getEventsForGame } from '@/lib/actions/games';
import { notFound } from 'next/navigation';
import EventsManager from './components/EventsManager';
import Link from 'next/link';
import styles from './page.module.css';

export default async function GameEventsPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;
  const gameIdNumber = parseInt(gameId);

  if (isNaN(gameIdNumber)) {
    notFound();
  }

  const [games, events] = await Promise.all([
    getAllGames(),
    getEventsForGame(gameIdNumber),
  ]);

  const game = games.find((g) => g.id === gameIdNumber);

  if (!game) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{game.name} Events</h1>
      </div>

      <EventsManager game={game} events={events} />
    </div>
  );
}

