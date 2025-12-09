// @ts-nocheck
// Supabase Edge Function: call-service
// Proxies requests to external APIs (YouTube, Spoonacular) without exposing API keys to the client
// **Feature: secure-api-keys**
// 
// NOTE: This file runs in Deno (Supabase Edge Functions), not Node.js.
// TypeScript errors about Deno imports and APIs are expected in VS Code.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

// Types
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

// Encryption utilities using Web Crypto API (Deno compatible)
async function decrypt(encryptedData: string, keyHex: string): Promise<string> {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = hexToBytes(ivHex);
  const authTag = hexToBytes(authTagHex);
  const encryptedBytes = hexToBytes(encrypted);
  const keyBytes = hexToBytes(keyHex);

  // Combine encrypted data with auth tag for AES-GCM
  const combined = new Uint8Array(encryptedBytes.length + authTag.length);
  combined.set(encryptedBytes);
  combined.set(authTag, encryptedBytes.length);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    combined
  );

  return new TextDecoder().decode(decrypted);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}


// Request validation
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

// Service-specific parameter validation
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

// Get API key from database
async function getApiKey(supabase: any, service: string, encryptionKey: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('encrypted_key')
    .eq('service', service.toUpperCase())
    .eq('active', true)
    .single();

  if (error || !data?.encrypted_key) {
    console.error(`[call-service] Failed to get API key for ${service}:`, error?.message);
    return null;
  }

  try {
    return await decrypt(data.encrypted_key, encryptionKey);
  } catch (e) {
    console.error(`[call-service] Failed to decrypt API key for ${service}:`, (e as Error).message);
    return null;
  }
}

// Create error response
function errorResponse(code: CallServiceResponse['error']['code'], message: string): CallServiceResponse {
  return { data: null, error: { code, message } };
}

// Create success response
function successResponse<T>(data: T): CallServiceResponse<T> {
  return { data, error: null };
}


// YouTube API handlers
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function handleYouTube(action: string, params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  try {
    switch (action) {
      case 'search':
        return await youtubeSearch(params, apiKey);
      case 'details':
        return await youtubeDetails(params, apiKey);
      case 'healthVideos':
        return await youtubeHealthVideos(params, apiKey);
      default:
        return errorResponse('INVALID_PARAMS', `Unknown YouTube action: ${action}`);
    }
  } catch (e) {
    console.error('[call-service] YouTube API error:', e);
    if ((e as Error).message?.includes('quota')) {
      return errorResponse('RATE_LIMITED', 'YouTube API quota exceeded. Please try again later.');
    }
    return errorResponse('API_ERROR', `YouTube API error: ${(e as Error).message}`);
  }
}

async function youtubeSearch(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const searchParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet',
    type: 'video',
    q: params.query,
    maxResults: (params.maxResults || 10).toString(),
    order: params.order || 'relevance',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
  });

  if (params.videoDuration) {
    searchParams.append('videoDuration', params.videoDuration);
  }

  const response = await fetch(`${YOUTUBE_BASE_URL}/search?${searchParams.toString()}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const videoIds = data.items?.map((item: any) => item.id.videoId).filter(Boolean).join(',');

  // Get detailed video info if we have video IDs
  if (videoIds) {
    const detailsResult = await youtubeDetails({ videoIds }, apiKey);
    if (detailsResult.data) {
      return detailsResult;
    }
  }

  // Transform basic search results
  const videos = transformYouTubeSearchResults(data.items || []);
  return successResponse(videos);
}

async function youtubeDetails(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const searchParams = new URLSearchParams({
    key: apiKey,
    part: 'snippet,contentDetails,statistics',
    id: params.videoIds,
  });

  const response = await fetch(`${YOUTUBE_BASE_URL}/videos?${searchParams.toString()}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const videos = transformYouTubeVideoDetails(data.items || []);
  return successResponse(videos);
}

async function youtubeHealthVideos(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const queries: Record<string, string> = {
    diabetes: 'diabetes management education tips',
    nutrition: 'healthy eating nutrition guide',
    exercise: 'exercise workout fitness health',
    bloodPressure: 'blood pressure management tips',
    bloodSugar: 'blood sugar control diabetes',
    weightLoss: 'weight loss healthy diet',
    mentalHealth: 'mental health wellness tips',
    cooking: 'healthy cooking recipes low carb',
  };

  const query = queries[params.category] || 'health wellness education';
  
  return youtubeSearch({
    query,
    maxResults: params.maxResults || 20,
    order: 'relevance',
    videoDuration: 'medium',
  }, apiKey);
}


// YouTube response transformers
function transformYouTubeSearchResults(items: any[]): any[] {
  return items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}

function transformYouTubeVideoDetails(items: any[]): any[] {
  return items.map(item => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
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
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
}


// Spoonacular API handlers
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

async function handleSpoonacular(action: string, params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  try {
    switch (action) {
      case 'search':
        return await spoonacularSearch(params, apiKey);
      case 'details':
        return await spoonacularDetails(params, apiKey);
      case 'random':
        return await spoonacularRandom(params, apiKey);
      default:
        return errorResponse('INVALID_PARAMS', `Unknown Spoonacular action: ${action}`);
    }
  } catch (e) {
    console.error('[call-service] Spoonacular API error:', e);
    if ((e as Error).message?.includes('402') || (e as Error).message?.includes('quota')) {
      return errorResponse('RATE_LIMITED', 'Spoonacular API quota exceeded. Please try again later.');
    }
    return errorResponse('API_ERROR', `Spoonacular API error: ${(e as Error).message}`);
  }
}

async function spoonacularSearch(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const searchParams = new URLSearchParams({
    apiKey,
    query: params.query,
    number: (params.number || 10).toString(),
    addRecipeNutrition: 'true',
    addRecipeInstructions: 'true',
  });

  if (params.diet) searchParams.append('diet', params.diet);
  if (params.cuisine) searchParams.append('cuisine', params.cuisine);
  if (params.maxReadyTime) searchParams.append('maxReadyTime', params.maxReadyTime.toString());
  if (params.minCalories) searchParams.append('minCalories', params.minCalories.toString());
  if (params.maxCalories) searchParams.append('maxCalories', params.maxCalories.toString());

  const response = await fetch(`${SPOONACULAR_BASE_URL}/recipes/complexSearch?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const recipes = transformSpoonacularRecipes(data.results || []);
  return successResponse(recipes);
}

async function spoonacularDetails(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const searchParams = new URLSearchParams({
    apiKey,
    includeNutrition: 'true',
  });

  const response = await fetch(`${SPOONACULAR_BASE_URL}/recipes/${params.id}/information?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const recipe = await response.json();
  const recipes = transformSpoonacularRecipes([recipe]);
  return successResponse(recipes[0] || null);
}

async function spoonacularRandom(params: Record<string, any>, apiKey: string): Promise<CallServiceResponse> {
  const searchParams = new URLSearchParams({
    apiKey,
    number: (params.number || 5).toString(),
    includeNutrition: 'true',
  });

  if (params.tags && Array.isArray(params.tags) && params.tags.length > 0) {
    searchParams.append('tags', params.tags.join(','));
  }

  const response = await fetch(`${SPOONACULAR_BASE_URL}/recipes/random?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const recipes = transformSpoonacularRecipes(data.recipes || []);
  return successResponse(recipes);
}


// Spoonacular response transformer
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

    const tags = [
      ...(recipe.diets || []),
      ...(recipe.cuisines || []),
      ...(recipe.dishTypes?.slice(0, 2) || []),
    ].filter((tag: string) => tag && tag !== 'main course');

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
      tags,
      imageUrl: recipe.image,
      rating: 4.2,
      reviews: Math.floor(Math.random() * 100) + 10,
      healthCompatibility: {
        bloodSugarFriendly: carbs < 50 && fiber > 5,
        weightManagement: calories < 500 && protein > 15,
        bloodPressureFriendly: sodium < 500,
        heartHealthy: fat < 30 && sodium < 500,
        diabetesFriendly: carbs < 40 && fiber > 8,
      },
    };
  });
}


// Main request handler
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify(errorResponse('INVALID_PARAMS', 'Only POST requests are allowed')),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    
    // Validate request structure
    const validation = validateRequest(body);
    if (!validation.valid) {
      console.error('[call-service] Validation error:', validation.error);
      return new Response(
        JSON.stringify(errorResponse('INVALID_PARAMS', validation.error)),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { service, action, params } = validation.request;

    // Validate service-specific parameters
    const paramError = validateServiceParams(service, action, params);
    if (paramError) {
      console.error('[call-service] Parameter validation error:', paramError);
      return new Response(
        JSON.stringify(errorResponse('INVALID_PARAMS', paramError)),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[call-service] Missing Supabase environment variables');
      return new Response(
        JSON.stringify(errorResponse('API_ERROR', 'Server configuration error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!encryptionKey) {
      console.error('[call-service] Missing ENCRYPTION_KEY environment variable');
      return new Response(
        JSON.stringify(errorResponse('API_ERROR', 'Server configuration error')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get API key for the requested service
    const apiKey = await getApiKey(supabase, service, encryptionKey);
    if (!apiKey) {
      return new Response(
        JSON.stringify(errorResponse('KEY_NOT_FOUND', 'Service temporarily unavailable')),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Route to appropriate service handler
    let result: CallServiceResponse;
    
    switch (service) {
      case 'youtube':
        result = await handleYouTube(action, params, apiKey);
        break;
      case 'spoonacular':
        result = await handleSpoonacular(action, params, apiKey);
        break;
      default:
        result = errorResponse('INVALID_SERVICE', 'Service not supported');
    }

    const status = result.error ? (result.error.code === 'RATE_LIMITED' ? 429 : 400) : 200;
    
    return new Response(
      JSON.stringify(result),
      { 
        status, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );

  } catch (e) {
    console.error('[call-service] Unexpected error:', e);
    return new Response(
      JSON.stringify(errorResponse('API_ERROR', 'An unexpected error occurred')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
