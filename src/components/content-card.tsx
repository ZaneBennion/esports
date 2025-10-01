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
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Embedded YouTube Video */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
        <p className="text-xs text-gray-500">
          {new Date(video.published).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  )
}