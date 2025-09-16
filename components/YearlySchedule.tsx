import { getSupabaseServerClient } from "@/lib/supabase/server";
import GameLogo from "./GameLogo";

type EventRow = {
  id: string;
  name: string;
  location: string;
  year: number;
  start_date: string; // ISO yyyy-mm-dd
  end_date: string;   // ISO yyyy-mm-dd
  game: string;
};

function getMonthIndex(dateIso: string): number {
  const d = new Date(dateIso + "T00:00:00Z");
  return d.getUTCMonth(); // 0-11
}

function getDayOfYear(dateIso: string): number {
  const d = new Date(dateIso + "T00:00:00Z");
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  const diff = (d.getTime() - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1; // 1..366
}

function daysInYear(year: number): number {
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return (end - start) / (1000 * 60 * 60 * 24);
}

function clamp(min: number, v: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default async function YearlySchedule({
  year,
  game,
}: {
  year: number;
  game: string;
}) {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, name, location, year, start_date, end_date, game")
    .eq("year", year)
    .eq("game", game)
    .order("start_date", { ascending: true });
  if (error) {
    throw error;
  }

  const events: EventRow[] = data ?? [];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const totalDays = daysInYear(year);

  // Today marker position for this year
  const today = new Date();
  const showToday = today.getUTCFullYear() === year;
  const todayPos = showToday
    ? (getDayOfYear(today.toISOString().slice(0, 10)) / totalDays) * 100
    : null;

  return (
    <div className="schedule-row">
      <div className="schedule-head">
        <div className="schedule-title">
          <GameLogo game={game} />
        </div>
      </div>
      <div className="schedule-grid">
        {/* Month headers */}
        {months.map((m) => (
          <div key={m} className="month-cell">
            <span className="month-label">{m}</span>
          </div>
        ))}

        {/* Event bars (absolute overlay) */}
        <div className="events-layer">
          {events.map((ev) => {
            const start = clamp(1, getDayOfYear(ev.start_date), totalDays);
            const end = clamp(start, getDayOfYear(ev.end_date), totalDays);
            const left = (start / totalDays) * 100;
            const width = ((end - start + 1) / totalDays) * 100;
            const title = `${ev.name} — ${ev.location}`;
            return (
              <div
                key={ev.id}
                className="event-bar"
                style={{ left: `${left}%`, width: `${width}%` }}
                title={title}
              >
                <span className="event-label">{ev.name}</span>
              </div>
            );
          })}
          {showToday && todayPos !== null && (
            <div className="today-marker" style={{ left: `${todayPos}%` }} />
          )}
        </div>
      </div>
    </div>
  );
}


