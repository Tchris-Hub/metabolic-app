import { supabase } from '../../config';

export class NotificationsRepository {
  static async list(userId: string) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_for', { ascending: false });
    return data || [];
  }
}


