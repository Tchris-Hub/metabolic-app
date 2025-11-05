import { supabase } from '../../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface RecipeSummary {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  rating?: number;
}

export class RecipesRepository {
  static async listPublicRecipes(limit: number = 20): Promise<RecipeSummary[]> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('id,name,category,image_url,rating')
        .eq('is_public', true)
        .order('rating', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data || []) as RecipeSummary[];
    } catch (error) {
      console.error('Failed to list recipes:', error);
      return [];
    }
  }
}


