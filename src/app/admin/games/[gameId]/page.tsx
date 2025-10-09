import { getAllGames, getEventsForGame } from '@/lib/actions/games';
import { notFound } from 'next/navigation';
import EventsManager from './components/EventsManager';

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
    <div className="p-4 md:p-8 bg-background text-foreground">
      <div className="max-w-full text-center mb-6">
        <h1 className="text-4xl font-bold">{game.name} Events</h1>
      </div>

      <EventsManager game={game} events={events} />
    </div>
  );
}

