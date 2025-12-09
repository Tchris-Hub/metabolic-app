import * as fc from 'fast-check';
import { parseOAuthCallbackUrl, isAuthCallbackUrl } from '../../utils/oauthUtils';

/**
 * **Feature: google-signin, Property 1: OAuth Callback URL Parsing**
 * 
 * For any valid OAuth callback URL containing access_token and refresh_token parameters,
 * parsing the URL SHALL extract both tokens correctly and they SHALL be non-empty strings.
 * 
 * **Validates: Requirements 1.2, 2.3**
 */
describe('OAuth Callback URL Parsing', () => {
  // Arbitrary for generating valid JWT-like tokens (alphanumeric with dots)
  const tokenArbitrary = fc.stringOf(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'),
    { minLength: 10, maxLength: 100 }
  );

  // Arbitrary for generating valid URL schemes
  const schemeArbitrary = fc.constantFrom('client', 'myapp', 'exp', 'https');

  // Arbitrary for generating valid callback paths
  const pathArbitrary = fc.constantFrom('auth/callback', 'callback', 'oauth/callback');

  describe('Property 1: OAuth Callback URL Parsing', () => {
    it('should extract both tokens from hash fragment URLs', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          pathArbitrary,
          tokenArbitrary,
          tokenArbitrary,
          (scheme, path, accessToken, refreshToken) => {
            // Ensure tokens are non-empty
            fc.pre(accessToken.length > 0 && refreshToken.length > 0);

            const url = `${scheme}://${path}#access_token=${accessToken}&refresh_token=${refreshToken}&token_type=bearer`;
            const result = parseOAuthCallbackUrl(url);

            // Property: parsing should succeed and extract correct tokens
            expect(result).not.toBeNull();
            expect(result?.accessToken).toBe(accessToken);
            expect(result?.refreshToken).toBe(refreshToken);
            expect(result?.accessToken.length).toBeGreaterThan(0);
            expect(result?.refreshToken.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract both tokens from query parameter URLs', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          pathArbitrary,
          tokenArbitrary,
          tokenArbitrary,
          (scheme, path, accessToken, refreshToken) => {
            fc.pre(accessToken.length > 0 && refreshToken.length > 0);

            const url = `${scheme}://${path}?access_token=${accessToken}&refresh_token=${refreshToken}&token_type=bearer`;
            const result = parseOAuthCallbackUrl(url);

            expect(result).not.toBeNull();
            expect(result?.accessToken).toBe(accessToken);
            expect(result?.refreshToken).toBe(refreshToken);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null when access_token is missing', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          pathArbitrary,
          tokenArbitrary,
          (scheme, path, refreshToken) => {
            const url = `${scheme}://${path}#refresh_token=${refreshToken}`;
            const result = parseOAuthCallbackUrl(url);

            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null when refresh_token is missing', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          pathArbitrary,
          tokenArbitrary,
          (scheme, path, accessToken) => {
            const url = `${scheme}://${path}#access_token=${accessToken}`;
            const result = parseOAuthCallbackUrl(url);

            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null for URLs without parameters', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          pathArbitrary,
          (scheme, path) => {
            const url = `${scheme}://${path}`;
            const result = parseOAuthCallbackUrl(url);

            expect(result).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('isAuthCallbackUrl', () => {
    it('should identify auth callback URLs correctly', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          tokenArbitrary,
          tokenArbitrary,
          (scheme, accessToken, refreshToken) => {
            // URLs with auth/callback path
            expect(isAuthCallbackUrl(`${scheme}://auth/callback`)).toBe(true);
            
            // URLs with access_token
            expect(isAuthCallbackUrl(`${scheme}://callback#access_token=${accessToken}`)).toBe(true);
            
            // URLs with refresh_token
            expect(isAuthCallbackUrl(`${scheme}://callback#refresh_token=${refreshToken}`)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return false for non-auth URLs', () => {
      fc.assert(
        fc.property(
          schemeArbitrary,
          fc.constantFrom('home', 'profile', 'settings', 'login'),
          (scheme, path) => {
            const url = `${scheme}://${path}`;
            expect(isAuthCallbackUrl(url)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
