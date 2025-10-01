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
    <div className="w-full">
      {/* Organization Name */}
      <Link 
        href={org ? `/orgs/${org.slug}` : '#'} 
        className="text-sm text-gray-700 mb-2 hover:text-gray-900 transition-colors block font-medium"
      >
        {video.channelName}
      </Link>
      
      {/* Thumbnail */}
      <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
        <div className="relative w-full aspect-video bg-gray-300 group rounded overflow-hidden mb-2">
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <svg className="w-12 h-12 text-white opacity-90" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div className="absolute inset-0 border border-gray-400 pointer-events-none rounded" />
        </div>
      </Link>
      
      {/* Video Title */}
      <div className="bg-gray-200 px-3 py-2 rounded">
        <p className="text-sm text-gray-900 line-clamp-2">{video.title}</p>
      </div>
    </div>
  )
}