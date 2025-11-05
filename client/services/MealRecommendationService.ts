import { HealthReadingsRepository, HealthReading } from '../services/supabase/repositories/HealthReadingsRepository';
import { HEALTH_THRESHOLDS, HEALTH_PRIORITIES, RECIPE_HEALTH_FLAGS } from '../utils/healthConstants';
import { Recipe } from '../data/recipes';

export interface HealthStatus {
  bloodSugar: {
    current: number | null;
    trend: 'improving' | 'stable' | 'declining' | 'unknown';
    level: 'normal' | 'high' | 'very-high' | 'low' | 'unknown';
    priority: number;
  };
  bloodPressure: {
    systolic: number | null;
    diastolic: number | null;
    level: 'normal' | 'high' | 'very-high' | 'unknown';
    priority: number;
  };
  weight: {
    current: number | null;
    trend: 'gaining' | 'stable' | 'losing' | 'unknown';
    rate: number | null; // lbs per week
    level: 'normal' | 'concerning-gain' | 'high-gain' | 'rapid-loss' | 'unknown';
    priority: number;
  };
  overallPriority: number;
}

export interface MealRecommendation {
  recipe: Recipe;
  reason: string;
  priority: number;
  healthFlags: string[];
  confidence: number; // 0-1 score
}

export class MealRecommendationService {
  /**
   * Get comprehensive health status for a user
   */
  static async getHealthStatus(userId: string): Promise<HealthStatus> {
    try {
      // Get recent health readings (last 7 days for trends, last 30 for current status)
      const recentReadings = await HealthReadingsRepository.getAllReadings(userId, 50);

      const bloodSugarReadings = recentReadings.filter(r => r.type === 'bloodSugar');
      const bloodPressureReadings = recentReadings.filter(r => r.type === 'bloodPressure');
      const weightReadings = recentReadings.filter(r => r.type === 'weight');

      // Analyze blood sugar
      const bloodSugarStatus = this.analyzeBloodSugar(bloodSugarReadings);

      // Analyze blood pressure
      const bloodPressureStatus = this.analyzeBloodPressure(bloodPressureReadings);

      // Analyze weight trends
      const weightStatus = this.analyzeWeight(weightReadings);

      // Calculate overall priority
      const overallPriority = Math.max(
        bloodSugarStatus.priority,
        bloodPressureStatus.priority,
        weightStatus.priority
      );

      return {
        bloodSugar: bloodSugarStatus,
        bloodPressure: bloodPressureStatus,
        weight: weightStatus,
        overallPriority,
      };
    } catch (error) {
      console.error('Failed to get health status:', error);
      return this.getDefaultHealthStatus();
    }
  }

  /**
   * Get personalized meal recommendations based on health status
   */
  static async getPersonalizedRecommendations(
    userId: string,
    availableRecipes: Recipe[],
    maxRecommendations: number = 3
  ): Promise<MealRecommendation[]> {
    try {
      const healthStatus = await this.getHealthStatus(userId);

      const recommendations: MealRecommendation[] = [];

      for (const recipe of availableRecipes) {
        const recommendation = this.scoreRecipeForHealth(recipe, healthStatus);

        if (recommendation && recommendation.confidence > 0.3) { // Only include reasonably confident recommendations
          recommendations.push(recommendation);
        }
      }

      // Sort by priority and confidence
      recommendations.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.confidence - a.confidence;
      });

      return recommendations.slice(0, maxRecommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  /**
   * Score a recipe based on current health status
   */
  private static scoreRecipeForHealth(
    recipe: Recipe,
    healthStatus: HealthStatus
  ): MealRecommendation | null {
    const healthFlags: string[] = [];
    const reasons: string[] = [];
    let priority = 0;
    let confidence = 0;

    // Blood sugar analysis
    if (healthStatus.bloodSugar.level === 'high' || healthStatus.bloodSugar.level === 'very-high') {
      // Recommend low-GI, high-fiber options for high blood sugar
      if (recipe.nutrition.carbs < 30 && recipe.nutrition.fiber > 5) {
        healthFlags.push(RECIPE_HEALTH_FLAGS.LOW_GI, RECIPE_HEALTH_FLAGS.HIGH_FIBER);
        reasons.push('Low carb and high fiber to help stabilize blood sugar');
        priority = Math.max(priority, HEALTH_PRIORITIES.HIGH);
        confidence += 0.4;
      }

      if (recipe.tags.includes('high-protein')) {
        healthFlags.push(RECIPE_HEALTH_FLAGS.HIGH_PROTEIN);
        reasons.push('High protein content for better blood sugar control');
        confidence += 0.2;
      }
    }

    // Blood pressure analysis
    if (healthStatus.bloodPressure.level === 'high' || healthStatus.bloodPressure.level === 'very-high') {
      // Recommend low-sodium, heart-healthy options
      if (recipe.nutrition.sodium < 300) {
        healthFlags.push(RECIPE_HEALTH_FLAGS.LOW_SODIUM, RECIPE_HEALTH_FLAGS.HEART_HEALTHY);
        reasons.push('Lower sodium content for blood pressure management');
        priority = Math.max(priority, HEALTH_PRIORITIES.HIGH);
        confidence += 0.3;
      }
    }

    // Weight management analysis
    if (healthStatus.weight.level === 'concerning-gain' || healthStatus.weight.level === 'high-gain') {
      // Recommend lower calorie, higher protein options for weight management
      if (recipe.nutrition.calories < 400 && recipe.nutrition.protein > 15) {
        healthFlags.push(RECIPE_HEALTH_FLAGS.WEIGHT_MANAGEMENT, RECIPE_HEALTH_FLAGS.HIGH_PROTEIN);
        reasons.push('Balanced nutrition for healthy weight management');
        priority = Math.max(priority, HEALTH_PRIORITIES.MEDIUM);
        confidence += 0.3;
      }
    }

    // General health benefits
    if (recipe.nutrition.fiber > 8) {
      healthFlags.push(RECIPE_HEALTH_FLAGS.HIGH_FIBER);
      reasons.push('High fiber content supports digestive health');
      confidence += 0.1;
    }

    // If no specific health flags, but recipe is generally healthy
    if (healthFlags.length === 0 && recipe.nutrition.calories < 500 && recipe.nutrition.sugar < 10) {
      reasons.push('Nutritionally balanced option');
      confidence += 0.2;
    }

    if (reasons.length > 0) {
      return {
        recipe,
        reason: reasons.join('. '),
        priority,
        healthFlags,
        confidence: Math.min(confidence, 1.0),
      };
    }

    return null;
  }

  /**
   * Analyze blood sugar readings
   */
  private static analyzeBloodSugar(readings: HealthReading[]) {
    if (readings.length === 0) {
      return {
        current: null,
        trend: 'unknown' as const,
        level: 'unknown' as const,
        priority: HEALTH_PRIORITIES.LOW,
      };
    }

    const latest = readings[0];
    const current = latest.value;

    // Determine level
    let level: HealthStatus['bloodSugar']['level'] = 'normal';
    if (current >= HEALTH_THRESHOLDS.BLOOD_SUGAR.VERY_HIGH) {
      level = 'very-high';
    } else if (current >= HEALTH_THRESHOLDS.BLOOD_SUGAR.HIGH) {
      level = 'high';
    } else if (current <= HEALTH_THRESHOLDS.BLOOD_SUGAR.LOW) {
      level = 'low';
    }

    // Simple trend analysis (comparing last two readings)
    let trend: HealthStatus['bloodSugar']['trend'] = 'stable';
    if (readings.length >= 2) {
      const previous = readings[1].value;
      const change = current - previous;

      if (change > 20) trend = 'declining';
      else if (change < -20) trend = 'improving';
    }

    // Calculate priority based on level
    let priority: number = 0;
    if (level === 'very-high') priority = 3;
    else if (level === 'high') priority = 2;
    else if (level === 'low') priority = 1;

    return { current, trend, level, priority };
  }

  /**
   * Analyze blood pressure readings
   */
  private static analyzeBloodPressure(readings: HealthReading[]) {
    if (readings.length === 0) {
      return {
        systolic: null,
        diastolic: null,
        level: 'unknown' as const,
        priority: HEALTH_PRIORITIES.LOW,
      };
    }

    const latest = readings[0];
    const systolic = latest.metadata?.systolic || 120;
    const diastolic = latest.metadata?.diastolic || 80;

    // Determine level
    let level: HealthStatus['bloodPressure']['level'] = 'normal';
    if (systolic >= HEALTH_THRESHOLDS.BLOOD_PRESSURE.VERY_HIGH_SYSTOLIC ||
        diastolic >= HEALTH_THRESHOLDS.BLOOD_PRESSURE.VERY_HIGH_DIASTOLIC) {
      level = 'very-high';
    } else if (systolic >= HEALTH_THRESHOLDS.BLOOD_PRESSURE.HIGH_SYSTOLIC ||
               diastolic >= HEALTH_THRESHOLDS.BLOOD_PRESSURE.HIGH_DIASTOLIC) {
      level = 'high';
    }

    // Calculate priority
    let priority: number = 0;
    if (level === 'very-high') priority = 3;
    else if (level === 'high') priority = 2;

    return { systolic, diastolic, level, priority };
  }

  /**
   * Analyze weight trends
   */
  private static analyzeWeight(readings: HealthReading[]) {
    if (readings.length < 2) {
      return {
        current: null,
        trend: 'unknown' as const,
        rate: null,
        level: 'unknown' as const,
        priority: HEALTH_PRIORITIES.LOW,
      };
    }

    const sortedReadings = readings.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const current = sortedReadings[0].value;

    // Calculate weekly rate (rough approximation)
    const oldest = sortedReadings[sortedReadings.length - 1];
    const daysDiff = (new Date(sortedReadings[0].timestamp).getTime() -
                     new Date(oldest.timestamp).getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff < 7) {
      return {
        current,
        trend: 'unknown' as const,
        rate: null,
        level: 'unknown' as const,
        priority: HEALTH_PRIORITIES.LOW,
      };
    }

    const weightChange = current - oldest.value;
    const weeklyRate = (weightChange / daysDiff) * 7;

    // Determine trend and level
    let trend: HealthStatus['weight']['trend'] = 'stable';
    let level: HealthStatus['weight']['level'] = 'normal';

    if (weeklyRate > HEALTH_THRESHOLDS.WEIGHT.WEEKLY_GAIN_HIGH) {
      trend = 'gaining';
      level = 'high-gain';
    } else if (weeklyRate > HEALTH_THRESHOLDS.WEIGHT.WEEKLY_GAIN_CONCERNING) {
      trend = 'gaining';
      level = 'concerning-gain';
    } else if (weeklyRate < HEALTH_THRESHOLDS.WEIGHT.WEEKLY_LOSS_CONCERNING) {
      trend = 'losing';
      level = 'rapid-loss';
    } else if (Math.abs(weeklyRate) > 0.5) {
      trend = weeklyRate > 0 ? 'gaining' : 'losing';
    }

    // Calculate priority
    let priority: number = 0;
    if (level === 'high-gain') priority = 3;
    else if (level === 'concerning-gain' || level === 'rapid-loss') priority = 2;

    return { current, trend, rate: weeklyRate, level, priority };
  }

  /**
   * Get default health status when no data is available
   */
  private static getDefaultHealthStatus(): HealthStatus {
    return {
      bloodSugar: {
        current: null,
        trend: 'unknown',
        level: 'unknown',
        priority: HEALTH_PRIORITIES.LOW,
      },
      bloodPressure: {
        systolic: null,
        diastolic: null,
        level: 'unknown',
        priority: HEALTH_PRIORITIES.LOW,
      },
      weight: {
        current: null,
        trend: 'unknown',
        rate: null,
        level: 'unknown',
        priority: HEALTH_PRIORITIES.LOW,
      },
      overallPriority: HEALTH_PRIORITIES.LOW,
    };
  }
}
