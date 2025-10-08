export type LogoType = 'games' | 'orgs'

export function getLogoPath(id: number, type: LogoType): string {
  return `https://rexzgglryqgnmxtvongu.supabase.co/storage/v1/object/public/Images/${type}/${id}.svg`
}

export function getGameLogoPath(gameId: number): string {
  return getLogoPath(gameId, 'games')
}

export function getOrgLogoPath(orgId: number): string {
  return getLogoPath(orgId, 'orgs')
}

