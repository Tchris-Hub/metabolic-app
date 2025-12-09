/**
 * Unit Tests for SecureApiService
 * Tests error handling and response parsing for Edge Function calls
 * 
 * _Requirements: 5.2, 5.3_
 */

// Mock supabase before importing SecureApiService
jest.mock('../supabase/config', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

import { SecureApiService, CallServiceResponse } from '../config/SecureApiService';
import { supabase } from '../supabase/config';

const mockInvoke = supabase.functions.invoke as jest.MockedFunction<typeof supabase.functions.invoke>;

describe('SecureApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('callService', () => {
    it('should return data on successful response', async () => {
      const mockData: CallServiceResponse = {
        data: [{ id: '1', title: 'Test Video' }],
        error: null,
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.callService('youtube', 'search', { query: 'test' });

      expect(result.data).toEqual([{ id: '1', title: 'Test Video' }]);
      expect(result.error).toBeNull();
      expect(mockInvoke).toHaveBeenCalledWith('call-service', {
        body: {
          service: 'youtube',
          action: 'search',
          params: { query: 'test' },
        },
      });
    });

    it('should return error on Edge Function failure', async () => {
      mockInvoke.mockResolvedValueOnce({
        data: null,
        error: { message: 'Function not found' } as any,
      });

      const result = await SecureApiService.callService('youtube', 'search', { query: 'test' });

      expect(result.data).toBeNull();
      expect(result.error).not.toBeNull();
      expect(result.error?.code).toBe('NETWORK_ERROR');
    });

    it('should return error when response has error field', async () => {
      const mockData: CallServiceResponse = {
        data: null,
        error: { code: 'API_ERROR', message: 'YouTube API failed' },
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.callService('youtube', 'search', { query: 'test' });

      expect(result.data).toBeNull();
      expect(result.error?.code).toBe('API_ERROR');
      expect(result.error?.message).toBe('YouTube API failed');
    });

    it('should handle network exceptions', async () => {
      mockInvoke.mockRejectedValueOnce(new Error('Network timeout'));

      const result = await SecureApiService.callService('youtube', 'search', { query: 'test' });

      expect(result.data).toBeNull();
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toContain('Network timeout');
    });

    it('should handle empty response', async () => {
      mockInvoke.mockResolvedValueOnce({ data: null, error: null });

      const result = await SecureApiService.callService('youtube', 'search', { query: 'test' });

      expect(result.data).toBeNull();
      expect(result.error?.code).toBe('API_ERROR');
      expect(result.error?.message).toBe('No response from service');
    });
  });

  describe('youtube helper', () => {
    it('should call callService with youtube service', async () => {
      const mockData: CallServiceResponse = {
        data: [{ id: '1', title: 'Health Video' }],
        error: null,
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.youtube('search', { query: 'diabetes' });

      expect(mockInvoke).toHaveBeenCalledWith('call-service', {
        body: {
          service: 'youtube',
          action: 'search',
          params: { query: 'diabetes' },
        },
      });
      expect(result.data).toEqual([{ id: '1', title: 'Health Video' }]);
    });

    it('should handle healthVideos action', async () => {
      const mockData: CallServiceResponse = {
        data: [{ id: '2', title: 'Nutrition Guide' }],
        error: null,
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.youtube('healthVideos', { category: 'nutrition' });

      expect(mockInvoke).toHaveBeenCalledWith('call-service', {
        body: {
          service: 'youtube',
          action: 'healthVideos',
          params: { category: 'nutrition' },
        },
      });
    });
  });

  describe('spoonacular helper', () => {
    it('should call callService with spoonacular service', async () => {
      const mockData: CallServiceResponse = {
        data: [{ id: '100', name: 'Healthy Salad' }],
        error: null,
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.spoonacular('search', { query: 'salad' });

      expect(mockInvoke).toHaveBeenCalledWith('call-service', {
        body: {
          service: 'spoonacular',
          action: 'search',
          params: { query: 'salad' },
        },
      });
      expect(result.data).toEqual([{ id: '100', name: 'Healthy Salad' }]);
    });

    it('should handle random action', async () => {
      const mockData: CallServiceResponse = {
        data: [{ id: '200', name: 'Random Recipe' }],
        error: null,
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.spoonacular('random', { number: 5 });

      expect(mockInvoke).toHaveBeenCalledWith('call-service', {
        body: {
          service: 'spoonacular',
          action: 'random',
          params: { number: 5 },
        },
      });
    });

    it('should handle rate limiting error', async () => {
      const mockData: CallServiceResponse = {
        data: null,
        error: { code: 'RATE_LIMITED', message: 'Too many requests' },
      };

      mockInvoke.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await SecureApiService.spoonacular('search', { query: 'test' });

      expect(result.error?.code).toBe('RATE_LIMITED');
    });
  });
});
