import { supabase } from '../config';
import { PostgrestError } from '@supabase/supabase-js';

export interface UserProfile {
  id?: string;
  user_id: string;
  display_name?: string;
  date_of_birth?: string; // stored in DB
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  // age is not stored in DB directly; we compute it from date_of_birth when reading
  age?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  health_conditions?: string[];
  health_goals?: string[];
  reminder_preferences?: {
    bloodSugar: boolean;
    medication: boolean;
    exercise: boolean;
    meals: boolean;
  };
  target_weight?: number;
  country?: string;
  medications?: string[];
  premium_status?: boolean;
  subscription_expiry?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserProfileData {
  user_id: string;
  display_name?: string;
  age?: number; // optional from UI; we will map to date_of_birth in DB
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  activity_level?: string;
  health_conditions?: string[];
  health_goals?: string[];
  reminder_preferences?: {
    bloodSugar: boolean;
    medication: boolean;
    exercise: boolean;
    meals: boolean;
  };
  target_weight?: number;
}

export class UserProfileRepository {
  /**
   * Create or update user profile
   */
  static async upsertProfile(data: CreateUserProfileData): Promise<UserProfile> {
    try {
      // Convert provided age to a date_of_birth string if needed
      const now = new Date();
      const date_of_birth = typeof data.age === 'number' && !isNaN(data.age)
        ? new Date(now.getFullYear() - data.age, 0, 1).toISOString().slice(0, 10)
        : undefined;

      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', data.user_id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error } = await supabase
          .from('user_profiles')
          .update({
            display_name: data.display_name,
            date_of_birth: date_of_birth ?? existingProfile.date_of_birth,
            gender: data.gender,
            height: data.height,
            weight: data.weight,
            activity_level: data.activity_level,
            health_conditions: data.health_conditions,
            health_goals: data.health_goals,
            reminder_preferences: data.reminder_preferences,
            target_weight: data.target_weight,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', data.user_id)
          .select()
          .single();

        if (error) throw error;
        return updatedProfile;
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: data.user_id,
            display_name: data.display_name,
            date_of_birth,
            gender: data.gender,
            height: data.height,
            weight: data.weight,
            activity_level: data.activity_level,
            health_conditions: data.health_conditions || [],
            health_goals: data.health_goals || [],
            reminder_preferences: data.reminder_preferences || {
              bloodSugar: false,
              medication: false,
              exercise: false,
              meals: false,
            },
            target_weight: data.target_weight,
          }])
          .select()
          .single();

        if (error) throw error;
        return newProfile;
      }
    } catch (error) {
      console.error('Failed to upsert user profile:', error);
      throw new Error(`Failed to save profile: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Get user profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      // Compute age from date_of_birth if present
      let computedAge: number | undefined = undefined;
      if (data?.date_of_birth) {
        const dob = new Date(data.date_of_birth);
        if (!isNaN(dob.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }
          computedAge = age;
        }
      }

      return { ...data, age: computedAge } as UserProfile;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Update health conditions
   */
  static async updateHealthConditions(userId: string, conditions: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          health_conditions: conditions,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update health conditions:', error);
      throw new Error(`Failed to update conditions: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update health goals
   */
  static async updateHealthGoals(userId: string, goals: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          health_goals: goals,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update health goals:', error);
      throw new Error(`Failed to update goals: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Update reminder preferences
   */
  static async updateReminderPreferences(
    userId: string,
    preferences: { bloodSugar: boolean; medication: boolean; exercise: boolean; meals: boolean }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          reminder_preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update reminder preferences:', error);
      throw new Error(`Failed to update preferences: ${(error as PostgrestError).message}`);
    }
  }

  /**
   * Check if user has specific health condition
   */
  static async hasCondition(userId: string, condition: string): Promise<boolean> {
    try {
      const profile = await this.getProfileByUserId(userId);
      return profile?.health_conditions?.includes(condition) || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get personalized recommendations based on profile
   */
  static async getPersonalizedRecommendations(userId: string): Promise<string[]> {
    try {
      const profile = await this.getProfileByUserId(userId);
      if (!profile) return [];

      const recommendations: string[] = [];

      // Recommendations based on conditions
      if (profile.health_conditions?.includes('Type 1 Diabetes')) {
        recommendations.push('Monitor blood sugar before and after meals');
        recommendations.push('Keep fast-acting glucose available');
        recommendations.push('Check for ketones if blood sugar is high');
      }

      if (profile.health_conditions?.includes('Type 2 Diabetes')) {
        recommendations.push('Focus on portion control and regular exercise');
        recommendations.push('Track carbohydrate intake at each meal');
        recommendations.push('Aim for 150 minutes of moderate activity per week');
      }

      if (profile.health_conditions?.includes('High Blood Pressure') || 
          profile.health_conditions?.includes('Hypertension')) {
        recommendations.push('Reduce sodium intake to less than 2,300mg daily');
        recommendations.push('Monitor blood pressure at the same time each day');
        recommendations.push('Practice stress-reduction techniques');
      }

      if (profile.health_conditions?.includes('Obesity') || 
          profile.health_conditions?.includes('Overweight')) {
        recommendations.push('Set realistic weight loss goals (1-2 lbs per week)');
        recommendations.push('Increase physical activity gradually');
        recommendations.push('Focus on whole foods and reduce processed foods');
      }

      if (profile.health_conditions?.includes('High Cholesterol')) {
        recommendations.push('Limit saturated and trans fats');
        recommendations.push('Increase fiber intake with whole grains');
        recommendations.push('Include heart-healthy fats like omega-3s');
      }

      // Recommendations based on activity level
      if (profile.activity_level === 'sedentary') {
        recommendations.push('Start with 10-minute walks after meals');
        recommendations.push('Set a goal to stand up every hour');
      }

      // General recommendations
      if (recommendations.length === 0) {
        recommendations.push('Stay hydrated with 8 glasses of water daily');
        recommendations.push('Aim for 7-9 hours of quality sleep');
        recommendations.push('Eat a balanced diet with plenty of vegetables');
      }

      return recommendations;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate BMI
   */
  static calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  /**
   * Get BMI category
   */
  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  /**
   * Get target calorie intake based on profile
   */
  static calculateTargetCalories(profile: UserProfile): number {
    if (!profile.age || !profile.weight || !profile.height || !profile.gender) {
      return 2000; // Default
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    const multiplier = activityMultipliers[profile.activity_level || 'sedentary'];
    return Math.round(bmr * multiplier);
  }
}
