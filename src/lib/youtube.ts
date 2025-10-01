export interface YouTubeVideo {
  videoId: string
  title: string
  description: string
  published: string
  thumbnail: string
  channelName: string
}

/**
 * Converts a YouTube handle (@channelname) or channel ID to a channel ID
 * If already a channel ID (starts with UC), returns as-is
 */
export async function getChannelId(handleOrId: string): Promise<string | null> {
  try {
    // Try to resolve handle to channel ID by fetching the channel page
    const response = await fetch(`https://www.youtube.com/${handleOrId}`, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    
    // Extract channel ID from the page source
    const channelIdMatch = html.match(/"channelId":"([^"]+)"/) || 
                          html.match(/channel\/([A-Za-z0-9_-]{24})/)
    
    if (channelIdMatch) {
      return channelIdMatch[1]
    }
    
    // Fallback: try the handle directly with RSS feed
    return handleOrId
  } catch (error) {
    console.error('Error resolving channel ID:', error)
    return handleOrId // Return as-is and hope it works
  }
}

/**
 * Checks if a YouTube video is a Short by fetching the video page
 * @param videoId - YouTube video ID
 * @returns true if the video is a Short, false otherwise
 */
async function isShort(videoId: string): Promise<boolean> {
  try {
    // Fetch the video page with redirect following disabled
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    
    // Check for shorts-specific indicators in the HTML
    // Shorts have specific metadata and URL patterns
    const isShortVideo = html.includes('"isShort":true') || 
                         html.includes('/shorts/') ||
                         html.includes('\"shortDescription\":\"#shorts') ||
                         response.url.includes('/shorts/')
    
    return isShortVideo
  } catch (error) {
    console.error('Error checking if video is short:', error)
    return false
  }
}

/**
 * Fetches the latest regular video (non-Short) from a YouTube channel using RSS feed
 * @param channelIdOrHandle - YouTube channel ID or handle (with or without @)
 * @returns The latest video data or null if not found
 */
export async function getLatestVideo(channelIdOrHandle: string): Promise<YouTubeVideo | null> {
  try {
    const channelId = await getChannelId(channelIdOrHandle)
    if (!channelId) return null
    
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch RSS feed: ${response.status}`)
      return null
    }
    
    const xmlText = await response.text()
    
    // Parse all video entries from the RSS feed
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    const entries = [...xmlText.matchAll(entryRegex)]
    
    if (entries.length === 0) {
      console.error('No videos found in RSS feed')
      return null
    }
    
    // Get channel name from the feed level (same for all videos)
    const channelNameMatch = xmlText.match(/<author>[\s\S]*?<name>([^<]+)<\/name>/)
    
    // Check each video until we find one that's not a Short
    for (const entry of entries) {
      const entryText = entry[1]
      
      const videoIdMatch = entryText.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
      if (!videoIdMatch) continue
      
      const videoId = videoIdMatch[1]
      
      // Check if this video is a Short
      const isVideoShort = await isShort(videoId)
      
      if (!isVideoShort) {
        // This is a regular video, parse its data and return it
        const titleMatch = entryText.match(/<title>([^<]+)<\/title>/)
        const descMatch = entryText.match(/<media:description>([^<]+)<\/media:description>/)
        const publishedMatch = entryText.match(/<published>([^<]+)<\/published>/)
        const thumbnailMatch = entryText.match(/<media:thumbnail url="([^"]+)"/)
        
        return {
          videoId,
          title: titleMatch?.[1]?.replace(/&amp;/g, '&').replace(/&quot;/g, '"') || 'Untitled',
          description: descMatch?.[1]?.replace(/&amp;/g, '&').replace(/&quot;/g, '"') || '',
          published: publishedMatch?.[1] || '',
          thumbnail: thumbnailMatch?.[1] || '',
          channelName: channelNameMatch?.[1] || ''
        }
      }
    }
    
    // If all videos are shorts, return null
    console.error('Only Shorts found in feed, no regular videos')
    return null
    
  } catch (error) {
    console.error('Error fetching latest video:', error)
    return null
  }
}

