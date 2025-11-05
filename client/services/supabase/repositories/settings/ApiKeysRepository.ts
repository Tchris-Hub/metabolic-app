import { supabase } from '../../config';

export interface ApiKeyRecord {
  id: string;
  service: string; // e.g., 'SPOONACULAR', 'YOUTUBE', 'STRIPE'
  name?: string | null; // optional alias if you store multiple per service
  key: string;
  active: boolean;
  created_at: string;
  updated_at: string | null;
}

export class ApiKeysRepository {
  static async getActiveKeyByService(service: string): Promise<ApiKeyRecord | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('service', service)
      .eq('active', true)
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('[ApiKeysRepository] getActiveKeyByService error:', error.message);
      return null;
    }
    return (data as ApiKeyRecord) || null;
  }

  static async getKeyByName(service: string, name: string): Promise<ApiKeyRecord | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('service', service)
      .eq('name', name)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('[ApiKeysRepository] getKeyByName error:', error.message);
      return null;
    }
    return (data as ApiKeyRecord) || null;
  }

  static async listActive(service?: string): Promise<ApiKeyRecord[]> {
    let query = supabase.from('api_keys').select('*').eq('active', true);
    if (service) query = query.eq('service', service);
    const { data, error } = await query.order('updated_at', { ascending: false }).order('created_at', { ascending: false });
    if (error) {
      console.warn('[ApiKeysRepository] listActive error:', error.message);
      return [];
    }
    return (data as ApiKeyRecord[]) || [];
  }
}
