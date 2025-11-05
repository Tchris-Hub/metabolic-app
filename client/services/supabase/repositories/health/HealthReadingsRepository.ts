import { supabase } from '../../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface HealthReading {
  id?: string;
  user_id: string;
  type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity' | 'heartRate' | 'sleep' | 'water' | 'medication';
  value: number;
  unit: string;
  timestamp: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface BloodSugarReading {
  user_id: string;
  value: number;
  unit?: string;
  meal_context?: 'fasting' | 'before_meal' | 'after_meal' | string;
  notes?: string;
  timestamp?: string;
}

export interface BloodPressureReading {
  user_id: string;
  systolic: number;
  diastolic: number;
  heart_rate?: number;
  notes?: string;
  timestamp?: string;
}

export interface WeightReading {
  user_id: string;
  weight: number;
  unit?: string;
  body_fat?: number;
  muscle_mass?: number;
  notes?: string;
  timestamp?: string;
}

export interface HealthStats {
  totalReadings: number;
  thisWeekReadings: number;
  bloodSugarInRange: number;
  lastBloodSugar: number | null;
  lastWeight: number | null;
  lastBloodPressure: { systolic: number; diastolic: number } | null;
}

export class HealthReadingsRepository {
  static async saveBloodSugarReading(reading: BloodSugarReading): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert([{
          user_id: reading.user_id,
          type: 'bloodSugar',
          value: reading.value,
          unit: reading.unit || 'mg/dL',
          timestamp: reading.timestamp || new Date().toISOString(),
          notes: reading.notes,
          metadata: { meal_context: reading.meal_context },
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Failed to save blood sugar reading:', error);
      throw new Error(`Failed to save reading: ${(error as PostgrestError).message}`);
    }
  }

  static async saveBloodPressureReading(reading: BloodPressureReading): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert([{
          user_id: reading.user_id,
          type: 'bloodPressure',
          value: reading.systolic,
          unit: 'mmHg',
          timestamp: reading.timestamp || new Date().toISOString(),
          notes: reading.notes,
          metadata: {
            systolic: reading.systolic,
            diastolic: reading.diastolic,
            heart_rate: reading.heart_rate,
          },
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Failed to save blood pressure reading:', error);
      throw new Error(`Failed to save reading: ${(error as PostgrestError).message}`);
    }
  }

  static async saveWeightReading(reading: WeightReading): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert([{
          user_id: reading.user_id,
          type: 'weight',
          value: reading.weight,
          unit: reading.unit || 'kg',
          timestamp: reading.timestamp || new Date().toISOString(),
          notes: reading.notes,
          metadata: {
            body_fat: reading.body_fat,
            muscle_mass: reading.muscle_mass,
          },
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Failed to save weight reading:', error);
      throw new Error(`Failed to save reading: ${(error as PostgrestError).message}`);
    }
  }

  static async saveMedicationLog(userId: string, medications: any[]): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .insert([{
          user_id: userId,
          type: 'medication',
          value: medications.length,
          unit: 'count',
          timestamp: new Date().toISOString(),
          metadata: { medications },
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Failed to save medication log:', error);
      throw new Error(`Failed to save medications: ${(error as PostgrestError).message}`);
    }
  }

  static async getReadingsByType(
    userId: string,
    type: HealthReading['type'],
    options?: { days?: number; limit?: number }
  ): Promise<HealthReading[]> {
    try {
      let query = supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('timestamp', { ascending: false });

      if (options?.days && options.days > 0) {
        const since = new Date();
        since.setDate(since.getDate() - options.days);
        query = query.gte('timestamp', since.toISOString());
      }

      if (options?.limit && options.limit > 0) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as HealthReading[];
    } catch (error) {
      console.error('Failed to get readings by type:', error);
      return [];
    }
  }

  static async getHealthStats(userId: string): Promise<HealthStats> {
    try {
      const { count: totalCount } = await supabase
        .from('health_readings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: weekCount } = await supabase
        .from('health_readings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('timestamp', weekAgo.toISOString());

      const { data: bloodSugarReadings } = await supabase
        .from('health_readings')
        .select('value')
        .eq('user_id', userId)
        .eq('type', 'bloodSugar')
        .gte('timestamp', weekAgo.toISOString());

      let bloodSugarInRange = 0;
      if (bloodSugarReadings && bloodSugarReadings.length > 0) {
        const inRangeCount = bloodSugarReadings.filter(
          (r) => r.value >= 70 && r.value <= 140
        ).length;
        bloodSugarInRange = Math.round((inRangeCount / bloodSugarReadings.length) * 100);
      }

      const { data: latestBloodSugar } = await supabase
        .from('health_readings')
        .select('value')
        .eq('user_id', userId)
        .eq('type', 'bloodSugar')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      const { data: latestWeight } = await supabase
        .from('health_readings')
        .select('value')
        .eq('user_id', userId)
        .eq('type', 'weight')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      const { data: latestBP } = await supabase
        .from('health_readings')
        .select('metadata')
        .eq('user_id', userId)
        .eq('type', 'bloodPressure')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      return {
        totalReadings: totalCount || 0,
        thisWeekReadings: weekCount || 0,
        bloodSugarInRange,
        lastBloodSugar: latestBloodSugar?.value || null,
        lastWeight: latestWeight?.value || null,
        lastBloodPressure: latestBP?.metadata
          ? { systolic: latestBP.metadata.systolic, diastolic: latestBP.metadata.diastolic }
          : null,
      };
    } catch (error) {
      console.error('Failed to get health stats:', error);
      return {
        totalReadings: 0,
        thisWeekReadings: 0,
        bloodSugarInRange: 0,
        lastBloodSugar: null,
        lastWeight: null,
        lastBloodPressure: null,
      };
    }
  }

  static async getRecentReadings(userId: string, limit: number = 5): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('health_readings')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map((reading) => {
        let displayValue = '';
        if (reading.type === 'bloodPressure' && reading.metadata) {
          displayValue = `${reading.metadata.systolic}/${reading.metadata.diastolic}`;
        } else {
          displayValue = `${reading.value} ${reading.unit}`;
        }
        return {
          type: reading.type,
          value: displayValue,
          timestamp: reading.timestamp,
          notes: reading.notes,
        };
      });
    } catch (error) {
      console.error('Failed to get recent readings:', error);
      return [];
    }
  }

  static async deleteReading(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete reading:', error);
      throw new Error(`Failed to delete reading: ${(error as PostgrestError).message}`);
    }
  }

  static async updateReading(id: string, data: Partial<HealthReading>): Promise<void> {
    try {
      const { error } = await supabase
        .from('health_readings')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to update reading:', error);
      throw new Error(`Failed to update reading: ${(error as PostgrestError).message}`);
    }
  }
}


