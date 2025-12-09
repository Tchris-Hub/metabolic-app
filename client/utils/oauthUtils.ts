/**
 * OAuth utility functions for parsing callback URLs.
 * These are pure functions that can be tested without external dependencies.
 */

/**
 * Parses OAuth callback URL and extracts access_token and refresh_token
 * from either hash fragment or query parameters.
 * 
 * @param url - The OAuth callback URL to parse
 * @returns Object containing accessToken and refreshToken, or null if not found
 */
export function parseOAuthCallbackUrl(url: string): {
  accessToken: string;
  refreshToken: string;
} | null {
  if (!url) {
    return null;
  }

  let accessToken: string | null = null;
  let refreshToken: string | null = null;

  // Try to parse from hash fragment first (e.g., #access_token=xxx&refresh_token=yyy)
  const hashIndex = url.indexOf('#');
  if (hashIndex !== -1) {
    const hashFragment = url.substring(hashIndex + 1);
    const hashParams = new URLSearchParams(hashFragment);
    accessToken = hashParams.get('access_token');
    refreshToken = hashParams.get('refresh_token');
  }

  // If not found in hash, try query parameters
  if (!accessToken || !refreshToken) {
    const queryIndex = url.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = url.substring(queryIndex + 1);
      // Handle case where hash comes after query
      const cleanQuery = queryString.split('#')[0];
      const queryParams = new URLSearchParams(cleanQuery);
      accessToken = accessToken || queryParams.get('access_token');
      refreshToken = refreshToken || queryParams.get('refresh_token');
    }
  }

  // Return null if either token is missing
  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

/**
 * Checks if a URL is an OAuth callback URL.
 * 
 * @param url - The URL to check
 * @returns true if this is an auth callback URL
 */
export function isAuthCallbackUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('auth/callback') || 
         url.includes('access_token') || 
         url.includes('refresh_token');
}
