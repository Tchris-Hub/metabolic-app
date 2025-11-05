import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationSettings {
  medicationReminders: boolean;
  bloodSugarReminders: boolean;
  exerciseReminders: boolean;
  hydrationReminders: boolean;
  dailyTips: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
}

interface HealthSettings {
  bloodSugarUnit: 'mg/dL' | 'mmol/L';
  bloodPressureUnit: 'mmHg' | 'kPa';
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft';
  temperatureUnit: 'C' | 'F';
  distanceUnit: 'km' | 'miles';
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  crashReporting: boolean;
  personalizedAds: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  hapticFeedback: boolean;
  soundEffects: boolean;
  autoSync: boolean;
  offlineMode: boolean;
}

interface SettingsState {
  notifications: NotificationSettings;
  health: HealthSettings;
  privacy: PrivacySettings;
  app: AppSettings;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: SettingsState = {
  notifications: {
    medicationReminders: true,
    bloodSugarReminders: true,
    exerciseReminders: true,
    hydrationReminders: true,
    dailyTips: true,
    weeklyReports: true,
    achievementNotifications: true,
  },
  health: {
    bloodSugarUnit: 'mg/dL',
    bloodPressureUnit: 'mmHg',
    weightUnit: 'kg',
    heightUnit: 'cm',
    temperatureUnit: 'C',
    distanceUnit: 'km',
  },
  privacy: {
    dataSharing: false,
    analytics: true,
    crashReporting: true,
    personalizedAds: false,
  },
  app: {
    theme: 'system',
    language: 'en',
    fontSize: 'medium',
    hapticFeedback: true,
    soundEffects: true,
    autoSync: true,
    offlineMode: false,
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateHealthSettings: (state, action: PayloadAction<Partial<HealthSettings>>) => {
      state.health = { ...state.health, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updatePrivacySettings: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    updateAppSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.app = { ...state.app, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    resetNotificationSettings: (state) => {
      state.notifications = initialState.notifications;
      state.lastUpdated = new Date().toISOString();
    },
    resetHealthSettings: (state) => {
      state.health = initialState.health;
      state.lastUpdated = new Date().toISOString();
    },
    resetPrivacySettings: (state) => {
      state.privacy = initialState.privacy;
      state.lastUpdated = new Date().toISOString();
    },
    resetAppSettings: (state) => {
      state.app = initialState.app;
      state.lastUpdated = new Date().toISOString();
    },
    resetAllSettings: (state) => {
      state.notifications = initialState.notifications;
      state.health = initialState.health;
      state.privacy = initialState.privacy;
      state.app = initialState.app;
      state.lastUpdated = new Date().toISOString();
    },
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      if (action.payload.notifications) {
        state.notifications = { ...state.notifications, ...action.payload.notifications };
      }
      if (action.payload.health) {
        state.health = { ...state.health, ...action.payload.health };
      }
      if (action.payload.privacy) {
        state.privacy = { ...state.privacy, ...action.payload.privacy };
      }
      if (action.payload.app) {
        state.app = { ...state.app, ...action.payload.app };
      }
      state.lastUpdated = action.payload.lastUpdated || new Date().toISOString();
    },
  },
});

export const {
  clearError,
  setLoading,
  updateNotificationSettings,
  updateHealthSettings,
  updatePrivacySettings,
  updateAppSettings,
  resetNotificationSettings,
  resetHealthSettings,
  resetPrivacySettings,
  resetAppSettings,
  resetAllSettings,
  loadSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;

