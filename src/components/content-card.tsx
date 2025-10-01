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
        {/* YouTube Thumbnail */}
        <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
          <div className="relative w-full aspect-video bg-black group">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <svg className="w-16 h-16 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </Link>
        
        {/* Video Info */}
        <div className="p-2">
            <h1 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h1>
        </div>
        </div>
    </div>
  )
}