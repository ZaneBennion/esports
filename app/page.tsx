import Schedule from "@/components/Schedule";
import { ScrollProvider } from "@/contexts/ScrollContext";

export default function Page() {
  const year = new Date().getUTCFullYear();
  const games = [
    "Valorant",
    "Halo",
    "CS2",
    "Rocket League",
    "League of Legends",
  ];

  return (
    <ScrollProvider>
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Esport Network — {year}
        </h1>
        <div style={{ opacity: 0.8, marginBottom: 24 }}>Events by game</div>
        <div>
          {games.map((g) => (
            <Schedule key={g} year={year} game={g} />
          ))}
        </div>
      </main>
    </ScrollProvider>
  );
}
