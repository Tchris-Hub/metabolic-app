import { createClient } from '@supabase/supabase-js';

// Detect React Native runtime explicitly (not just absence of window)
const isReactNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

let storage: any | undefined;
if (isReactNative) {
  // Only load AsyncStorage on actual React Native runtime.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default;
} else if (typeof window !== 'undefined' && window?.localStorage) {
  // Use localStorage on the web when available.
  storage = window.localStorage;
} else {
  // Fallback no-op storage for SSR/static export builds.
  storage = {
    getItem: async (_key: string) => null,
    setItem: async (_key: string, _value: string) => {},
    removeItem: async (_key: string) => {},
  };
}

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create Supabase client
// - On native, use AsyncStorage for session persistence
// - On web/SSR, omit storage so supabase-js uses a safe default (in-memory/localStorage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export URL and key for reference (if needed)
export { supabaseUrl, supabaseAnonKey };
