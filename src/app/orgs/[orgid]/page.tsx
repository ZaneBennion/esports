import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOrgsByRegion, getOrgRoute } from '@/lib/actions/orgs'

interface RegionPageProps {
  params: Promise<{
    orgid: string
  }>
}

const REGIONS = ['amer', 'pac', 'emea', 'cn'] as const
const REGION_NAMES: Record<string, string> = {
  amer: 'Americas',
  pac: 'Pacific',
  emea: 'EMEA',
  cn: 'China'
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { orgid } = await params
  
  // This page only handles region listings
  if (!REGIONS.includes(orgid as any)) {
    notFound()
  }

  const orgs = await getOrgsByRegion(orgid)
  const regionName = REGION_NAMES[orgid] || orgid.toUpperCase()

  // Get routes for all orgs
  const orgsWithRoutes = await Promise.all(
    orgs.map(async (org) => ({
      ...org,
      route: await getOrgRoute(org.id),
    }))
  )

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {regionName} Organizations
          </h1>
          <p className="text-gray-600">
            Showing all organizations in the {regionName} region
          </p>
        </div>

        {orgsWithRoutes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-500 text-center py-8">
              No organizations found in this region.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgsWithRoutes.map((org) => (
              <Link
                key={org.id}
                href={org.route || '#'}
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

