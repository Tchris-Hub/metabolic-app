export type HealthReadingType = 
  | 'bloodSugar' 
  | 'bloodPressure' 
  | 'weight' 
  | 'activity' 
  | 'heartRate' 
  | 'sleep' 
  | 'water' 
  | 'medication';

export type HealthUnit = 
  | 'mg/dL' 
  | 'mmol/L' 
  | 'mmHg' 
  | 'kPa' 
  | 'kg' 
  | 'lbs' 
  | 'cm' 
  | 'ft' 
  | 'bpm' 
  | 'hours' 
  | 'ml' 
  | 'oz';

export interface HealthReading {
  id: string;
  userId: string;
  type: HealthReadingType;
  value: number;
  unit: HealthUnit;
  timestamp: Date;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BloodSugarReading extends HealthReading {
  type: 'bloodSugar';
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  mealType?: 'fasting' | 'pre-meal' | 'post-meal' | 'random';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface BloodPressureReading extends HealthReading {
  type: 'bloodPressure';
  systolic: number;
  diastolic: number;
  unit: 'mmHg' | 'kPa';
  position?: 'sitting' | 'standing' | 'lying';
  arm?: 'left' | 'right';
}

export interface WeightReading extends HealthReading {
  type: 'weight';
  value: number;
  unit: 'kg' | 'lbs';
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
}

export interface ActivityReading extends HealthReading {
  type: 'activity';
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRate?: number;
  exerciseType?: string;
  duration?: number;
}

export interface HeartRateReading extends HealthReading {
  type: 'heartRate';
  value: number;
  unit: 'bpm';
  resting?: boolean;
  exercise?: boolean;
  stress?: boolean;
}

export interface SleepReading extends HealthReading {
  type: 'sleep';
  value: number;
  unit: 'hours';
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep?: number;
  remSleep?: number;
  lightSleep?: number;
  awake?: number;
}

export interface WaterReading extends HealthReading {
  type: 'water';
  value: number;
  unit: 'ml' | 'oz';
  beverageType?: 'water' | 'coffee' | 'tea' | 'juice' | 'soda';
}

export interface MedicationReading extends HealthReading {
  type: 'medication';
  medicationName: string;
  dosage: number;
  unit: string;
  taken: boolean;
  sideEffects?: string[];
  notes?: string;
}

export interface HealthTrend {
  type: HealthReadingType;
  direction: 'up' | 'down' | 'stable';
  change: number;
  changePercent: number;
  period: '7d' | '30d' | '90d';
  average: number;
  target?: number;
  status: 'good' | 'warning' | 'danger';
}

export interface HealthGoal {
  id: string;
  userId: string;
  type: HealthReadingType;
  target: number;
  unit: HealthUnit;
  deadline?: Date;
  achieved: boolean;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthAlert {
  id: string;
  userId: string;
  type: HealthReadingType;
  condition: 'high' | 'low' | 'normal';
  threshold: number;
  unit: HealthUnit;
  message: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthSummary {
  date: Date;
  bloodSugar?: {
    average: number;
    min: number;
    max: number;
    readings: number;
  };
  bloodPressure?: {
    averageSystolic: number;
    averageDiastolic: number;
    minSystolic: number;
    maxSystolic: number;
    readings: number;
  };
  weight?: {
    current: number;
    change: number;
    changePercent: number;
  };
  activity?: {
    steps: number;
    calories: number;
    distance: number;
    activeMinutes: number;
  };
  sleep?: {
    hours: number;
    quality: string;
    deepSleep: number;
    remSleep: number;
  };
  water?: {
    total: number;
    goal: number;
    percentage: number;
  };
}

export interface HealthInsight {
  id: string;
  userId: string;
  type: 'trend' | 'pattern' | 'recommendation' | 'alert';
  title: string;
  description: string;
  data: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthReport {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  summary: HealthSummary;
  trends: HealthTrend[];
  insights: HealthInsight[];
  goals: HealthGoal[];
  createdAt: Date;
}

export interface HealthDataState {
  readings: HealthReading[];
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  bloodSugarReadings: BloodSugarReading[];
  bloodPressureReadings: BloodPressureReading[];
  weightReadings: WeightReading[];
  activityReadings: ActivityReading[];
  heartRateReadings: HeartRateReading[];
  sleepReadings: SleepReading[];
  waterReadings: WaterReading[];
  medicationReadings: MedicationReading[];
}

export interface HealthContextType {
  readings: HealthReading[];
  isLoading: boolean;
  error: string | null;
  saveReading: (reading: Omit<HealthReading, 'id'>) => Promise<HealthReading>;
  getReadings: (type?: HealthReadingType, limit?: number) => Promise<HealthReading[]>;
  updateReading: (id: string, data: Partial<HealthReading>) => Promise<HealthReading>;
  deleteReading: (id: string) => Promise<void>;
  getTrend: (type: HealthReadingType, period: '7d' | '30d' | '90d') => Promise<HealthTrend>;
  getSummary: (date: Date) => Promise<HealthSummary>;
  clearError: () => void;
}

