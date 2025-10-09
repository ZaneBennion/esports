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
    <section className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 md:overflow-visible">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[var(--background)] rounded-lg flex flex-row overflow-hidden border border-gray-200">
            {/* Game Section Skeleton */}
            <div className="flex flex-col items-center justify-center border-r border-[var(--shadow)] p-4 min-w-[120px]">
              <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
            </div>
            
            {/* Event Section Skeleton */}
            <div className="flex-1 p-4 flex items-center">
              <div className="flex-1">
                <div className="h-5 w-[70%] bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-[50%] bg-gray-200 rounded animate-pulse"></div>
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
    <section className="mb-4 md:mb-8 flex-shrink-0">
      <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 md:grid md:grid-cols-5 md:overflow-visible">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-[45%] min-w-[150px] md:w-auto text-[var(--foreground)] bg-[var(--background)] rounded-lg border border-gray-200 flex flex-col flex-shrink-0">
            {/* Organization Link Skeleton */}
            <div className="text-sm p-1 pt-1 font-medium rounded-t-lg flex justify-between items-center">
              <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Thumbnail Skeleton */}
            <div className="relative w-full aspect-video rounded-tr-lg overflow-hidden flex items-center justify-center flex-shrink-0">
              <div className="w-[95%] h-[95%] bg-gray-200 animate-pulse"></div>
            </div>
            
            {/* Title Skeleton */}
            <div className="p-1 pb-1 rounded-b-lg flex-1 min-w-0">
              <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
