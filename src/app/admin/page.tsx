import { getAllGames } from '@/lib/actions/games';
import { getAllOrgs } from '@/lib/actions/orgs';
import GamesColumn from './components/GamesColumn';
import OrgsColumn from './components/OrgsColumn';
import PlayersColumn from './components/PlayersColumn';
import styles from './page.module.css';

export default async function Admin() {
  // Fetch games and orgs in parallel for better performance
  const [games, orgs] = await Promise.all([
    getAllGames(),
    getAllOrgs()
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
      </div>
      
      <div className={styles.columnsContainer}>
        <GamesColumn games={games} />
        <OrgsColumn orgs={orgs} />
        <PlayersColumn />
      </div>
    </div>
  );
}
