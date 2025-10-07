'use server'

import { db } from '@/lib/db'
import { org, player, content } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { uploadImage } from './storage'


export async function getAllOrgs() {
  const orgs = await db
    .select()
    .from(org)
    .orderBy(org.name)

  return orgs
}

export async function getOrgById(id: number) {
  const orgs = await db
    .select()
    .from(org)
    .where(eq(org.id, id))
    .limit(1)

  return orgs.length > 0 ? orgs[0] : null
}

export async function getOrgBySlug(slug: string) {
  const orgs = await db
    .select()
    .from(org)
    .where(eq(org.slug, slug))
    .limit(1)

  return orgs.length > 0 ? orgs[0] : null
}

export async function getPlayersForOrg(orgId: number) {
  const players = await db
    .select()
    .from(player)
    .where(eq(player.orgId, orgId))

  return players
}

export async function getContentForOrg(orgId: number) {
  const contents = await db
    .select()
    .from(content)
    .where(eq(content.orgId, orgId))

  return contents
}

export async function getOrgsByRegion(region: string) {
  const orgs = await db
    .select()
    .from(org)
    .where(eq(org.region, region))

  return orgs
}

export async function getOrgRoute(orgId: number) {
  const orgData = await db
    .select({
      slug: org.slug,
    })
    .from(org)
    .where(eq(org.id, orgId))
    .limit(1)

  if (orgData.length === 0) {
    return null
  }

  const { slug } = orgData[0]

  return `/orgs/${orgId}/${slug}`
}

export async function createOrg(formData: FormData) {
  const orgName = formData.get('name') as string
  const slug = orgName.toLowerCase().replace(/\s+/g, '')
  const logoFile = formData.get('logo') as File
  const country = formData.get('country') as string
  const region = formData.get('region') as string

  await uploadImage(logoFile, slug, 'orgs')

  await db.insert(org).values({
    name: orgName,
    slug,
    country,
    region,
  })

  revalidatePath('/admin')
}