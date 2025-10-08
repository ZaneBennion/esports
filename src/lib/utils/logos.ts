/**
 * Utility functions for handling logo paths
 */

export type LogoType = 'games' | 'orgs'

/**
 * Generates the path to a logo SVG file based on the id
 * @param id - The id of the game or organization
 * @param type - The type of logo (games or orgs)
 * @returns The path to the SVG file
 */
export function getLogoPath(id: number, type: LogoType): string {
  return `https://rexzgglryqgnmxtvongu.supabase.co/storage/v1/object/public/Images/${type}/${id}.svg`
}

/**
 * Generates the path to a game logo SVG file
 * @param gameId - The id of the game
 * @returns The path to the game SVG file
 */
export function getGameLogoPath(gameId: number): string {
  return getLogoPath(gameId, 'games')
}

/**
 * Generates the path to an organization logo SVG file
 * @param orgId - The id of the organization
 * @returns The path to the organization SVG file
 */
export function getOrgLogoPath(orgId: number): string {
  return getLogoPath(orgId, 'orgs')
}

