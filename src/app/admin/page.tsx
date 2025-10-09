import { getAllGames } from '@/lib/actions/games';
import { getAllOrgs } from '@/lib/actions/orgs';
import GamesColumn from './components/GamesColumn';
import OrgsColumn from './components/OrgsColumn';
import PlayersColumn from './components/PlayersColumn';

// Sub-component: Admin Header
function AdminHeader() {
  return (
    <div className="max-w-full text-center">
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
    </div>
  )
}

// Sub-component: Columns Grid
function ColumnsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-full mx-auto">
      {children}
    </div>
  )
}

export default async function Admin() {
  // Fetch games and orgs in parallel for better performance
  const [games, orgs] = await Promise.all([
    getAllGames(),
    getAllOrgs()
  ]);

  return (
    <div className="p-4 md:p-8 bg-background text-foreground">
      <AdminHeader />
      
      <ColumnsGrid>
        <GamesColumn games={games} />
        <OrgsColumn orgs={orgs} />
        <PlayersColumn />
      </ColumnsGrid>
    </div>
  );
}
