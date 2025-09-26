/**
 * Utility functions for handling local SVG logos
 */

export type LogoType = 'games' | 'orgs'

/**
 * Generates the path to a logo SVG file based on the slug
 * @param slug - The slug of the game or organization
 * @param type - The type of logo (games or orgs)
 * @returns The path to the SVG file
 */
export function getLogoPath(slug: string, type: LogoType): string {
  return `/logos/${type}/${slug}.svg`
}

/**
 * Generates the path to a game logo SVG file
 * @param gameSlug - The slug of the game
 * @returns The path to the game SVG file
 */
export function getGameLogoPath(gameSlug: string): string {
  return getLogoPath(gameSlug, 'games')
}

/**
 * Generates the path to an organization logo SVG file
 * @param orgSlug - The slug of the organization
 * @returns The path to the organization SVG file
 */
export function getOrgLogoPath(orgSlug: string): string {
  return getLogoPath(orgSlug, 'orgs')
}

/**
 * Fallback logo path for when a logo doesn't exist
 * @param type - The type of logo (games or orgs)
 * @returns The path to the fallback SVG file
 */
export function getFallbackLogoPath(type: LogoType): string {
  return `/logos/${type}/placeholder.svg`
}
