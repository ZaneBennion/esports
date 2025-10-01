import { getLatestVideo } from '@/lib/youtube'

interface ContentCardProps {
  content: {
    link: string
    orgId: number
  }
}

export async function ContentCard({ content }: ContentCardProps) {
  const video = await getLatestVideo(content.link)
  
  if (!video) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-500">No videos found for {content.link}</p>
      </div>
    )
  }
  
  return (
    <div>
        <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
        <div className="border rounded-lg overflow-hidden">
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
        <div className="p-1">
            <h1 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h1>
        </div>
        </div>
    </div>
  )
}