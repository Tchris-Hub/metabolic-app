import { supabase } from '../../config';

export class AchievementsRepository {
  static async list(userId: string) {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    return data || [];
  }
}


