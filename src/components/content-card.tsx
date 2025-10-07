import { getLatestVideo } from '@/lib/youtube'
import { getOrgById } from '@/lib/actions/orgs'
import Link from 'next/link'
import styles from './content-card.module.css'
import { getOrgLogoPath } from '@/lib/logos'

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
      <div className={styles.emptyState}>
        <p className={styles.emptyStateText}>No videos found for {content.link}</p>
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      {/* Organization Name */}
      <Link 
        href={org ? `/orgs/${org.id}/${org.slug}` : '#'} 
        className={styles.orgLink}
      >
        {video.channelName}
        {org && (
          <div 
            style={{ maskImage: `url(${getOrgLogoPath(org.slug)})`, WebkitMaskImage: `url(${getOrgLogoPath(org.slug)})` }}
            className={styles.orgLogo}
            role="img"
            aria-label={`${org.name} logo`}
          />
        )}
      </Link>
      
      {/* Thumbnail */}
      <Link href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
        <div className={styles.thumbnailWrapper}>
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
            alt={video.title}
            className={styles.thumbnailImage}
          />
          {/* Play button overlay */}
          <div className={styles.playButtonOverlay}>
            <svg className={styles.playIcon} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <div className={styles.thumbnailBorder} />
        </div>
      </Link>
      
      {/* Video Title */}
      <div className={styles.titleContainer}>
        <p className={styles.titleText}>{video.title}</p>
      </div>
    </div>
  )
}