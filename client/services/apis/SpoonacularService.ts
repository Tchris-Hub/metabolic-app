import { Recipe } from '../../data/recipes';
import { ApiKeyService } from '../config/ApiKeyService';

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
  private static readonly BASE_URL = 'https://api.spoonacular.com';

  /**
   * Search for recipes using Spoonacular API
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
    const apiKey = await ApiKeyService.get('SPOONACULAR');
    if (!apiKey) {
      console.error('Spoonacular API key not found');
      return [];
    }

    try {
      const params = new URLSearchParams({
        apiKey: apiKey,
        query,
        number: (options?.number || 10).toString(),
        addRecipeNutrition: 'true',
        addRecipeInstructions: 'true',
      });

      if (options?.diet) params.append('diet', options.diet);
      if (options?.cuisine) params.append('cuisine', options.cuisine);
      if (options?.maxReadyTime) params.append('maxReadyTime', options.maxReadyTime.toString());
      if (options?.minCalories) params.append('minCalories', options.minCalories.toString());
      if (options?.maxCalories) params.append('maxCalories', options.maxCalories.toString());

      const response = await fetch(
        `${this.BASE_URL}/recipes/complexSearch?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();

      return this.transformSpoonacularRecipes(data.results || []);
    } catch (error) {
      console.error('Failed to search recipes:', error);
      return [];
    }
  }

  /**
   * Get recipe details by ID
   */
  static async getRecipeById(id: number): Promise<Recipe | null> {
    const apiKey = await ApiKeyService.get('SPOONACULAR');
    if (!apiKey) {
      console.error('Spoonacular API key not found');
      return null;
    }

    try {
      const params = new URLSearchParams({
        apiKey: apiKey,
        includeNutrition: 'true',
      });

      const response = await fetch(
        `${this.BASE_URL}/recipes/${id}/information?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const recipe = await response.json();
      const recipes = this.transformSpoonacularRecipes([recipe]);
      return recipes[0] || null;
    } catch (error) {
      console.error('Failed to get recipe details:', error);
      return null;
    }
  }

  /**
   * Get random recipes
   */
  static async getRandomRecipes(
    number: number = 5,
    tags?: string[]
  ): Promise<Recipe[]> {
    const apiKey = await ApiKeyService.get('SPOONACULAR');
    if (!apiKey) {
      console.error('Spoonacular API key not found');
      return [];
    }

    try {
      const params = new URLSearchParams({
        apiKey: apiKey,
        number: number.toString(),
        includeNutrition: 'true',
      });

      if (tags && tags.length > 0) {
        params.append('tags', tags.join(','));
      }

      const response = await fetch(
        `${this.BASE_URL}/recipes/random?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSpoonacularRecipes(data.recipes || []);
    } catch (error) {
      console.error('Failed to get random recipes:', error);
      return [];
    }
  }

  /**
   * Transform Spoonacular recipe format to our Recipe interface
   */
  private static transformSpoonacularRecipes(spoonacularRecipes: SpoonacularRecipe[]): Recipe[] {
    return spoonacularRecipes.map(recipe => {
      // Extract nutrition data
      const nutrition = recipe.nutrition?.nutrients || [];
      const calories = nutrition.find(n => n.name === 'Calories')?.amount || 0;
      const carbs = nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0;
      const protein = nutrition.find(n => n.name === 'Protein')?.amount || 0;
      const fat = nutrition.find(n => n.name === 'Fat')?.amount || 0;
      const fiber = nutrition.find(n => n.name === 'Fiber')?.amount || 0;
      const sodium = nutrition.find(n => n.name === 'Sodium')?.amount || 0;
      const sugar = nutrition.find(n => n.name === 'Sugar')?.amount || 0;

      // Transform instructions
      const instructions = recipe.analyzedInstructions?.[0]?.steps?.map(step =>
        step.step
      ) || ['Recipe instructions available on Spoonacular'];

      // Transform ingredients
      const ingredients = recipe.extendedIngredients?.map(ing => ({
        name: ing.name,
        amount: ing.amount.toString(),
        unit: ing.unit,
      })) || [];

      // Determine category based on dish types
      let category: Recipe['category'] = 'lunch';
      if (recipe.dishTypes?.includes('breakfast')) category = 'breakfast';
      else if (recipe.dishTypes?.includes('main course') || recipe.dishTypes?.includes('dinner')) category = 'dinner';
      else if (recipe.dishTypes?.includes('snack') || recipe.dishTypes?.includes('appetizer')) category = 'snack';

      // Transform tags
      const tags = [
        ...(recipe.diets || []),
        ...(recipe.cuisines || []),
        ...recipe.dishTypes?.slice(0, 2) || [],
      ].filter(tag => tag && tag !== 'main course');

      return {
        id: recipe.id.toString(),
        name: recipe.title,
        description: `Ready in ${recipe.readyInMinutes} minutes. Serves ${recipe.servings}.`,
        category,
        cuisine: recipe.cuisines?.[0] || 'International',
        difficulty: recipe.readyInMinutes > 60 ? 'hard' : recipe.readyInMinutes > 30 ? 'medium' : 'easy',
        prepTime: Math.max(5, recipe.readyInMinutes - 20),
        cookTime: Math.min(recipe.readyInMinutes, 20),
        servings: recipe.servings,
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
        rating: 4.2, // Spoonacular doesn't provide ratings in basic API
        reviews: Math.floor(Math.random() * 100) + 10, // Placeholder
        glycemicIndex: this.estimateGlycemicIndex(recipe),
        healthCompatibility: this.analyzeHealthCompatibility(recipe, nutrition),
        healthScore: this.calculateHealthScore(recipe, nutrition),
      };
    });
  }

  /**
   * Estimate glycemic index based on recipe characteristics
   */
  private static estimateGlycemicIndex(recipe: SpoonacularRecipe): number {
    // Simple estimation based on available data
    let gi = 50; // Default medium GI

    if (recipe.diets?.includes('low-carb') || recipe.diets?.includes('ketogenic')) {
      gi = 25; // Low GI
    } else if (recipe.diets?.includes('vegan') || recipe.diets?.includes('vegetarian')) {
      gi = 40; // Generally lower GI
    }

    // Adjust based on nutrition data if available
    if (recipe.nutrition?.nutrients) {
      const carbs = recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
      const fiber = recipe.nutrition.nutrients.find(n => n.name === 'Fiber')?.amount || 0;
      const sugar = recipe.nutrition.nutrients.find(n => n.name === 'Sugar')?.amount || 0;

      if (carbs > 0) {
        const fiberRatio = fiber / carbs;
        if (fiberRatio > 0.1) gi -= 15; // High fiber reduces GI
        if (sugar > carbs * 0.3) gi += 20; // High sugar increases GI
      }
    }

    return Math.max(10, Math.min(100, gi));
  }

  /**
   * Analyze health compatibility based on recipe data
   */
  private static analyzeHealthCompatibility(
    recipe: SpoonacularRecipe,
    nutrition: Array<{ name: string; amount: number; unit: string }>
  ): Recipe['healthCompatibility'] {
    const calories = nutrition.find(n => n.name === 'Calories')?.amount || 0;
    const carbs = nutrition.find(n => n.name === 'Carbohydrates')?.amount || 0;
    const protein = nutrition.find(n => n.name === 'Protein')?.amount || 0;
    const fat = nutrition.find(n => n.name === 'Fat')?.amount || 0;
    const fiber = nutrition.find(n => n.name === 'Fiber')?.amount || 0;
    const sodium = nutrition.find(n => n.name === 'Sodium')?.amount || 0;

    return {
      bloodSugarFriendly: carbs < 50 && fiber > 5,
      weightManagement: calories < 500 && protein > 15,
      bloodPressureFriendly: sodium < 500,
      heartHealthy: fat < 30 && sodium < 500,
      diabetesFriendly: carbs < 40 && fiber > 8,
    };
  }

  /**
   * Calculate overall health score (0-100)
   */
  private static calculateHealthScore(
    recipe: SpoonacularRecipe,
    nutrition: Array<{ name: string; amount: number; unit: string }>
  ): number {
    let score = 50; // Base score

    const calories = nutrition.find(n => n.name === 'Calories')?.amount || 0;
    const protein = nutrition.find(n => n.name === 'Protein')?.amount || 0;
    const fiber = nutrition.find(n => n.name === 'Fiber')?.amount || 0;
    const sodium = nutrition.find(n => n.name === 'Sodium')?.amount || 0;

    // Positive factors
    if (protein > 15) score += 15;
    if (fiber > 5) score += 10;
    if (calories < 400) score += 10;

    // Negative factors
    if (sodium > 500) score -= 15;
    if (calories > 600) score -= 10;

    // Diet compatibility
    if (recipe.diets?.includes('vegan')) score += 5;
    if (recipe.diets?.includes('vegetarian')) score += 3;

    return Math.max(0, Math.min(100, score));
  }
}
