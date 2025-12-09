/**
 * YouTubeService
 * 
 * Service for fetching YouTube videos through the secure Edge Function proxy.
 * API keys are never exposed to the client.
 * 
 * _Requirements: 2.1, 2.2_
 */

import { SecureApiService } from '../config/SecureApiService';

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
  /**
   * Search for videos related to health topics
   * Uses Edge Function proxy - API key never exposed to client
   */
  static async searchVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    try {
      const response = await SecureApiService.youtube<YouTubeVideo[]>('search', {
        query: params.query,
        maxResults: params.maxResults || 10,
        order: params.order || 'relevance',
        videoDuration: params.videoDuration,
      });

      if (response.error) {
        console.error('[YouTubeService] Search error:', response.error.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('[YouTubeService] Failed to search videos:', error);
      return [];
    }
  }

  /**
   * Get detailed video information including statistics
   * Uses Edge Function proxy - API key never exposed to client
   */
  static async getVideoDetails(videoIds: string): Promise<YouTubeVideo[]> {
    try {
      const response = await SecureApiService.youtube<YouTubeVideo[]>('details', {
        videoIds,
      });

      if (response.error) {
        console.error('[YouTubeService] Details error:', response.error.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('[YouTubeService] Failed to get video details:', error);
      return [];
    }
  }

  /**
   * Get health-related educational videos by category
   * Uses Edge Function proxy - API key never exposed to client
   */
  static async getHealthVideos(category: string): Promise<YouTubeVideo[]> {
    try {
      const response = await SecureApiService.youtube<YouTubeVideo[]>('healthVideos', {
        category,
        maxResults: 20,
      });

      if (response.error) {
        console.error('[YouTubeService] Health videos error:', response.error.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('[YouTubeService] Failed to get health videos:', error);
      return [];
    }
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
