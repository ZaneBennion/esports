// Utility function to create URL-safe event name
export function createEventSlug(eventName: string): string {
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Utility function to create URL-safe game name
export function createGameSlug(gameName: string): string {
  return gameName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Game name to slug mapping
const GAME_SLUG_MAP: Record<string, string> = {
  'Valorant': 'valorant',
  'Halo': 'halo',
  'CS2': 'cs2',
  'Rocket League': 'rocket-league',
  'League of Legends': 'league-of-legends',
};

// Reverse mapping from slug to game name
const GAME_SLUG_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(GAME_SLUG_MAP).map(([name, slug]) => [slug, name])
);

// Convert game name to slug
export function getGameSlug(gameName: string): string {
  return GAME_SLUG_MAP[gameName] || createGameSlug(gameName);
}

// Convert game slug to name
export function getGameName(gameSlug: string): string {
  return GAME_SLUG_REVERSE_MAP[gameSlug] || gameSlug;
}

// Utility function to generate event detail URL
export function getEventDetailUrl(game: string, year: number, eventName: string): string {
  const gameSlug = getGameSlug(game);
  const eventSlug = createEventSlug(eventName);
  return `/${gameSlug}/${year}/${eventSlug}`;
}
