import { ApiKeyService } from '../config/ApiKeyService';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
}

export interface YouTubeSearchParams {
  query: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'viewCount';
  videoDuration?: 'short' | 'medium' | 'long';
}

export class YouTubeService {
  private static readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';

  /**
   * Search for videos related to health topics
   */
  static async searchVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    const apiKey = await ApiKeyService.get('YOUTUBE');
    if (!apiKey) {
      console.error('YouTube API key not found');
      return [];
    }

    try {
      const searchParams = new URLSearchParams({
        key: apiKey,
        part: 'snippet',
        type: 'video',
        q: params.query,
        maxResults: (params.maxResults || 10).toString(),
        order: params.order || 'relevance',
        videoEmbeddable: 'true',
        videoSyndicated: 'true',
      });

      if (params.videoDuration) {
        searchParams.append('videoDuration', params.videoDuration);
      }

      const response = await fetch(
        `${this.BASE_URL}/search?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API error:', errorData);
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      const videoIds = data.items?.map((item: any) => item.id.videoId).join(',') || '';

      // Get video statistics and details
      if (videoIds) {
        const videos = await this.getVideoDetails(videoIds);
        return videos;
      }

      return this.transformVideos(data.items || []);
    } catch (error) {
      console.error('Failed to search YouTube videos:', error);
      return [];
    }
  }

  /**
   * Get detailed video information including statistics
   */
  static async getVideoDetails(videoIds: string): Promise<YouTubeVideo[]> {
    const apiKey = await ApiKeyService.get('YOUTUBE');
    if (!apiKey) {
      console.error('YouTube API key not found');
      return [];
    }

    try {
      const params = new URLSearchParams({
        key: apiKey,
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
      });

      const response = await fetch(
        `${this.BASE_URL}/videos?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformVideoDetails(data.items || []);
    } catch (error) {
      console.error('Failed to get video details:', error);
      return [];
    }
  }

  /**
   * Get health-related educational videos by category
   */
  static async getHealthVideos(category: string): Promise<YouTubeVideo[]> {
    const queries: Record<string, string> = {
      diabetes: 'diabetes management education tips',
      nutrition: 'healthy eating nutrition guide',
      exercise: 'exercise workout fitness health',
      bloodPressure: 'blood pressure management tips',
      bloodSugar: 'blood sugar control diabetes',
      weightLoss: 'weight loss healthy diet',
      mentalHealth: 'mental health wellness tips',
      cooking: 'healthy cooking recipes low carb',
    };

    const query = queries[category] || 'health wellness education';
    
    return this.searchVideos({
      query,
      maxResults: 20,
      order: 'relevance',
      videoDuration: 'medium',
    });
  }

  /**
   * Transform basic video search results
   */
  private static transformVideos(items: any[]): YouTubeVideo[] {
    return items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));
  }

  /**
   * Transform detailed video results with statistics
   */
  private static transformVideoDetails(items: any[]): YouTubeVideo[] {
    return items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: this.formatDuration(item.contentDetails.duration),
      viewCount: this.formatNumber(item.statistics.viewCount),
      likeCount: this.formatNumber(item.statistics.likeCount),
    }));
  }

  /**
   * Format ISO 8601 duration to readable format
   */
  private static formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '0M').replace('M', '');
    const seconds = (match[3] || '0S').replace('S', '');

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  /**
   * Format large numbers to readable format (e.g., 1.2M, 350K)
   */
  private static formatNumber(num: string | number): string {
    const number = typeof num === 'string' ? parseInt(num) : num;
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  }

  /**
   * Get video embed URL
   */
  static getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Get video watch URL
   */
  static getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}
