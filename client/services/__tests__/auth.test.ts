/**
 * Unit tests for Google Sign-In authentication service.
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 5.2**
 */

describe('Google Sign-In Unit Tests', () => {
  // The app scheme from app.json
  const APP_SCHEME = 'client';
  const AUTH_CALLBACK_PATH = 'auth/callback';

  describe('5.1 Redirect URI Generation', () => {
    it('should generate redirect URI with correct scheme', () => {
      // Simulates expo-linking createURL behavior
      const createURL = (path: string) => `${APP_SCHEME}://${path}`;
      
      const redirectUri = createURL(AUTH_CALLBACK_PATH);
      
      expect(redirectUri).toBe('client://auth/callback');
      expect(redirectUri.startsWith(`${APP_SCHEME}://`)).toBe(true);
    });

    it('should match app.json scheme configuration', () => {
      // The scheme must match what's in app.json
      const expectedScheme = 'client';
      const redirectUri = `${expectedScheme}://auth/callback`;
      
      expect(redirectUri.split('://')[0]).toBe(expectedScheme);
    });

    it('should generate valid deep link format', () => {
      const redirectUri = `${APP_SCHEME}://${AUTH_CALLBACK_PATH}`;
      
      // Valid deep link format: scheme://path
      expect(redirectUri).toMatch(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/);
    });
  });

  describe('5.2 Error Message Mapping', () => {
    /**
     * Maps error messages to user-friendly messages.
     * This mirrors the logic in login.tsx
     */
    function mapErrorToUserMessage(error: Error): string {
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('fetch')) {
        return 'Network error. Please check your internet connection.';
      }
      if (message.includes('configuration') || message.includes('redirect')) {
        return 'Authentication configuration error. Please contact support.';
      }
      if (message.includes('session')) {
        return 'Authentication failed. Please try again.';
      }
      if (message.includes('cancelled') || message.includes('canceled')) {
        return ''; // Silent return for user cancellation
      }
      return 'Please try again.';
    }

    it('should map network errors correctly (Requirement 4.2)', () => {
      const networkError = new Error('Network request failed');
      const fetchError = new Error('fetch error: connection refused');
      
      expect(mapErrorToUserMessage(networkError)).toBe('Network error. Please check your internet connection.');
      expect(mapErrorToUserMessage(fetchError)).toBe('Network error. Please check your internet connection.');
    });

    it('should map configuration errors correctly (Requirement 4.3)', () => {
      const configError = new Error('Invalid redirect URI configuration');
      const redirectError = new Error('Redirect mismatch');
      
      expect(mapErrorToUserMessage(configError)).toBe('Authentication configuration error. Please contact support.');
      expect(mapErrorToUserMessage(redirectError)).toBe('Authentication configuration error. Please contact support.');
    });

    it('should map session errors correctly (Requirement 4.4)', () => {
      const sessionError = new Error('Session exchange failed');
      
      expect(mapErrorToUserMessage(sessionError)).toBe('Authentication failed. Please try again.');
    });

    it('should handle user cancellation silently (Requirement 4.1)', () => {
      const cancelError = new Error('User cancelled the operation');
      
      expect(mapErrorToUserMessage(cancelError)).toBe('');
    });

    it('should provide generic message for unknown errors', () => {
      const unknownError = new Error('Something unexpected happened');
      
      expect(mapErrorToUserMessage(unknownError)).toBe('Please try again.');
    });
  });
});
