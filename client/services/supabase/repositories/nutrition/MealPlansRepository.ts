import { supabase } from '../../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface MealPlan {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  duration: number;
  meals: Record<string, any>;
  total_calories?: number;
}

export class MealPlansRepository {
  static async listByUser(userId: string) {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async create(plan: MealPlan): Promise<string> {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert([plan])
      .select('id')
      .single();
    if (error) throw error as PostgrestError;
    return data.id;
  }
}


