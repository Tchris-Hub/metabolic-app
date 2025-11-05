import { supabase } from './config';
import { PostgrestError } from '@supabase/supabase-js';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface HealthReading {
  id?: string;
  user_id: string;
  type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity' | 'heartRate' | 'sleep' | 'water' | 'medication';
  value: number;
  unit: string;
  timestamp: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile {
  id?: string;
  user_id: string;
  display_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  country?: string;
  health_conditions?: string[];
  medications?: string[];
  goals?: string[];
  premium_status?: boolean;
  subscription_expiry?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MealPlan {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  duration: number;
  meals: any[];
  total_calories?: number;
  total_carbs?: number;
  total_protein?: number;
  total_fat?: number;
  dietary_restrictions?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  rating?: number;
  reviews?: number;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FoodItem {
  id?: string;
  name: string;
  brand?: string;
  barcode?: string;
  image_url?: string;
  serving_size: number;
  serving_unit: string;
  category: string;
  subcategory?: string;
  nutrition: Record<string, any>;
  glycemic_index?: number;
  glycemic_load?: number;
  tags?: string[];
  allergens?: string[];
  is_diabetic_friendly?: boolean;
  is_heart_healthy?: boolean;
  is_low_sodium?: boolean;
  is_low_carb?: boolean;
  is_high_fiber?: boolean;
  is_high_protein?: boolean;
  is_verified?: boolean;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FoodLog {
  id?: string;
  user_id: string;
  food_item_id?: string;
  amount: number;
  unit: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  notes?: string;
  nutrition?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id?: string;
  name: string;
  description?: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prep_time?: number;
  cook_time?: number;
  servings: number;
  image_url?: string;
  video_url?: string;
  nutrition: Record<string, any>;
  ingredients: any[];
  instructions: string[];
  dietary_restrictions?: string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  author_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// DATABASE SERVICE
// ============================================

export class DatabaseService {
  // ============================================
  // HEALTH READINGS
  // ============================================

  /**
   * Save a health reading
   */
  static async saveHealthReading(reading: HealthReading): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert([reading])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new Error(`Failed to save health reading: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get health readings with optional filters
   */
  static async getHealthReadings(
    userId: string,
    type?: string,
    limitCount?: number
  ): Promise<HealthReading[]> {
    try {
      let query = supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (limitCount) {
        query = query.limit(limitCount);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to get health readings: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update a health reading
   */
  static async updateHealthReading(id: string, data: Partial<HealthReading>): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to update health reading: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Delete a health reading
   */
  static async deleteHealthReading(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to delete health reading: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // USER PROFILE
  // ============================================

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to update user profile: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // MEAL PLANS
  // ============================================

  /**
   * Save a meal plan
   */
  static async saveMealPlan(mealPlan: MealPlan): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([mealPlan])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new Error(`Failed to save meal plan: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get meal plans for a user
   */
  static async getMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to get meal plans: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update a meal plan
   */
  static async updateMealPlan(id: string, data: Partial<MealPlan>): Promise<void> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to update meal plan: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Delete a meal plan
   */
  static async deleteMealPlan(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to delete meal plan: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // FOOD ITEMS
  // ============================================

  /**
   * Search food items
   */
  static async searchFoodItems(query: string, limit: number = 20): Promise<FoodItem[]> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to search food items: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get food item by barcode
   */
  static async getFoodItemByBarcode(barcode: string): Promise<FoodItem | null> {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('barcode', barcode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get food item: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // FOOD LOGS
  // ============================================

  /**
   * Save a food log
   */
  static async saveFoodLog(foodLog: FoodLog): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert([foodLog])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new Error(`Failed to save food log: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get food logs for a user
   */
  static async getFoodLogs(userId: string, date?: string): Promise<FoodLog[]> {
    try {
      let query = supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        query = query
          .gte('timestamp', startOfDay.toISOString())
          .lte('timestamp', endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to get food logs: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // RECIPES
  // ============================================

  /**
   * Get public recipes
   */
  static async getPublicRecipes(limit: number = 50): Promise<Recipe[]> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Failed to get recipes: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get recipe: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // FAVORITE MEALS
  // ============================================

  /**
   * Add recipe to favorites
   */
  static async addFavorite(userId: string, recipeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorite_meals')
        .insert([{ user_id: userId, recipe_id: recipeId }]);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to add favorite: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Remove recipe from favorites
   */
  static async removeFavorite(userId: string, recipeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorite_meals')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to remove favorite: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get user's favorite recipes
   */
  static async getFavorites(userId: string): Promise<Recipe[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_meals')
        .select('recipe_id, recipes(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((item: any) => item.recipes) || [];
    } catch (error) {
      throw new Error(`Failed to get favorites: ${(error as PostgrestError).message}`);
    }
  }

  // ============================================
  // USER SETTINGS
  // ============================================

  /**
   * Get user settings
   */
  static async getUserSettings(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to get user settings: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update user settings
   */
  static async updateUserSettings(userId: string, settings: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to update user settings: ${(error as PostgrestError).message}`);
    }
  }
}
