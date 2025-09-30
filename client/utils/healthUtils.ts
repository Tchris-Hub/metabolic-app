export const calculateBMI = (weight: number, height: number): number => {
  // Weight in kg, height in cm
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getBMIColor = (bmi: number): string => {
  if (bmi < 18.5) return '#2196F3'; // Blue
  if (bmi < 25) return '#4CAF50'; // Green
  if (bmi < 30) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export const getBloodSugarCategory = (value: number, unit: 'mg/dL' | 'mmol/L'): string => {
  let mgdL: number;
  
  if (unit === 'mmol/L') {
    mgdL = value * 18.0182; // Convert mmol/L to mg/dL
  } else {
    mgdL = value;
  }
  
  if (mgdL < 70) return 'Low';
  if (mgdL < 100) return 'Normal';
  if (mgdL < 126) return 'Pre-diabetes';
  return 'Diabetes';
};

export const getBloodSugarColor = (value: number, unit: 'mg/dL' | 'mmol/L'): string => {
  let mgdL: number;
  
  if (unit === 'mmol/L') {
    mgdL = value * 18.0182;
  } else {
    mgdL = value;
  }
  
  if (mgdL < 70) return '#F44336'; // Red
  if (mgdL < 100) return '#4CAF50'; // Green
  if (mgdL < 126) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

export const getBloodPressureCategory = (systolic: number, diastolic: number): string => {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 && diastolic < 90) return 'High Stage 1';
  if (systolic < 180 && diastolic < 120) return 'High Stage 2';
  return 'Hypertensive Crisis';
};

export const getBloodPressureColor = (systolic: number, diastolic: number): string => {
  if (systolic < 120 && diastolic < 80) return '#4CAF50'; // Green
  if (systolic < 130 && diastolic < 80) return '#FF9800'; // Orange
  if (systolic < 140 && diastolic < 90) return '#FF5722'; // Deep Orange
  if (systolic < 180 && diastolic < 120) return '#F44336'; // Red
  return '#D32F2F'; // Dark Red
};

export const convertWeight = (weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number => {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  
  return weight;
};

export const convertHeight = (height: number, fromUnit: 'cm' | 'ft', toUnit: 'cm' | 'ft'): number => {
  if (fromUnit === toUnit) return height;
  
  if (fromUnit === 'cm' && toUnit === 'ft') {
    return height / 30.48;
  } else if (fromUnit === 'ft' && toUnit === 'cm') {
    return height * 30.48;
  }
  
  return height;
};

export const convertBloodSugar = (value: number, fromUnit: 'mg/dL' | 'mmol/L', toUnit: 'mg/dL' | 'mmol/L'): number => {
  if (fromUnit === toUnit) return value;
  
  if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
    return value / 18.0182;
  } else if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
    return value * 18.0182;
  }
  
  return value;
};

export const getTargetBloodSugar = (age: number, hasDiabetes: boolean): { min: number; max: number; unit: 'mg/dL' | 'mmol/L' } => {
  if (hasDiabetes) {
    return { min: 80, max: 130, unit: 'mg/dL' };
  } else {
    if (age < 18) {
      return { min: 70, max: 100, unit: 'mg/dL' };
    } else {
      return { min: 70, max: 100, unit: 'mg/dL' };
    }
  }
};

export const getTargetBloodPressure = (age: number): { systolic: { min: number; max: number }; diastolic: { min: number; max: number } } => {
  if (age < 18) {
    return { systolic: { min: 90, max: 120 }, diastolic: { min: 50, max: 80 } };
  } else if (age < 65) {
    return { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } };
  } else {
    return { systolic: { min: 90, max: 130 }, diastolic: { min: 60, max: 80 } };
  }
};

export const getTargetWeight = (height: number, age: number, gender: 'male' | 'female'): { min: number; max: number } => {
  const bmiMin = 18.5;
  const bmiMax = 24.9;
  
  const heightInMeters = height / 100;
  const minWeight = bmiMin * (heightInMeters * heightInMeters);
  const maxWeight = bmiMax * (heightInMeters * heightInMeters);
  
  return { min: minWeight, max: maxWeight };
};

export const getCalorieGoal = (age: number, gender: 'male' | 'female', weight: number, height: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'): number => {
  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

export const getWaterGoal = (weight: number, activityLevel: 'low' | 'moderate' | 'high'): number => {
  // Base water intake: 35ml per kg of body weight
  let baseWater = weight * 35;
  
  // Adjust for activity level
  const activityMultipliers = {
    low: 1.0,
    moderate: 1.2,
    high: 1.5,
  };
  
  return Math.round(baseWater * activityMultipliers[activityLevel]);
};

export const getStepGoal = (age: number, fitnessLevel: 'beginner' | 'intermediate' | 'advanced'): number => {
  const baseSteps = 10000;
  
  if (age < 18) {
    return baseSteps;
  } else if (age < 65) {
    const fitnessMultipliers = {
      beginner: 0.8,
      intermediate: 1.0,
      advanced: 1.2,
    };
    return Math.round(baseSteps * fitnessMultipliers[fitnessLevel]);
  } else {
    return Math.round(baseSteps * 0.8);
  }
};

export const getSleepGoal = (age: number): { min: number; max: number } => {
  if (age < 18) {
    return { min: 8, max: 10 };
  } else if (age < 65) {
    return { min: 7, max: 9 };
  } else {
    return { min: 7, max: 8 };
  }
};

export const calculateHeartRateZones = (age: number): { resting: number; max: number; zones: { [key: string]: { min: number; max: number } } } => {
  const maxHeartRate = 220 - age;
  const restingHeartRate = 60; // Average resting heart rate
  
  return {
    resting: restingHeartRate,
    max: maxHeartRate,
    zones: {
      'Very Light': { min: restingHeartRate, max: Math.round(maxHeartRate * 0.5) },
      'Light': { min: Math.round(maxHeartRate * 0.5), max: Math.round(maxHeartRate * 0.6) },
      'Moderate': { min: Math.round(maxHeartRate * 0.6), max: Math.round(maxHeartRate * 0.7) },
      'Vigorous': { min: Math.round(maxHeartRate * 0.7), max: Math.round(maxHeartRate * 0.85) },
      'Maximum': { min: Math.round(maxHeartRate * 0.85), max: maxHeartRate },
    },
  };
};

export const getHealthScore = (readings: { [key: string]: number }): number => {
  let score = 100;
  
  // Blood sugar score (0-25 points)
  if (readings.bloodSugar) {
    const bloodSugarCategory = getBloodSugarCategory(readings.bloodSugar, 'mg/dL');
    if (bloodSugarCategory === 'Normal') score -= 0;
    else if (bloodSugarCategory === 'Pre-diabetes') score -= 10;
    else if (bloodSugarCategory === 'Diabetes') score -= 20;
    else score -= 25;
  }
  
  // Blood pressure score (0-25 points)
  if (readings.systolic && readings.diastolic) {
    const bpCategory = getBloodPressureCategory(readings.systolic, readings.diastolic);
    if (bpCategory === 'Normal') score -= 0;
    else if (bpCategory === 'Elevated') score -= 5;
    else if (bpCategory === 'High Stage 1') score -= 10;
    else if (bpCategory === 'High Stage 2') score -= 20;
    else score -= 25;
  }
  
  // BMI score (0-25 points)
  if (readings.weight && readings.height) {
    const bmi = calculateBMI(readings.weight, readings.height);
    const bmiCategory = getBMICategory(bmi);
    if (bmiCategory === 'Normal weight') score -= 0;
    else if (bmiCategory === 'Underweight') score -= 5;
    else if (bmiCategory === 'Overweight') score -= 10;
    else score -= 20;
  }
  
  // Activity score (0-25 points)
  if (readings.steps) {
    const stepGoal = 10000;
    const stepPercentage = (readings.steps / stepGoal) * 100;
    if (stepPercentage >= 100) score -= 0;
    else if (stepPercentage >= 80) score -= 5;
    else if (stepPercentage >= 60) score -= 10;
    else if (stepPercentage >= 40) score -= 15;
    else score -= 25;
  }
  
  return Math.max(0, score);
};

export const getHealthRecommendations = (readings: { [key: string]: number }, age: number, gender: 'male' | 'female'): string[] => {
  const recommendations: string[] = [];
  
  // Blood sugar recommendations
  if (readings.bloodSugar) {
    const bloodSugarCategory = getBloodSugarCategory(readings.bloodSugar, 'mg/dL');
    if (bloodSugarCategory === 'Low') {
      recommendations.push('Consider eating a small snack to raise your blood sugar');
    } else if (bloodSugarCategory === 'Pre-diabetes') {
      recommendations.push('Focus on a balanced diet and regular exercise to prevent diabetes');
    } else if (bloodSugarCategory === 'Diabetes') {
      recommendations.push('Consult with your healthcare provider about diabetes management');
    }
  }
  
  // Blood pressure recommendations
  if (readings.systolic && readings.diastolic) {
    const bpCategory = getBloodPressureCategory(readings.systolic, readings.diastolic);
    if (bpCategory !== 'Normal') {
      recommendations.push('Consider reducing sodium intake and increasing physical activity');
    }
  }
  
  // BMI recommendations
  if (readings.weight && readings.height) {
    const bmi = calculateBMI(readings.weight, readings.height);
    const bmiCategory = getBMICategory(bmi);
    if (bmiCategory === 'Underweight') {
      recommendations.push('Consider consulting a nutritionist to develop a healthy weight gain plan');
    } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
      recommendations.push('Focus on a balanced diet and regular exercise for healthy weight management');
    }
  }
  
  // Activity recommendations
  if (readings.steps) {
    const stepGoal = 10000;
    if (readings.steps < stepGoal * 0.8) {
      recommendations.push('Try to increase your daily step count for better health');
    }
  }
  
  return recommendations;
};

