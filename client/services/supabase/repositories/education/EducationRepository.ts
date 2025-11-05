import { supabase } from '../../config';

export class EducationRepository {
  static async getProgress(userId: string) {
    const { data } = await supabase
      .from('education_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });
    return data || [];
  }
}


