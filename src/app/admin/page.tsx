import { getAllGames } from '@/lib/actions/games';
import { getAllOrgs } from '@/lib/actions/orgs';
import GamesColumn from './components/GamesColumn';
import OrgsColumn from './components/OrgsColumn';
import PlayersColumn from './components/PlayersColumn';
import styles from './page.module.css';

export default async function Admin() {
  const games = await getAllGames();
  const orgs = await getAllOrgs();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Manage your esports platform</p>
      </div>
      
      <div className={styles.columnsContainer}>
        <GamesColumn games={games} />
        <OrgsColumn orgs={orgs} />
        <PlayersColumn />
      </div>
    </div>
  );
}
