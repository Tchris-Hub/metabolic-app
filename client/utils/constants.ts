// App Colors
export const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Health-specific colors
  bloodSugar: {
    low: '#F44336',
    normal: '#4CAF50',
    high: '#FF9800',
    veryHigh: '#F44336',
  },
  bloodPressure: {
    normal: '#4CAF50',
    elevated: '#FF9800',
    high: '#F44336',
    crisis: '#D32F2F',
  },
  bmi: {
    underweight: '#2196F3',
    normal: '#4CAF50',
    overweight: '#FF9800',
    obese: '#F44336',
  },
  
  // UI Colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    hint: '#BDBDBD',
  },
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  // Gradient colors
  gradient: {
    primary: ['#2196F3', '#4CAF50'],
    secondary: ['#FF9800', '#F44336'],
    success: ['#4CAF50', '#8BC34A'],
    warning: ['#FF9800', '#FFC107'],
  },
};

// App Sizes
export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Border radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    title: 24,
    heading: 28,
    display: 32,
  },
  
  // Icon sizes
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Button sizes
  button: {
    sm: { height: 32, padding: 8 },
    md: { height: 40, padding: 12 },
    lg: { height: 48, padding: 16 },
    xl: { height: 56, padding: 20 },
  },
  
  // Input sizes
  input: {
    sm: { height: 32, padding: 8 },
    md: { height: 40, padding: 12 },
    lg: { height: 48, padding: 16 },
  },
  
  // Card sizes
  card: {
    sm: { padding: 12, margin: 8 },
    md: { padding: 16, margin: 12 },
    lg: { padding: 20, margin: 16 },
  },
};

// App Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Health Constants
export const HEALTH_CONSTANTS = {
  // Blood sugar ranges (mg/dL)
  bloodSugar: {
    low: 70,
    normal: 100,
    preDiabetes: 126,
    diabetes: 200,
  },
  
  // Blood pressure ranges (mmHg)
  bloodPressure: {
    normal: { systolic: 120, diastolic: 80 },
    elevated: { systolic: 130, diastolic: 80 },
    highStage1: { systolic: 140, diastolic: 90 },
    highStage2: { systolic: 180, diastolic: 120 },
  },
  
  // BMI ranges
  bmi: {
    underweight: 18.5,
    normal: 25,
    overweight: 30,
  },
  
  // Heart rate ranges (bpm)
  heartRate: {
    resting: 60,
    max: 220,
    target: { min: 50, max: 85 },
  },
  
  // Activity goals
  activity: {
    steps: 10000,
    calories: 2000,
    distance: 8, // km
    activeMinutes: 30,
  },
  
  // Sleep goals (hours)
  sleep: {
    min: 7,
    max: 9,
    optimal: 8,
  },
  
  // Water intake (ml)
  water: {
    min: 2000,
    max: 4000,
    optimal: 2500,
  },
};

// App Configuration
export const APP_CONFIG = {
  name: 'Metabolic Health Assistant',
  version: '1.0.0',
  description: 'A comprehensive health tracking app for diabetes and metabolic syndrome management',
  
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.healthapp.com',
    timeout: 30000,
    retries: 3,
  },
  
  // Firebase Configuration
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
  
  // AdMob Configuration
  admob: {
    bannerAdUnitId: process.env.EXPO_PUBLIC_ADMOB_BANNER_AD_UNIT_ID,
    interstitialAdUnitId: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID,
    rewardedAdUnitId: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID,
  },
  
  // Feature Flags
  features: {
    healthKit: true,
    googleFit: true,
    notifications: true,
    ads: true,
    premium: true,
    offline: true,
  },
  
  // Limits
  limits: {
    maxReadingsPerDay: 100,
    maxMealPlans: 50,
    maxFavorites: 100,
    maxRecentItems: 20,
    maxNotifications: 1000,
  },
};

// Navigation Constants
export const NAVIGATION = {
  // Tab names
  tabs: {
    home: 'Home',
    log: 'Log',
    meal: 'Meal',
    learn: 'Learn',
    more: 'More',
  },
  
  // Screen names
  screens: {
    // Auth screens
    onboarding: 'Onboarding',
    welcome: 'Welcome',
    login: 'Login',
    signup: 'Signup',
    verification: 'Verification',
    profile: 'Profile',
    goals: 'Goals',
    
    // Main screens
    home: 'Home',
    log: 'Log',
    meal: 'Meal',
    learn: 'Learn',
    more: 'More',
    
    // Health screens
    bloodSugar: 'BloodSugar',
    bloodPressure: 'BloodPressure',
    weight: 'Weight',
    activity: 'Activity',
    
    // Nutrition screens
    mealPlan: 'MealPlan',
    recipe: 'Recipe',
    foodSearch: 'FoodSearch',
    
    // Education screens
    article: 'Article',
    quiz: 'Quiz',
    redFlags: 'RedFlags',
    
    // Settings screens
    settings: 'Settings',
    premium: 'Premium',
  },
};

// Animation Constants
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  spring: {
    tension: 100,
    friction: 8,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  // User data
  user: 'user',
  profile: 'profile',
  settings: 'settings',
  
  // Health data
  healthReadings: 'healthReadings',
  mealPlans: 'mealPlans',
  favorites: 'favorites',
  
  // App state
  onboarding: 'onboarding',
  theme: 'theme',
  language: 'language',
  
  // Cache
  cache: 'cache',
  lastSync: 'lastSync',
};

// Error Messages
export const ERROR_MESSAGES = {
  // Network errors
  network: 'Network connection failed. Please check your internet connection.',
  timeout: 'Request timed out. Please try again.',
  server: 'Server error. Please try again later.',
  
  // Authentication errors
  auth: {
    invalidCredentials: 'Invalid email or password.',
    userNotFound: 'User not found.',
    emailInUse: 'Email is already in use.',
    weakPassword: 'Password is too weak.',
    emailNotVerified: 'Please verify your email address.',
  },
  
  // Validation errors
  validation: {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters long.',
    phone: 'Please enter a valid phone number.',
    date: 'Please enter a valid date.',
  },
  
  // Health data errors
  health: {
    invalidReading: 'Invalid health reading value.',
    duplicateReading: 'Reading already exists for this time.',
    futureDate: 'Cannot log readings for future dates.',
  },
  
  // General errors
  general: {
    unknown: 'An unknown error occurred.',
    permission: 'Permission denied.',
    notFound: 'Resource not found.',
    unauthorized: 'Unauthorized access.',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  auth: {
    signup: 'Account created successfully!',
    login: 'Welcome back!',
    logout: 'Logged out successfully.',
    passwordReset: 'Password reset email sent.',
    emailVerification: 'Verification email sent.',
  },
  
  // Health data
  health: {
    readingSaved: 'Health reading saved successfully.',
    readingUpdated: 'Health reading updated successfully.',
    readingDeleted: 'Health reading deleted successfully.',
  },
  
  // Profile
  profile: {
    updated: 'Profile updated successfully.',
    photoUpdated: 'Profile photo updated successfully.',
  },
  
  // Settings
  settings: {
    updated: 'Settings updated successfully.',
    reset: 'Settings reset to default.',
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  reminder: 'reminder',
  achievement: 'achievement',
  tip: 'tip',
  general: 'general',
};

// Health Reading Types
export const HEALTH_READING_TYPES = {
  bloodSugar: 'bloodSugar',
  bloodPressure: 'bloodPressure',
  weight: 'weight',
  activity: 'activity',
  heartRate: 'heartRate',
  sleep: 'sleep',
  water: 'water',
  medication: 'medication',
};

// Meal Types
export const MEAL_TYPES = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  snack: 'snack',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

// Activity Levels
export const ACTIVITY_LEVELS = {
  sedentary: 'sedentary',
  light: 'light',
  moderate: 'moderate',
  active: 'active',
  veryActive: 'very_active',
};

// Gender Options
export const GENDER_OPTIONS = {
  male: 'male',
  female: 'female',
  other: 'other',
};

// Units
export const UNITS = {
  weight: ['kg', 'lbs'],
  height: ['cm', 'ft'],
  bloodSugar: ['mg/dL', 'mmol/L'],
  bloodPressure: ['mmHg', 'kPa'],
  temperature: ['C', 'F'],
  distance: ['km', 'miles'],
  water: ['ml', 'oz'],
};

// Languages
export const LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

// Themes
export const THEMES = {
  light: 'light',
  dark: 'dark',
  system: 'system',
};

// Font Sizes
export const FONT_SIZES = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

