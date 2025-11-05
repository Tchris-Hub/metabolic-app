import { ApiKeyService } from '../config/ApiKeyService';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  viewCount: number;
  channelTitle: string;
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export class YouTubeService {
  private static readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  /**
   * Search for health-related videos by topic
   * Ensures consistent results regardless of category/location by:
   * - using a stable base query
   * - setting explicit language/region/order parameters
   */
  static async searchHealthVideos(
    topic: string,
    maxResults: number = 10,
    pageToken?: string
  ): Promise<YouTubeSearchResult> {
    const apiKey = await ApiKeyService.get('YOUTUBE');
    if (!apiKey) {
      console.error('YouTube API key not found');
      return { videos: [], totalResults: 0 };
    }
    try {
      const normalized = (topic || '').toString().trim();
      const base = 'metabolic health wellness education';
      const searchQuery = normalized
        ? `${normalized} ${base}`
        : base;

      // Force consistent params across environments
      const params = new URLSearchParams({
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: String(maxResults),
        key: apiKey,
        order: 'relevance',
        safeSearch: 'moderate',
        relevanceLanguage: 'en',
        regionCode: 'US',
      });
      if (pageToken) params.set('pageToken', pageToken);

      const url = `${this.BASE_URL}/search?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(`YouTube API Error: ${data.error.message}`);
      }

      const videos: YouTubeVideo[] = (data.items || [])
        .filter((item: any) => item?.id?.videoId)
        .map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          duration: 'N/A', // Would need separate API call for duration
          publishedAt: item.snippet.publishedAt,
          viewCount: 0, // Would need separate API call for view count
          channelTitle: item.snippet.channelTitle,
        }));

      return {
        videos,
        nextPageToken: data.nextPageToken,
        totalResults: data.pageInfo?.totalResults || videos.length,
      };
    } catch (error) {
      console.error('YouTube search error:', error);
      return {
        videos: [],
        totalResults: 0,
      };
    }
  }

  /**
   * Get video details including duration and view count
   */
  static async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    const apiKey = await ApiKeyService.get('YOUTUBE');
    if (!apiKey) {
      console.error('YouTube API key not found');
      return null;
    }
    try {
      const url = `${this.BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error || !data.items || data.items.length === 0) {
        return null;
      }

      const item = data.items[0];
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: this.parseDuration(item.contentDetails.duration),
        publishedAt: item.snippet.publishedAt,
        viewCount: parseInt(item.statistics.viewCount) || 0,
        channelTitle: item.snippet.channelTitle,
      };
    } catch (error) {
      console.error('YouTube video details error:', error);
      return null;
    }
  }

  /**
   * Parse ISO 8601 duration to readable format
   */
  private static parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Unknown';

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Get health topic specific videos
   */
  static async getHealthTopicVideos(topic: 'diabetes' | 'hypertension' | 'nutrition' | 'exercise' | 'emergency'): Promise<YouTubeVideo[]> {
    const topicQueries = {
      diabetes: 'diabetes management blood sugar control',
      hypertension: 'high blood pressure management hypertension',
      nutrition: 'healthy eating diabetes nutrition meal planning',
      exercise: 'diabetes exercise fitness blood sugar',
      emergency: 'diabetes emergency hypoglycemia hyperglycemia',
    };

    const result = await this.searchHealthVideos(topicQueries[topic], 5);
    return result.videos;
  }

  /**
   * Get YouTube embed URL for a video
   */
  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Get YouTube watch URL for a video
   */
  static getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}
