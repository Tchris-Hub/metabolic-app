// Health thresholds for meal recommendations
export const HEALTH_THRESHOLDS = {
  BLOOD_SUGAR: {
    HIGH: 140, // mg/dL - concerning level
    VERY_HIGH: 180, // mg/dL - urgent attention needed
    LOW: 70, // mg/dL - concerning level
    TARGET_RANGE: { min: 80, max: 130 }, // mg/dL - optimal range
  },
  BLOOD_PRESSURE: {
    HIGH_SYSTOLIC: 130, // mmHg
    HIGH_DIASTOLIC: 80, // mmHg
    VERY_HIGH_SYSTOLIC: 140, // mmHg
    VERY_HIGH_DIASTOLIC: 90, // mmHg
  },
  WEIGHT: {
    WEEKLY_GAIN_CONCERNING: 1.0, // lbs per week
    WEEKLY_GAIN_HIGH: 2.0, // lbs per week
    WEEKLY_LOSS_CONCERNING: -2.0, // lbs per week (too rapid)
  },
} as const;

// Recipe health compatibility indicators
export const RECIPE_HEALTH_FLAGS = {
  BLOOD_SUGAR_FRIENDLY: 'blood-sugar-friendly',
  WEIGHT_MANAGEMENT: 'weight-management',
  BLOOD_PRESSURE_FRIENDLY: 'blood-pressure-friendly',
  LOW_GI: 'low-gi',
  HIGH_FIBER: 'high-fiber',
  HIGH_PROTEIN: 'high-protein',
  LOW_SODIUM: 'low-sodium',
  HEART_HEALTHY: 'heart-healthy',
} as const;

// Health recommendation priorities
export const HEALTH_PRIORITIES = {
  CRITICAL: 3, // Immediate health concerns
  HIGH: 2,     // Concerning trends
  MEDIUM: 1,   // General wellness
  LOW: 0,      // No specific concerns
} as const;
