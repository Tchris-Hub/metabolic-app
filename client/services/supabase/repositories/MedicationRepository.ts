import { supabase } from '../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface MedicationRecord {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  with_food: boolean;
  instructions?: string | null;
  prescriber?: string | null;
  refill_reminder: boolean;
  pills_remaining?: number | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateMedicationPayload = Omit<MedicationRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export class MedicationRepository {
  static async getMedications(userId: string): Promise<MedicationRecord[]> {
    const { data, error } = await supabase
      .from('user_medications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch medications:', error);
      throw error;
    }

    return (data || []) as MedicationRecord[];
  }

  static async createMedication(userId: string, payload: CreateMedicationPayload): Promise<MedicationRecord> {
    const { data, error } = await supabase
      .from('user_medications')
      .insert([{ user_id: userId, ...payload }])
      .select('*')
      .single();

    if (error) {
      console.error('Failed to create medication:', error);
      throw error;
    }

    return data as MedicationRecord;
  }

  static async updateMedication(id: string, payload: Partial<CreateMedicationPayload>): Promise<void> {
    const { error } = await supabase
      .from('user_medications')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update medication:', error);
      throw error;
    }
  }

  static async deleteMedication(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_medications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete medication:', error);
      throw error;
    }
  }
}
