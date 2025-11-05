import { HealthReadingsRepository, HealthReading } from '../services/supabase/repositories/HealthReadingsRepository';

export interface CurrentUserHealth {
  userId: string;
  lastBloodSugar?: number;
  lastBloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  lastWeight?: number;
  recentTrends: {
    bloodSugar: 'improving' | 'stable' | 'declining' | 'unknown';
    weight: 'gaining' | 'stable' | 'losing' | 'unknown';
  };
  hasRecentData: boolean;
  lastUpdated: Date | null;
}

export class HealthAggregationService {
  /**
   * Get current user's health context
   */
  static async getCurrentUserHealth(userId: string): Promise<CurrentUserHealth> {
    try {
      // Get recent readings (last 30 days for comprehensive view)
      const recentReadings = await HealthReadingsRepository.getAllReadings(userId, 100);

      const bloodSugarReadings = recentReadings.filter(r => r.type === 'bloodSugar');
      const bloodPressureReadings = recentReadings.filter(r => r.type === 'bloodPressure');
      const weightReadings = recentReadings.filter(r => r.type === 'weight');

      // Get latest values
      const lastBloodSugar = bloodSugarReadings.length > 0 ? bloodSugarReadings[0].value : undefined;
      const lastBloodPressure = bloodPressureReadings.length > 0
        ? {
            systolic: bloodPressureReadings[0].metadata?.systolic || 120,
            diastolic: bloodPressureReadings[0].metadata?.diastolic || 80,
          }
        : undefined;
      const lastWeight = weightReadings.length > 0 ? weightReadings[0].value : undefined;

      // Calculate recent trends (last 7 days vs previous week)
      const trends = this.calculateRecentTrends(bloodSugarReadings, weightReadings);

      // Check if user has recent data (within last 3 days)
      const hasRecentData = this.hasRecentData(recentReadings);

      const lastUpdated = recentReadings.length > 0
        ? new Date(recentReadings[0].timestamp)
        : null;

      return {
        userId,
        lastBloodSugar,
        lastBloodPressure,
        lastWeight,
        recentTrends: trends,
        hasRecentData,
        lastUpdated,
      };
    } catch (error) {
      console.error('Failed to get current user health:', error);
      return {
        userId,
        recentTrends: {
          bloodSugar: 'unknown',
          weight: 'unknown',
        },
        hasRecentData: false,
        lastUpdated: null,
      };
    }
  }

  /**
   * Get simplified health summary for quick checks
   */
  static async getHealthSummary(userId: string): Promise<{
    needsAttention: boolean;
    primaryConcerns: string[];
    lastCheckup: Date | null;
  }> {
    try {
      const health = await this.getCurrentUserHealth(userId);

      const concerns: string[] = [];
      let needsAttention = false;

      // Check blood sugar
      if (health.lastBloodSugar) {
        if (health.lastBloodSugar > 180) {
          concerns.push('Very high blood sugar');
          needsAttention = true;
        } else if (health.lastBloodSugar > 140) {
          concerns.push('Elevated blood sugar');
          needsAttention = true;
        } else if (health.lastBloodSugar < 70) {
          concerns.push('Low blood sugar');
          needsAttention = true;
        }
      }

      // Check blood pressure
      if (health.lastBloodPressure) {
        const { systolic, diastolic } = health.lastBloodPressure;
        if (systolic >= 140 || diastolic >= 90) {
          concerns.push('High blood pressure');
          needsAttention = true;
        }
      }

      // Check weight trends
      if (health.recentTrends.weight === 'gaining' && !concerns.includes('Weight management')) {
        concerns.push('Recent weight gain');
      }

      return {
        needsAttention,
        primaryConcerns: concerns,
        lastCheckup: health.lastUpdated,
      };
    } catch (error) {
      console.error('Failed to get health summary:', error);
      return {
        needsAttention: false,
        primaryConcerns: [],
        lastCheckup: null,
      };
    }
  }

  /**
   * Calculate recent trends by comparing last week with previous period
   */
  private static calculateRecentTrends(
    bloodSugarReadings: HealthReading[],
    weightReadings: HealthReading[]
  ): { bloodSugar: CurrentUserHealth['recentTrends']['bloodSugar']; weight: CurrentUserHealth['recentTrends']['weight'] } {

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Blood sugar trend
    let bloodSugarTrend: CurrentUserHealth['recentTrends']['bloodSugar'] = 'unknown';

    if (bloodSugarReadings.length >= 2) {
      const recentReadings = bloodSugarReadings.filter(r => new Date(r.timestamp) >= sevenDaysAgo);
      const olderReadings = bloodSugarReadings.filter(r =>
        new Date(r.timestamp) >= fourteenDaysAgo && new Date(r.timestamp) < sevenDaysAgo
      );

      if (recentReadings.length > 0 && olderReadings.length > 0) {
        const recentAvg = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length;
        const olderAvg = olderReadings.reduce((sum, r) => sum + r.value, 0) / olderReadings.length;

        const change = recentAvg - olderAvg;

        if (Math.abs(change) > 10) { // Significant change
          bloodSugarTrend = change > 0 ? 'declining' : 'improving';
        } else {
          bloodSugarTrend = 'stable';
        }
      }
    }

    // Weight trend
    let weightTrend: CurrentUserHealth['recentTrends']['weight'] = 'unknown';

    if (weightReadings.length >= 2) {
      const recentReadings = weightReadings.filter(r => new Date(r.timestamp) >= sevenDaysAgo);
      const olderReadings = weightReadings.filter(r =>
        new Date(r.timestamp) >= fourteenDaysAgo && new Date(r.timestamp) < sevenDaysAgo
      );

      if (recentReadings.length > 0 && olderReadings.length > 0) {
        const recentAvg = recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length;
        const olderAvg = olderReadings.reduce((sum, r) => sum + r.value, 0) / olderReadings.length;

        const change = recentAvg - olderAvg;

        if (Math.abs(change) > 0.5) { // Significant change (>0.5 lbs)
          weightTrend = change > 0 ? 'gaining' : 'losing';
        } else {
          weightTrend = 'stable';
        }
      }
    }

    return { bloodSugar: bloodSugarTrend, weight: weightTrend };
  }

  /**
   * Check if user has recent health data
   */
  private static hasRecentData(readings: HealthReading[]): boolean {
    if (readings.length === 0) return false;

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return readings.some(reading => new Date(reading.timestamp) >= threeDaysAgo);
  }
}
