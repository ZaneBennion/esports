import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrgBySlug, getPlayersForOrg, getContentForOrg, getOrgsByRegion } from '@/lib/actions/orgs'
import { ContentCard } from '@/components/content-card'

interface OrgPageProps {
  params: {
    slug: string
  }
}

const REGIONS = ['amer', 'pac', 'emea', 'cn'] as const
const REGION_NAMES: Record<string, string> = {
  amer: 'Americas',
  pac: 'Pacific',
  emea: 'EMEA',
  cn: 'China'
}

export default async function OrgPage({ params }: OrgPageProps) {
  // Check if the slug is a region
  if (REGIONS.includes(params.slug as any)) {
    const orgs = await getOrgsByRegion(params.slug)
    const regionName = REGION_NAMES[params.slug] || params.slug.toUpperCase()

    return (
      <div className="min-h-screen p-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {regionName} Organizations
            </h1>
            <p className="text-gray-600">
              Showing all organizations in the {regionName} region
            </p>
          </div>

          {orgs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-500 text-center py-8">
                No organizations found in this region.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/orgs/${org.slug}`}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {org.name}
                  </h2>
                  <div className="flex gap-3 text-sm text-gray-600">
                    <span>🌍 {org.country}</span>
                    <span>•</span>
                    <span>📍 {org.region.toUpperCase()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Otherwise, treat it as an org slug
  const org = await getOrgBySlug(params.slug)

  if (!org) {
    notFound()
  }

  const players = await getPlayersForOrg(org.id)
  const contents = await getContentForOrg(org.id)

  return (
    <div className="min-h-screen p-8">
      <Link 
        href="/" 
        className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
      >
        ← Back to home
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{org.name}</h1>
            <div className="flex gap-4 text-gray-600">
              <span>🌍 {org.country}</span>
              <span>•</span>
              <span>📍 {org.region}</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">Slug: {org.slug}</p>
          </div>
        </div>

        {/* Players Section */}
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

        {/* Content Section */}
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
      </div>
    </div>
  )
}

