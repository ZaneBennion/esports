import Schedule from "@/components/Schedule";
import MonthIndicator from "@/components/MonthIndicator";
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
        <MonthIndicator year={year} />
        <div>
          {games.map((g) => (
            <Schedule key={g} year={year} game={g} />
          ))}
        </div>
      </main>
    </ScrollProvider>
  );
}