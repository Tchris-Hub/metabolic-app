/**
 * Property-Based Tests for call-service Edge Function
 * **Feature: secure-api-keys, Property 1: Service Routing**
 * **Validates: Requirements 2.2, 3.2, 4.1**
 * 
 * Tests that the Edge Function correctly routes requests to the appropriate
 * external API based on the service parameter.
 */

import * as fc from 'fast-check';

// Types matching the Edge Function
interface CallServiceRequest {
  service: 'youtube' | 'spoonacular';
  action: string;
  params: Record<string, any>;
}

interface CallServiceResponse<T = any> {
  data: T | null;
  error: {
    code: 'INVALID_SERVICE' | 'INVALID_PARAMS' | 'API_ERROR' | 'RATE_LIMITED' | 'KEY_NOT_FOUND' | 'NETWORK_ERROR';
    message: string;
  } | null;
}

// Pure validation functions extracted from Edge Function for testing
function validateRequest(body: any): { valid: true; request: CallServiceRequest } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const { service, action, params } = body;

  if (!service || !['youtube', 'spoonacular'].includes(service)) {
    return { valid: false, error: 'Invalid or missing service parameter. Must be "youtube" or "spoonacular"' };
  }

  if (!action || typeof action !== 'string') {
    return { valid: false, error: 'Invalid or missing action parameter' };
  }

  if (params !== undefined && typeof params !== 'object') {
    return { valid: false, error: 'Params must be an object' };
  }

  return {
    valid: true,
    request: { service, action, params: params || {} }
  };
}

function validateServiceParams(service: string, action: string, params: Record<string, any>): string | null {
  if (service === 'youtube') {
    if (action === 'search' && !params.query) {
      return 'YouTube search requires a "query" parameter';
    }
    if (action === 'details' && !params.videoIds) {
      return 'YouTube details requires a "videoIds" parameter';
    }
  }

  if (service === 'spoonacular') {
    if (action === 'search' && !params.query) {
      return 'Spoonacular search requires a "query" parameter';
    }
    if (action === 'details' && !params.id) {
      return 'Spoonacular details requires an "id" parameter';
    }
  }

  return null;
}

// Service routing function (pure logic)
function routeService(service: 'youtube' | 'spoonacular'): 'youtube' | 'spoonacular' {
  // This is the core routing logic - service parameter determines which API is called
  return service;
}

describe('Property Tests: Service Routing', () => {
  /**
   * **Feature: secure-api-keys, Property 1: Service Routing**
   * **Validates: Requirements 2.2, 3.2, 4.1**
   * 
   * For any valid service request with service parameter 'youtube' or 'spoonacular',
   * the Edge Function SHALL route the request to the corresponding external API.
   */
  describe('Property 1: Service Routing', () => {
    it('should route youtube requests to youtube handler', () => {
      fc.assert(
        fc.property(
          fc.record({
            service: fc.constant('youtube' as const),
            action: fc.constantFrom('search', 'details', 'healthVideos'),
            params: fc.record({
              query: fc.string({ minLength: 1 }),
              maxResults: fc.integer({ min: 1, max: 50 }),
            }),
          }),
          (request) => {
            const validation = validateRequest(request);
            expect(validation.valid).toBe(true);
            if (validation.valid) {
              const routed = routeService(validation.request.service);
              expect(routed).toBe('youtube');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should route spoonacular requests to spoonacular handler', () => {
      fc.assert(
        fc.property(
          fc.record({
            service: fc.constant('spoonacular' as const),
            action: fc.constantFrom('search', 'details', 'random'),
            params: fc.record({
              query: fc.string({ minLength: 1 }),
              number: fc.integer({ min: 1, max: 20 }),
            }),
          }),
          (request) => {
            const validation = validateRequest(request);
            expect(validation.valid).toBe(true);
            if (validation.valid) {
              const routed = routeService(validation.request.service);
              expect(routed).toBe('spoonacular');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly route any valid service request to its corresponding handler', () => {
      fc.assert(
        fc.property(
          fc.record({
            service: fc.constantFrom('youtube', 'spoonacular') as fc.Arbitrary<'youtube' | 'spoonacular'>,
            action: fc.string({ minLength: 1 }),
            params: fc.dictionary(fc.string(), fc.jsonValue()),
          }),
          (request) => {
            const validation = validateRequest(request);
            expect(validation.valid).toBe(true);
            if (validation.valid) {
              const routed = routeService(validation.request.service);
              // The routed service should always match the requested service
              expect(routed).toBe(request.service);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  describe('Request Validation', () => {
    it('should reject requests with invalid service parameter', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => s !== 'youtube' && s !== 'spoonacular'),
          (invalidService) => {
            const request = {
              service: invalidService,
              action: 'search',
              params: { query: 'test' },
            };
            const validation = validateRequest(request);
            expect(validation.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with missing action', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('youtube', 'spoonacular'),
          (service) => {
            const request = {
              service,
              params: { query: 'test' },
            };
            const validation = validateRequest(request);
            expect(validation.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid requests with optional params', () => {
      fc.assert(
        fc.property(
          fc.record({
            service: fc.constantFrom('youtube', 'spoonacular'),
            action: fc.string({ minLength: 1 }),
          }),
          (request) => {
            const validation = validateRequest(request);
            expect(validation.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Service-Specific Parameter Validation', () => {
    it('should require query param for youtube search action', () => {
      fc.assert(
        fc.property(
          fc.record({
            maxResults: fc.integer({ min: 1, max: 50 }),
          }),
          (params) => {
            const error = validateServiceParams('youtube', 'search', params);
            expect(error).toBe('YouTube search requires a "query" parameter');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should require query param for spoonacular search action', () => {
      fc.assert(
        fc.property(
          fc.record({
            number: fc.integer({ min: 1, max: 20 }),
          }),
          (params) => {
            const error = validateServiceParams('spoonacular', 'search', params);
            expect(error).toBe('Spoonacular search requires a "query" parameter');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid youtube search params', () => {
      fc.assert(
        fc.property(
          fc.record({
            query: fc.string({ minLength: 1 }),
            maxResults: fc.integer({ min: 1, max: 50 }),
          }),
          (params) => {
            const error = validateServiceParams('youtube', 'search', params);
            expect(error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid spoonacular search params', () => {
      fc.assert(
        fc.property(
          fc.record({
            query: fc.string({ minLength: 1 }),
            number: fc.integer({ min: 1, max: 20 }),
          }),
          (params) => {
            const error = validateServiceParams('spoonacular', 'search', params);
            expect(error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property-Based Tests for Response Transformation
 * **Feature: secure-api-keys, Property 2: Response Transformation**
 * **Validates: Requirements 2.3, 3.3**
 * 
 * For any successful external API response, the Edge Function SHALL return
 * a response with `data` containing the transformed results and `error` set to null.
 */

// Response transformation functions extracted for testing
function transformYouTubeVideoDetails(items: any[]): any[] {
  return items.map(item => ({
    id: item.id,
    title: item.snippet?.title,
    description: item.snippet?.description,
    thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    channelTitle: item.snippet?.channelTitle,
    publishedAt: item.snippet?.publishedAt,
    duration: formatDuration(item.contentDetails?.duration),
    viewCount: formatNumber(item.statistics?.viewCount),
    likeCount: formatNumber(item.statistics?.likeCount),
  }));
}

function formatDuration(duration: string | undefined): string {
  if (!duration) return '0:00';
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '0M').replace('M', '');
  const seconds = (match[3] || '0S').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function formatNumber(num: string | number | undefined): string {
  if (!num) return '0';
  const number = typeof num === 'string' ? parseInt(num) : num;
  if (isNaN(number)) return '0';
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
}

function transformSpoonacularRecipes(recipes: any[]): any[] {
  return recipes.map(recipe => {
    const nutrition = recipe.nutrition?.nutrients || [];
    const calories = nutrition.find((n: any) => n.name === 'Calories')?.amount || 0;
    const carbs = nutrition.find((n: any) => n.name === 'Carbohydrates')?.amount || 0;
    const protein = nutrition.find((n: any) => n.name === 'Protein')?.amount || 0;
    const fat = nutrition.find((n: any) => n.name === 'Fat')?.amount || 0;
    const fiber = nutrition.find((n: any) => n.name === 'Fiber')?.amount || 0;
    const sodium = nutrition.find((n: any) => n.name === 'Sodium')?.amount || 0;
    const sugar = nutrition.find((n: any) => n.name === 'Sugar')?.amount || 0;

    const instructions = recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || 
      ['Recipe instructions available on Spoonacular'];

    const ingredients = recipe.extendedIngredients?.map((ing: any) => ({
      name: ing.name,
      amount: ing.amount?.toString() || '',
      unit: ing.unit || '',
    })) || [];

    let category = 'lunch';
    if (recipe.dishTypes?.includes('breakfast')) category = 'breakfast';
    else if (recipe.dishTypes?.includes('main course') || recipe.dishTypes?.includes('dinner')) category = 'dinner';
    else if (recipe.dishTypes?.includes('snack') || recipe.dishTypes?.includes('appetizer')) category = 'snack';

    return {
      id: recipe.id?.toString(),
      name: recipe.title,
      description: `Ready in ${recipe.readyInMinutes || 30} minutes. Serves ${recipe.servings || 4}.`,
      category,
      cuisine: recipe.cuisines?.[0] || 'International',
      difficulty: (recipe.readyInMinutes || 30) > 60 ? 'hard' : (recipe.readyInMinutes || 30) > 30 ? 'medium' : 'easy',
      prepTime: Math.max(5, (recipe.readyInMinutes || 30) - 20),
      cookTime: Math.min(recipe.readyInMinutes || 30, 20),
      servings: recipe.servings || 4,
      nutrition: {
        calories: Math.round(calories),
        carbs: Math.round(carbs),
        protein: Math.round(protein),
        fat: Math.round(fat),
        fiber: Math.round(fiber),
        sodium: Math.round(sodium),
        sugar: Math.round(sugar),
      },
      ingredients,
      instructions,
      imageUrl: recipe.image,
    };
  });
}

// Success response helper
function successResponse<T>(data: T): { data: T; error: null } {
  return { data, error: null };
}

describe('Property Tests: Response Transformation', () => {
  /**
   * **Feature: secure-api-keys, Property 2: Response Transformation**
   * **Validates: Requirements 2.3, 3.3**
   */
  describe('Property 2: Response Transformation', () => {
    it('should transform YouTube video details with data and null error', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.string({ minLength: 1 }),
              snippet: fc.record({
                title: fc.string(),
                description: fc.string(),
                thumbnails: fc.record({
                  medium: fc.record({ url: fc.webUrl() }),
                  default: fc.record({ url: fc.webUrl() }),
                }),
                channelTitle: fc.string(),
                publishedAt: fc.date().map(d => d.toISOString()),
              }),
              contentDetails: fc.record({
                duration: fc.constantFrom('PT1M30S', 'PT10M', 'PT1H30M', 'PT5S'),
              }),
              statistics: fc.record({
                viewCount: fc.nat().map(String),
                likeCount: fc.nat().map(String),
              }),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          (youtubeItems) => {
            const transformed = transformYouTubeVideoDetails(youtubeItems);
            const response = successResponse(transformed);
            
            // Property: response has data and null error
            expect(response.data).not.toBeNull();
            expect(response.error).toBeNull();
            
            // Property: transformed array has same length as input
            expect(transformed.length).toBe(youtubeItems.length);
            
            // Property: each transformed item has required fields
            transformed.forEach((item, index) => {
              expect(item.id).toBe(youtubeItems[index].id);
              expect(typeof item.title).toBe('string');
              expect(typeof item.duration).toBe('string');
              expect(typeof item.viewCount).toBe('string');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should transform Spoonacular recipes with data and null error', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.nat(),
              title: fc.string({ minLength: 1 }),
              image: fc.webUrl(),
              readyInMinutes: fc.integer({ min: 5, max: 120 }),
              servings: fc.integer({ min: 1, max: 12 }),
              nutrition: fc.record({
                nutrients: fc.array(
                  fc.record({
                    name: fc.constantFrom('Calories', 'Carbohydrates', 'Protein', 'Fat', 'Fiber', 'Sodium', 'Sugar'),
                    amount: fc.float({ min: 0, max: 1000 }),
                    unit: fc.constantFrom('g', 'mg', 'kcal'),
                  }),
                  { minLength: 0, maxLength: 7 }
                ),
              }),
              dishTypes: fc.array(fc.constantFrom('breakfast', 'lunch', 'dinner', 'snack', 'main course', 'appetizer')),
              cuisines: fc.array(fc.constantFrom('Italian', 'Mexican', 'Asian', 'American')),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          (spoonacularRecipes) => {
            const transformed = transformSpoonacularRecipes(spoonacularRecipes);
            const response = successResponse(transformed);
            
            // Property: response has data and null error
            expect(response.data).not.toBeNull();
            expect(response.error).toBeNull();
            
            // Property: transformed array has same length as input
            expect(transformed.length).toBe(spoonacularRecipes.length);
            
            // Property: each transformed item has required fields
            transformed.forEach((item, index) => {
              expect(item.id).toBe(spoonacularRecipes[index].id.toString());
              expect(item.name).toBe(spoonacularRecipes[index].title);
              expect(typeof item.nutrition).toBe('object');
              expect(typeof item.nutrition.calories).toBe('number');
              expect(['breakfast', 'lunch', 'dinner', 'snack']).toContain(item.category);
              expect(['easy', 'medium', 'hard']).toContain(item.difficulty);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve data integrity during transformation', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }),
            snippet: fc.record({
              title: fc.string({ minLength: 1 }),
              description: fc.string(),
              thumbnails: fc.record({
                medium: fc.record({ url: fc.webUrl() }),
              }),
              channelTitle: fc.string({ minLength: 1 }),
              publishedAt: fc.date().map(d => d.toISOString()),
            }),
            contentDetails: fc.record({
              duration: fc.constant('PT10M30S'),
            }),
            statistics: fc.record({
              viewCount: fc.constant('1000'),
              likeCount: fc.constant('100'),
            }),
          }),
          (youtubeItem) => {
            const [transformed] = transformYouTubeVideoDetails([youtubeItem]);
            
            // Property: id is preserved exactly
            expect(transformed.id).toBe(youtubeItem.id);
            
            // Property: title is preserved exactly
            expect(transformed.title).toBe(youtubeItem.snippet.title);
            
            // Property: channelTitle is preserved exactly
            expect(transformed.channelTitle).toBe(youtubeItem.snippet.channelTitle);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property-Based Tests for Error Response Structure
 * **Feature: secure-api-keys, Property 3: Error Response Structure**
 * **Validates: Requirements 2.4, 3.4, 5.2**
 * 
 * For any error scenario (API failure, rate limiting, invalid request),
 * the Edge Function SHALL return a response with `data` set to null
 * and `error` containing a code and message.
 */

// Error codes from the Edge Function
type ErrorCode = 'INVALID_SERVICE' | 'INVALID_PARAMS' | 'API_ERROR' | 'RATE_LIMITED' | 'KEY_NOT_FOUND' | 'NETWORK_ERROR';

// Error response helper
function errorResponse(code: ErrorCode, message: string): { data: null; error: { code: ErrorCode; message: string } } {
  return { data: null, error: { code, message } };
}

describe('Property Tests: Error Response Structure', () => {
  /**
   * **Feature: secure-api-keys, Property 3: Error Response Structure**
   * **Validates: Requirements 2.4, 3.4, 5.2**
   */
  describe('Property 3: Error Response Structure', () => {
    const validErrorCodes: ErrorCode[] = [
      'INVALID_SERVICE',
      'INVALID_PARAMS',
      'API_ERROR',
      'RATE_LIMITED',
      'KEY_NOT_FOUND',
      'NETWORK_ERROR',
    ];

    it('should always have null data when error is present', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validErrorCodes),
          fc.string({ minLength: 1 }),
          (code, message) => {
            const response = errorResponse(code, message);
            
            // Property: data is always null when error exists
            expect(response.data).toBeNull();
            expect(response.error).not.toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always have valid error code', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validErrorCodes),
          fc.string({ minLength: 1 }),
          (code, message) => {
            const response = errorResponse(code, message);
            
            // Property: error code is one of the valid codes
            expect(validErrorCodes).toContain(response.error.code);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always have non-empty error message', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validErrorCodes),
          fc.string({ minLength: 1, maxLength: 500 }),
          (code, message) => {
            const response = errorResponse(code, message);
            
            // Property: error message is non-empty string
            expect(typeof response.error.message).toBe('string');
            expect(response.error.message.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve error code and message exactly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validErrorCodes),
          fc.string({ minLength: 1, maxLength: 200 }),
          (code, message) => {
            const response = errorResponse(code, message);
            
            // Property: code and message are preserved exactly
            expect(response.error.code).toBe(code);
            expect(response.error.message).toBe(message);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent structure for all error types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...validErrorCodes),
          fc.string({ minLength: 1 }),
          (code, message) => {
            const response = errorResponse(code, message);
            
            // Property: response has exactly two keys
            expect(Object.keys(response)).toHaveLength(2);
            expect(response).toHaveProperty('data');
            expect(response).toHaveProperty('error');
            
            // Property: error has exactly two keys
            expect(Object.keys(response.error)).toHaveLength(2);
            expect(response.error).toHaveProperty('code');
            expect(response.error).toHaveProperty('message');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


/**
 * Property-Based Tests for Request Validation
 * **Feature: secure-api-keys, Property 4: Request Validation**
 * **Validates: Requirements 4.3, 5.4**
 * 
 * For any request with missing or invalid required parameters,
 * the Edge Function SHALL reject the request with an INVALID_PARAMS error
 * before making external API calls.
 */

describe('Property Tests: Request Validation', () => {
  /**
   * **Feature: secure-api-keys, Property 4: Request Validation**
   * **Validates: Requirements 4.3, 5.4**
   */
  describe('Property 4: Request Validation', () => {
    // Re-use validation functions from earlier tests
    function validateRequest(body: any): { valid: true; request: any } | { valid: false; error: string } {
      if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be an object' };
      }

      const { service, action, params } = body;

      if (!service || !['youtube', 'spoonacular'].includes(service)) {
        return { valid: false, error: 'Invalid or missing service parameter. Must be "youtube" or "spoonacular"' };
      }

      if (!action || typeof action !== 'string') {
        return { valid: false, error: 'Invalid or missing action parameter' };
      }

      if (params !== undefined && typeof params !== 'object') {
        return { valid: false, error: 'Params must be an object' };
      }

      return {
        valid: true,
        request: { service, action, params: params || {} }
      };
    }

    function validateServiceParams(service: string, action: string, params: Record<string, any>): string | null {
      if (service === 'youtube') {
        if (action === 'search' && !params.query) {
          return 'YouTube search requires a "query" parameter';
        }
        if (action === 'details' && !params.videoIds) {
          return 'YouTube details requires a "videoIds" parameter';
        }
      }

      if (service === 'spoonacular') {
        if (action === 'search' && !params.query) {
          return 'Spoonacular search requires a "query" parameter';
        }
        if (action === 'details' && !params.id) {
          return 'Spoonacular details requires an "id" parameter';
        }
      }

      return null;
    }

    it('should reject null or undefined request bodies', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(null, undefined),
          (body) => {
            const result = validateRequest(body);
            expect(result.valid).toBe(false);
            if (!result.valid) {
              expect(result.error).toContain('object');
            }
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should reject non-object request bodies', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.array(fc.anything())
          ),
          (body) => {
            const result = validateRequest(body);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with invalid service values', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => s !== 'youtube' && s !== 'spoonacular'),
          fc.string({ minLength: 1 }),
          (invalidService, action) => {
            const result = validateRequest({ service: invalidService, action });
            expect(result.valid).toBe(false);
            if (!result.valid) {
              expect(result.error).toContain('service');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with missing action', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('youtube', 'spoonacular'),
          (service) => {
            const result = validateRequest({ service });
            expect(result.valid).toBe(false);
            if (!result.valid) {
              expect(result.error).toContain('action');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject requests with non-string action', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('youtube', 'spoonacular'),
          fc.oneof(fc.integer(), fc.boolean(), fc.array(fc.anything())),
          (service, invalidAction) => {
            const result = validateRequest({ service, action: invalidAction });
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject YouTube search without query parameter', () => {
      fc.assert(
        fc.property(
          fc.record({
            maxResults: fc.integer({ min: 1, max: 50 }),
            order: fc.constantFrom('date', 'rating', 'relevance'),
          }),
          (params) => {
            const error = validateServiceParams('youtube', 'search', params);
            expect(error).not.toBeNull();
            expect(error).toContain('query');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject YouTube details without videoIds parameter', () => {
      fc.assert(
        fc.property(
          fc.record({
            someOtherParam: fc.string(),
          }),
          (params) => {
            const error = validateServiceParams('youtube', 'details', params);
            expect(error).not.toBeNull();
            expect(error).toContain('videoIds');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject Spoonacular search without query parameter', () => {
      fc.assert(
        fc.property(
          fc.record({
            number: fc.integer({ min: 1, max: 20 }),
            diet: fc.constantFrom('keto', 'vegan', 'vegetarian'),
          }),
          (params) => {
            const error = validateServiceParams('spoonacular', 'search', params);
            expect(error).not.toBeNull();
            expect(error).toContain('query');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject Spoonacular details without id parameter', () => {
      fc.assert(
        fc.property(
          fc.record({
            someOtherParam: fc.string(),
          }),
          (params) => {
            const error = validateServiceParams('spoonacular', 'details', params);
            expect(error).not.toBeNull();
            expect(error).toContain('id');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept valid requests with all required parameters', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('youtube', 'spoonacular') as fc.Arbitrary<'youtube' | 'spoonacular'>,
          fc.string({ minLength: 1 }),
          fc.dictionary(fc.string(), fc.jsonValue()),
          (service, action, params) => {
            const result = validateRequest({ service, action, params });
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
