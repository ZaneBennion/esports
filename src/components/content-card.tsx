import { getLatestVideo } from '@/lib/youtube'
import { getOrgById } from '@/lib/actions/orgs'
import Link from 'next/link'
import { getOrgLogoPath } from '@/lib/utils/logos'

interface ContentCardProps {
  content: {
    link: string
    orgId: number
  }
}

// Sub-component: Organization Link with Logo
function OrgLink({ org, channelName }: { 
  org: { id: number; name: string; slug: string } | null
  channelName: string 
}) {
  return (
    <Link 
      href={org ? `/orgs/${org.id}/${org.slug}` : '#'} 
      className="text-sm px-2 pt-0.5 font-medium rounded-t-lg flex items-center gap-2 min-w-0"
    >
      <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
        {channelName}
      </span>
      {org && (
        <div 
          style={{ 
            maskImage: `url(${getOrgLogoPath(org.id)})`, 
            WebkitMaskImage: `url(${getOrgLogoPath(org.id)})` 
          }}
          className="w-4 h-4 bg-current [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat] shrink-0"
          role="img"
          aria-label={`${org.name} logo`}
        />
      )}
    </Link>
  )
}

// Sub-component: Video Thumbnail with Play Button
function VideoThumbnail({ videoId, title }: { videoId: string; title: string }) {
  return (
    <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
      <div className="relative w-full aspect-video overflow-hidden flex items-center justify-center">
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-[95%] h-[95%] object-cover"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}

// Sub-component: Video Title
function VideoTitle({ title }: { title: string }) {
  return (
    <div className="px-2 pb-0.5 rounded-b-lg flex-1 min-w-0">
      <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{title}</p>
    </div>
  )
}

export async function ContentCard({ content }: ContentCardProps) {
  const video = await getLatestVideo(content.link)
  const org = await getOrgById(content.orgId)
  
  if (!video) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500">No videos found for {content.link}</p>
      </div>
    )
  }
  
  return (
    <div className="w-full min-w-0 text-foreground bg-background rounded-lg border border-gray-200 flex flex-col">
      <OrgLink org={org} channelName={video.channelName} />
      <VideoThumbnail videoId={video.videoId} title={video.title} />
      <VideoTitle title={video.title} />
    </div>
  )
}