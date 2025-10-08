import pageStyles from '@/app/page.module.css'
import gameCardStyles from './game-card.module.css'
import contentCardStyles from './content-card.module.css'

export function PlayersSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContentSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4">
            <div className="h-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function GamesSkeleton() {
  return (
    <section className={pageStyles.gamesSection}>
      <div className={pageStyles.gamesGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={gameCardStyles.card}>
            {/* Game Section Skeleton */}
            <div className={gameCardStyles.gameSection}>
              <div className={gameCardStyles.gameLogo} style={{ backgroundColor: '#e5e7eb', borderRadius: '0.25rem' }}></div>
              <div style={{ 
                height: '1.25rem', 
                width: '4rem', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
            </div>
            
            {/* Event Section Skeleton */}
            <div className={gameCardStyles.eventSection}>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  height: '1.25rem', 
                  width: '70%', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  width: '50%', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ContentGridSkeleton() {
  return (
    <section className={pageStyles.contentSection}>
      <div className={pageStyles.contentGrid}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={contentCardStyles.container}>
            {/* Organization Link Skeleton */}
            <div className={contentCardStyles.orgLink}>
              <div style={{ 
                height: '1rem', 
                width: '60%', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
            </div>
            
            {/* Thumbnail Skeleton */}
            <div className={contentCardStyles.thumbnailWrapper}>
              <div style={{ 
                width: '95%', 
                height: '95%', 
                backgroundColor: '#e5e7eb',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
            </div>
            
            {/* Title Skeleton */}
            <div className={contentCardStyles.titleContainer}>
              <div style={{ 
                height: '1rem', 
                width: '90%', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
