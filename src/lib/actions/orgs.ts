'use server'

import { db } from '@/lib/db'
import { org, player, content } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Get an org by its ID
 */
export async function getOrgById(id: number) {
  const orgs = await db
    .select()
    .from(org)
    .where(eq(org.id, id))
    .limit(1)

  return orgs.length > 0 ? orgs[0] : null
}

/**
 * Get an org by its slug
 */
export async function getOrgBySlug(slug: string) {
  const orgs = await db
    .select()
    .from(org)
    .where(eq(org.slug, slug))
    .limit(1)

  return orgs.length > 0 ? orgs[0] : null
}

/**
 * Get all players for a specific org
 */
export async function getPlayersForOrg(orgId: number) {
  const players = await db
    .select()
    .from(player)
    .where(eq(player.orgId, orgId))

  return players
}

/**
 * Get all content for a specific org
 */
export async function getContentForOrg(orgId: number) {
  const contents = await db
    .select()
    .from(content)
    .where(eq(content.orgId, orgId))

  return contents
}

