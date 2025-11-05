import { supabase } from '../../config';

/**
 * MealRepository
 *
 * Mirrors the Learn/Education repository pattern, but for meals.
 * This is how we call Supabase from the client to fetch user-specific meal data.
 *
 * Example usage (in a screen):
 *   const plans = await MealRepository.getMealPlans(userId);
 */
export class MealRepository {
  static async getMealPlans(userId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('MealRepository.getMealPlans error:', error);
      return [] as any[];
    }

    return data || [];
  }

  static async getMealsForDay(userId: string, dateISO: string) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateISO)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('MealRepository.getMealsForDay error:', error);
      return [] as any[];
    }
    return data || [];
  }
}
