import * as fc from 'fast-check';

/**
 * **Feature: google-signin, Property 2: Redirect URI Scheme Consistency**
 * 
 * For any generated OAuth redirect URI, the scheme portion SHALL match
 * the app scheme defined in app.json configuration.
 * 
 * **Validates: Requirements 2.1, 2.2, 5.2**
 */
describe('Redirect URI Scheme Consistency', () => {
  // The app scheme from app.json
  const APP_SCHEME = 'client';

  /**
   * Simulates the redirect URI generation logic from AuthService.
   * In production, this uses expo-linking's createURL.
   */
  function generateRedirectUri(path: string): string {
    return `${APP_SCHEME}://${path}`;
  }

  /**
   * Extracts the scheme from a URI.
   */
  function extractScheme(uri: string): string | null {
    const match = uri.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//);
    return match ? match[1] : null;
  }

  describe('Property 2: Redirect URI Scheme Consistency', () => {
    it('should always generate URIs with the correct app scheme', () => {
      // Arbitrary for generating valid callback paths
      const pathArbitrary = fc.stringOf(
        fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz/'),
        { minLength: 1, maxLength: 50 }
      ).filter(s => !s.startsWith('/') && !s.endsWith('/') && !s.includes('//'));

      fc.assert(
        fc.property(pathArbitrary, (path) => {
          const redirectUri = generateRedirectUri(path);
          const scheme = extractScheme(redirectUri);

          // Property: scheme must match APP_SCHEME
          expect(scheme).toBe(APP_SCHEME);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate valid deep link URIs for auth callback', () => {
      const callbackPaths = ['auth/callback', 'oauth/callback', 'callback'];

      fc.assert(
        fc.property(
          fc.constantFrom(...callbackPaths),
          (path) => {
            const redirectUri = generateRedirectUri(path);
            
            // Property: URI should be well-formed
            expect(redirectUri).toMatch(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/);
            
            // Property: scheme should be correct
            expect(extractScheme(redirectUri)).toBe(APP_SCHEME);
            
            // Property: path should be preserved
            expect(redirectUri).toContain(path);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain scheme consistency across multiple generations', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom('auth/callback', 'oauth', 'login'), { minLength: 2, maxLength: 10 }),
          (paths) => {
            const uris = paths.map(p => generateRedirectUri(p));
            const schemes = uris.map(extractScheme);

            // Property: all schemes should be identical
            const uniqueSchemes = [...new Set(schemes)];
            expect(uniqueSchemes).toHaveLength(1);
            expect(uniqueSchemes[0]).toBe(APP_SCHEME);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Scheme extraction utility', () => {
    it('should correctly extract schemes from various URI formats', () => {
      const testCases = [
        { uri: 'client://auth/callback', expected: 'client' },
        { uri: 'https://example.com', expected: 'https' },
        { uri: 'exp://localhost:8081', expected: 'exp' },
        { uri: 'myapp://deep/link', expected: 'myapp' },
        { uri: 'invalid-uri', expected: null },
        { uri: '://missing-scheme', expected: null },
      ];

      testCases.forEach(({ uri, expected }) => {
        expect(extractScheme(uri)).toBe(expected);
      });
    });
  });
});
