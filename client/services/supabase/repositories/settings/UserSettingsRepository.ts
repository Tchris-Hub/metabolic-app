import { supabase } from '../../config';

export class UserSettingsRepository {
  static async get(userId: string) {
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return data || null;
  }

  static async update(userId: string, updates: any) {
    const { error } = await supabase
      .from('user_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) throw error;
  }
}


