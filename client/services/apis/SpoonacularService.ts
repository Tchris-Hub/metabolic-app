/**
 * SpoonacularService
 * 
 * Service for fetching recipes through the secure Edge Function proxy.
 * API keys are never exposed to the client.
 * 
 * _Requirements: 3.1, 3.2_
 */

import { Recipe } from '../../data/recipes';
import { SecureApiService } from '../config/SecureApiService';

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  analyzedInstructions?: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  extendedIngredients?: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  diets?: string[];
  cuisines?: string[];
  dishTypes?: string[];
}

export class SpoonacularService {
  /**
   * Search for recipes using Edge Function proxy
   * API key never exposed to client
   */
  static async searchRecipes(
    query: string,
    options?: {
      diet?: string;
      cuisine?: string;
      maxReadyTime?: number;
      minCalories?: number;
      maxCalories?: number;
      number?: number;
    }
  ): Promise<Recipe[]> {
    try {
      const response = await SecureApiService.spoonacular<Recipe[]>('search', {
        query,
        number: options?.number || 10,
        diet: options?.diet,
        cuisine: options?.cuisine,
        maxReadyTime: options?.maxReadyTime,
        minCalories: options?.minCalories,
        maxCalories: options?.maxCalories,
      });

      if (response.error) {
        console.error('[SpoonacularService] Search error:', response.error.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('[SpoonacularService] Failed to search recipes:', error);
      return [];
    }
  }

  /**
   * Get recipe details by ID using Edge Function proxy
   * API key never exposed to client
   */
  static async getRecipeById(id: number): Promise<Recipe | null> {
    try {
      const response = await SecureApiService.spoonacular<Recipe>('details', {
        id,
      });

      if (response.error) {
        console.error('[SpoonacularService] Details error:', response.error.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error('[SpoonacularService] Failed to get recipe details:', error);
      return null;
    }
  }

  /**
   * Get random recipes using Edge Function proxy
   * API key never exposed to client
   */
  static async getRandomRecipes(
    number: number = 5,
    tags?: string[]
  ): Promise<Recipe[]> {
    try {
      const response = await SecureApiService.spoonacular<Recipe[]>('random', {
        number,
        tags,
      });

      if (response.error) {
        console.error('[SpoonacularService] Random recipes error:', response.error.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('[SpoonacularService] Failed to get random recipes:', error);
      return [];
    }
  }
}
