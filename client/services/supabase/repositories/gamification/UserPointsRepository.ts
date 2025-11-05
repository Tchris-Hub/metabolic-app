import { supabase } from '../../config';

export class UserPointsRepository {
  static async get(userId: string) {
    const { data } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data || null;
  }
}


