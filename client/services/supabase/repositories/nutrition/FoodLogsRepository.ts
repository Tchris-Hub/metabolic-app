import { supabase } from '../../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface FoodLog {
  id?: string;
  user_id: string;
  food_item_id?: string | null;
  amount: number;
  unit: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp?: string;
  notes?: string;
  nutrition?: Record<string, any>;
}

export class FoodLogsRepository {
  static async add(log: FoodLog): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert([{ ...log, timestamp: log.timestamp || new Date().toISOString() }])
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new Error(`Failed to add food log: ${(error as PostgrestError).message}`);
    }
  }
}


