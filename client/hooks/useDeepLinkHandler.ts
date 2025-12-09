import { useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { AuthService } from '../services/supabase/auth';
import { isAuthCallbackUrl } from '../utils/oauthUtils';

// Re-export for convenience
export { parseOAuthCallbackUrl, isAuthCallbackUrl } from '../utils/oauthUtils';

/**
 * Hook that listens for incoming deep links and handles OAuth callbacks.
 * Should be initialized in the root layout component.
 * 
 * Requirements: 2.1, 2.2, 2.3
 */
export function useDeepLinkHandler(): void {
  const handleUrl = useCallback(async (url: string) => {
    if (!url) return;

    // Check if this is an OAuth callback URL
    if (url.includes('auth/callback') || url.includes('access_token')) {
      try {
        const result = await AuthService.handleOAuthCallback(url);
        if (!result.success && result.error) {
          console.error('OAuth callback handling failed:', result.error);
        }
      } catch (error) {
        console.error('Error handling OAuth callback:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Handle URL that opened the app (initial URL)
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleUrl(initialUrl);
      }
    };

    handleInitialUrl();

    // Subscribe to URL events while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleUrl]);
}
