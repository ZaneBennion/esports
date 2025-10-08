import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getOrgById, getPlayersForOrg, getContentForOrg } from '@/lib/actions/orgs'
import { ContentCard } from '@/components/content-card'
import { getOrgLogoPath } from '@/lib/utils/logos'
import { PlayersSkeleton, ContentSkeleton } from '@/components/skeletons'

interface OrgPageProps {
  params: Promise<{
    orgid: string
    slug: string
  }>
}

export default async function OrgPage({ params }: OrgPageProps) {
  const { orgid, slug: orgSlug } = await params
  const org = await getOrgById(parseInt(orgid))

  if (!org) {
    notFound()
  }

  // Verify the slug matches (for SEO and URL consistency)
  if (org.slug !== orgSlug) {
    notFound()
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Organization header shows immediately */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <img 
              src={getOrgLogoPath(org.id)} 
              alt={`${org.name} logo`}
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{org.name}</h1>
            <div className="flex gap-4 text-gray-600">
              <span>🌍 {org.country}</span>
              <span>•</span>
              <span>📍 {org.region}</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">Slug: {org.slug}</p>
          </div>
        </div>

        {/* Players Section - streams independently */}
        <Suspense fallback={<PlayersSkeleton />}>
          <PlayersSection orgId={org.id} />
        </Suspense>

        {/* Content Section - streams independently */}
        <Suspense fallback={<ContentSkeleton />}>
          <ContentSection orgId={org.id} />
        </Suspense>
      </div>
    </div>
  )
}

async function PlayersSection({ orgId }: { orgId: number }) {
  const players = await getPlayersForOrg(orgId)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Players</h2>
      
      {players.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No players found for this organization.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900">{player.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Player ID: {player.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

async function ContentSection({ orgId }: { orgId: number }) {
  const contents = await getContentForOrg(orgId)
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">Content</h2>
      
      {contents.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No content found for this organization.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      )}
    </div>
  )
}

