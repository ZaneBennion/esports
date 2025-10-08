export function buildGameRoute(slug: string): string {
  return `/${slug}`
}

export function buildEventRoute(eventId: number, slug: string): string {
  return `/event/${eventId}/${slug}`
}

export function buildOrgRoute(orgId: number, slug: string): string {
  return `/orgs/${orgId}/${slug}`
}

