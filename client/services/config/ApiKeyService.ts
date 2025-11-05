/*
  ApiKeyService
  - Fetches and caches third-party API keys from Supabase table `api_keys`
  - Provides simple helpers to retrieve keys by service
  - Falls back to .env values if DB lookup fails (to avoid breaking dev/local)
*/

import { Platform } from 'react-native';
import { ApiKeysRepository } from '../supabase/repositories/settings/ApiKeysRepository';

// Key for AsyncStorage cache
const CACHE_PREFIX = 'mh_api_key:';

// Lazy import AsyncStorage only on native
let AsyncStorage: any = null;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Supported services and env fallbacks mapping
const ENV_FALLBACK: Record<string, string | undefined> = {
  SPOONACULAR: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY,
  YOUTUBE: process.env.EXPO_PUBLIC_YOUTUBE_API_KEY,
  STRIPE: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};

// In-memory cache for session
const memoryCache = new Map<string, string>();

export class ApiKeyService {
  static async get(service: 'SPOONACULAR' | 'YOUTUBE' | 'STRIPE', options?: { name?: string; forceRefresh?: boolean }): Promise<string | null> {
    const cacheKey = `${CACHE_PREFIX}${service}${options?.name ? ':' + options.name : ''}`;

    if (!options?.forceRefresh) {
      // Check in-memory first
      const mem = memoryCache.get(cacheKey);
      if (mem) return mem;

      // Check AsyncStorage on native
      if (AsyncStorage) {
        try {
          const val = await AsyncStorage.getItem(cacheKey);
          if (val) {
            memoryCache.set(cacheKey, val);
            return val;
          }
        } catch (e) {
          console.warn('[ApiKeyService] AsyncStorage get error:', (e as Error).message);
        }
      }
    }

    // Fetch from DB
    const record = options?.name
      ? await ApiKeysRepository.getKeyByName(service, options.name)
      : await ApiKeysRepository.getActiveKeyByService(service);

    const key = record?.key || null;

    if (!key) {
      // Fall back to env for compatibility
      const fallback = ENV_FALLBACK[service];
      if (fallback) {
        console.warn(`[ApiKeyService] No DB key for ${service}; using .env fallback`);
        this.setCache(cacheKey, fallback);
        return fallback;
      }
      console.error(`[ApiKeyService] No API key found for ${service}`);
      return null;
    }

    this.setCache(cacheKey, key);
    return key;
  }

  private static async setCache(cacheKey: string, value: string) {
    memoryCache.set(cacheKey, value);
    if (AsyncStorage) {
      try {
        await AsyncStorage.setItem(cacheKey, value);
      } catch (e) {
        console.warn('[ApiKeyService] AsyncStorage set error:', (e as Error).message);
      }
    }
  }
}
