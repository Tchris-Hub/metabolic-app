export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Verification: { email: string };
  Profile: undefined;
  Goals: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Log: undefined;
  Meal: undefined;
  Learn: undefined;
  More: undefined;
};

export type HealthStackParamList = {
  BloodSugar: undefined;
  BloodPressure: undefined;
  Weight: undefined;
  Activity: undefined;
  HeartRate: undefined;
  Sleep: undefined;
  Water: undefined;
  Medication: undefined;
};

export type NutritionStackParamList = {
  MealPlan: undefined;
  Recipe: { id: string };
  FoodSearch: undefined;
  FoodLog: undefined;
};

export type EducationStackParamList = {
  Article: { id: string };
  Quiz: { id: string };
  RedFlags: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Premium: undefined;
  Notifications: undefined;
  Privacy: undefined;
  About: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type AuthNavigationProps<T extends keyof AuthStackParamList> = {
  navigation: NavigationProp<AuthStackParamList, T>;
  route: RouteProp<AuthStackParamList, T>;
};

export type MainTabNavigationProps<T extends keyof MainTabParamList> = {
  navigation: NavigationProp<MainTabParamList, T>;
  route: RouteProp<MainTabParamList, T>;
};

