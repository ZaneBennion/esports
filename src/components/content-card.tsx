import { getLatestVideo } from '@/lib/youtube'
import { getOrgById } from '@/lib/actions/orgs'
import Link from 'next/link'

interface ContentCardProps {
  content: {
    link: string
    orgId: number
  }
}

export async function ContentCard({ content }: ContentCardProps) {
  const video = await getLatestVideo(content.link)
  const org = await getOrgById(content.orgId)
  
  if (!video) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500">No videos found for {content.link}</p>
      </div>
    )
  }
  
  return (
    <div className="w-full max-w-[240px]">
        <Link 
          href={org ? `/orgs/${org.slug}` : '#'} 
          className="text-md text-gray-600 mb-1 hover:text-blue-600 transition-colors block"
        >
          {video.channelName}
        </Link>
        <div className="border rounded overflow-hidden">
        {/* Embedded YouTube Video */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            />
        </div>
        
        {/* Video Info */}
        <div className="p-2">
            <h1 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h1>
        </div>
        </div>
    </div>
  )
}