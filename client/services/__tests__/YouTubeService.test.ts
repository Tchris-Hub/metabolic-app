/**
 * Unit Tests for YouTubeService
 * Tests video search and health videos functionality via SecureApiService
 * 
 * _Requirements: 2.1, 2.2_
 */

// Mock SecureApiService
jest.mock('../config/SecureApiService', () => ({
  SecureApiService: {
    youtube: jest.fn(),
  },
}));

import { YouTubeService, YouTubeVideo } from '../apis/YouTubeService';
import { SecureApiService } from '../config/SecureApiService';

const mockYoutube = SecureApiService.youtube as jest.MockedFunction<typeof SecureApiService.youtube>;

describe('YouTubeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchVideos', () => {
    it('should return videos on successful search', async () => {
      const mockVideos: YouTubeVideo[] = [
        {
          id: 'abc123',
          title: 'Diabetes Management Tips',
          description: 'Learn how to manage diabetes',
          thumbnail: 'https://example.com/thumb.jpg',
          channelTitle: 'Health Channel',
          publishedAt: '2024-01-01T00:00:00Z',
          duration: '10:30',
          viewCount: '1.2M',
        },
      ];

      mockYoutube.mockResolvedValueOnce({
        data: mockVideos,
        error: null,
      });

      const result = await YouTubeService.searchVideos({ query: 'diabetes' });

      expect(result).toEqual(mockVideos);
      expect(mockYoutube).toHaveBeenCalledWith('search', {
        query: 'diabetes',
        maxResults: 10,
        order: 'relevance',
        videoDuration: undefined,
      });
    });

    it('should return empty array on error', async () => {
      mockYoutube.mockResolvedValueOnce({
        data: null,
        error: { code: 'API_ERROR', message: 'YouTube API failed' },
      });

      const result = await YouTubeService.searchVideos({ query: 'test' });

      expect(result).toEqual([]);
    });

    it('should pass custom search parameters', async () => {
      mockYoutube.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      await YouTubeService.searchVideos({
        query: 'exercise',
        maxResults: 20,
        order: 'date',
        videoDuration: 'medium',
      });

      expect(mockYoutube).toHaveBeenCalledWith('search', {
        query: 'exercise',
        maxResults: 20,
        order: 'date',
        videoDuration: 'medium',
      });
    });

    it('should handle exceptions gracefully', async () => {
      mockYoutube.mockRejectedValueOnce(new Error('Network error'));

      const result = await YouTubeService.searchVideos({ query: 'test' });

      expect(result).toEqual([]);
    });
  });

  describe('getVideoDetails', () => {
    it('should return video details', async () => {
      const mockVideos: YouTubeVideo[] = [
        {
          id: 'xyz789',
          title: 'Detailed Video',
          description: 'Full description',
          thumbnail: 'https://example.com/thumb.jpg',
          channelTitle: 'Test Channel',
          publishedAt: '2024-01-01T00:00:00Z',
          duration: '15:00',
          viewCount: '500K',
          likeCount: '10K',
        },
      ];

      mockYoutube.mockResolvedValueOnce({
        data: mockVideos,
        error: null,
      });

      const result = await YouTubeService.getVideoDetails('xyz789');

      expect(result).toEqual(mockVideos);
      expect(mockYoutube).toHaveBeenCalledWith('details', {
        videoIds: 'xyz789',
      });
    });

    it('should return empty array on error', async () => {
      mockYoutube.mockResolvedValueOnce({
        data: null,
        error: { code: 'KEY_NOT_FOUND', message: 'Service unavailable' },
      });

      const result = await YouTubeService.getVideoDetails('invalid');

      expect(result).toEqual([]);
    });
  });

  describe('getHealthVideos', () => {
    it('should fetch diabetes videos', async () => {
      const mockVideos: YouTubeVideo[] = [
        {
          id: 'health1',
          title: 'Diabetes Education',
          description: 'Learn about diabetes',
          thumbnail: 'https://example.com/thumb.jpg',
          channelTitle: 'Health Edu',
          publishedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockYoutube.mockResolvedValueOnce({
        data: mockVideos,
        error: null,
      });

      const result = await YouTubeService.getHealthVideos('diabetes');

      expect(result).toEqual(mockVideos);
      expect(mockYoutube).toHaveBeenCalledWith('healthVideos', {
        category: 'diabetes',
        maxResults: 20,
      });
    });

    it('should fetch nutrition videos', async () => {
      mockYoutube.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      await YouTubeService.getHealthVideos('nutrition');

      expect(mockYoutube).toHaveBeenCalledWith('healthVideos', {
        category: 'nutrition',
        maxResults: 20,
      });
    });

    it('should return empty array on error', async () => {
      mockYoutube.mockResolvedValueOnce({
        data: null,
        error: { code: 'RATE_LIMITED', message: 'Quota exceeded' },
      });

      const result = await YouTubeService.getHealthVideos('exercise');

      expect(result).toEqual([]);
    });
  });

  describe('URL helpers', () => {
    it('should generate correct embed URL', () => {
      const url = YouTubeService.getEmbedUrl('abc123');
      expect(url).toBe('https://www.youtube.com/embed/abc123');
    });

    it('should generate correct watch URL', () => {
      const url = YouTubeService.getWatchUrl('xyz789');
      expect(url).toBe('https://www.youtube.com/watch?v=xyz789');
    });
  });
});
