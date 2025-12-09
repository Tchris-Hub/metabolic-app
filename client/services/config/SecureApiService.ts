/**
 * SecureApiService
 * 
 * Client-side service that calls Supabase Edge Functions to access external APIs.
 * API keys are never exposed to the client - all external API calls are proxied
 * through the Edge Function which handles key retrieval and decryption server-side.
 * 
 * _Requirements: 1.3, 5.3_
 */

import { supabase } from '../supabase/config';

// Types matching the Edge Function interface
export type ServiceType = 'youtube' | 'spoonacular';

export type YouTubeAction = 'search' | 'details' | 'healthVideos';
export type SpoonacularAction = 'search' | 'details' | 'random';

export interface CallServiceRequest {
  service: ServiceType;
  action: string;
  params: Record<string, any>;
}

export interface CallServiceResponse<T = any> {
  data: T | null;
  error: {
    code: 'INVALID_SERVICE' | 'INVALID_PARAMS' | 'API_ERROR' | 'RATE_LIMITED' | 'KEY_NOT_FOUND' | 'NETWORK_ERROR';
    message: string;
  } | null;
}

export class SecureApiService {
  /**
   * Call an external API service through the Edge Function proxy
   * 
   * @param service - The service to call ('youtube' or 'spoonacular')
   * @param action - The action to perform (e.g., 'search', 'details', 'random')
   * @param params - Parameters for the API call
   * @returns Response with data or error
   */
  static async callService<T = any>(
    service: ServiceType,
    action: string,
    params: Record<string, any> = {}
  ): Promise<CallServiceResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke<CallServiceResponse<T>>('call-service', {
        body: {
          service,
          action,
          params,
        },
      });

      if (error) {
        console.error('[SecureApiService] Edge Function error:', error);
        return {
          data: null,
          error: {
            code: 'NETWORK_ERROR',
            message: error.message || 'Failed to connect to service',
          },
        };
      }

      // The Edge Function returns the response directly
      if (data) {
        return data;
      }

      return {
        data: null,
        error: {
          code: 'API_ERROR',
          message: 'No response from service',
        },
      };
    } catch (e) {
      console.error('[SecureApiService] Unexpected error:', e);
      return {
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: (e as Error).message || 'Network error occurred',
        },
      };
    }
  }

  /**
   * Call YouTube API through Edge Function
   */
  static async youtube<T = any>(
    action: YouTubeAction,
    params: Record<string, any> = {}
  ): Promise<CallServiceResponse<T>> {
    return this.callService<T>('youtube', action, params);
  }

  /**
   * Call Spoonacular API through Edge Function
   */
  static async spoonacular<T = any>(
    action: SpoonacularAction,
    params: Record<string, any> = {}
  ): Promise<CallServiceResponse<T>> {
    return this.callService<T>('spoonacular', action, params);
  }
}
