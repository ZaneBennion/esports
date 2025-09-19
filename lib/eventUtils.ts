// Utility function to create URL-safe event name
export function createEventSlug(eventName: string): string {
  return eventName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Utility function to generate event detail URL
export function getEventDetailUrl(game: string, year: number, eventName: string): string {
  const eventSlug = createEventSlug(eventName);
  return `/${game}/${year}/${eventSlug}`;
}
