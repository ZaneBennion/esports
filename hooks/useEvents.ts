"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type EventRow = {
  id: string;
  name: string;
  location: string;
  year: number;
  start_date: string; // ISO yyyy-mm-dd
  end_date: string;   // ISO yyyy-mm-dd
  game: string;
  color?: string;     // Hex color code for event background
};

export function useEvents(game: string, year: number) {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("events")
          .select("id, name, location, year, start_date, end_date, game, color")
          .eq("year", year)
          .eq("game", game)
          .order("start_date", { ascending: true });

        if (error) {
          throw error;
        }

        setEvents(data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    if (game && year) {
      fetchEvents();
    }
  }, [game, year]);

  return { events, loading, error };
}