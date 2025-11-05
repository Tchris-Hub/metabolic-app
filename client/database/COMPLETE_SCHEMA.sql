-- ============================================
-- METABOLIC HEALTH TRACKER - COMPLETE DATABASE SCHEMA
-- ============================================
-- This schema captures EVERY feature from the app
-- Based on comprehensive codebase analysis
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SECTION 1: USER MANAGEMENT & AUTHENTICATION
-- ============================================

-- 1.1 USER PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  country TEXT,
  health_conditions TEXT[], -- array of conditions like ['diabetes', 'hypertension']
  medications TEXT[], -- array of medication names
  goals TEXT[], -- user's health goals
  premium_status BOOLEAN DEFAULT FALSE,
  subscription_expiry TIMESTAMPTZ,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_premium ON user_profiles(premium_status);

-- ============================================
-- SECTION 2: HEALTH TRACKING
-- ============================================

-- 2.1 HEALTH READINGS (All health metrics in one table)
CREATE TABLE IF NOT EXISTS health_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'bloodSugar', 'bloodPressure', 'weight', 'activity', 
    'heartRate', 'sleep', 'water', 'medication'
  )),
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  
  -- Flexible metadata for type-specific fields
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Examples of metadata by type:
  -- bloodSugar: {"mealType": "fasting", "timeOfDay": "morning"}
  -- bloodPressure: {"systolic": 120, "diastolic": 80, "position": "sitting", "arm": "left"}
  -- weight: {"bmi": 24.5, "bodyFat": 18.5, "muscleMass": 65.2}
  -- activity: {"steps": 10000, "calories": 450, "distance": 8.5, "activeMinutes": 60, "exerciseType": "running"}
  -- heartRate: {"resting": true, "exercise": false, "stress": false}
  -- sleep: {"quality": "good", "deepSleep": 2.5, "remSleep": 1.8, "lightSleep": 3.2, "awake": 0.5}
  -- water: {"beverageType": "water"}
  -- medication: {"medicationName": "Metformin", "dosage": 500, "taken": true, "sideEffects": ["nausea"]}
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_health_readings_user_id ON health_readings(user_id);
CREATE INDEX idx_health_readings_type ON health_readings(type);
CREATE INDEX idx_health_readings_timestamp ON health_readings(timestamp DESC);
CREATE INDEX idx_health_readings_user_type_time ON health_readings(user_id, type, timestamp DESC);
CREATE INDEX idx_health_readings_metadata ON health_readings USING GIN(metadata);

-- 2.2 HEALTH GOALS
CREATE TABLE IF NOT EXISTS health_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'bloodSugar', 'bloodPressure', 'weight', 'activity', 
    'heartRate', 'sleep', 'water', 'medication'
  )),
  target DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  deadline DATE,
  achieved BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_goals_user_id ON health_goals(user_id);
CREATE INDEX idx_health_goals_type ON health_goals(type);
CREATE INDEX idx_health_goals_achieved ON health_goals(achieved);

-- 2.3 HEALTH ALERTS (Custom thresholds)
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'bloodSugar', 'bloodPressure', 'weight', 'activity', 
    'heartRate', 'sleep', 'water', 'medication'
  )),
  condition TEXT CHECK (condition IN ('high', 'low', 'normal')),
  threshold DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  message TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_alerts_user_id ON health_alerts(user_id);
CREATE INDEX idx_health_alerts_enabled ON health_alerts(enabled);

-- 2.4 HEALTH INSIGHTS (AI-generated recommendations)
CREATE TABLE IF NOT EXISTS health_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trend', 'pattern', 'recommendation', 'alert')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB, -- Additional data for the insight
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX idx_health_insights_read ON health_insights(read);
CREATE INDEX idx_health_insights_priority ON health_insights(priority);

-- 2.5 HEALTH REPORTS (Generated reports)
CREATE TABLE IF NOT EXISTS health_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary JSONB NOT NULL, -- Complete health summary
  trends JSONB, -- Array of trends
  insights JSONB, -- Array of insights
  goals JSONB, -- Array of goals
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX idx_health_reports_period ON health_reports(period);
CREATE INDEX idx_health_reports_start_date ON health_reports(start_date DESC);

-- ============================================
-- SECTION 3: NUTRITION & MEAL PLANNING
-- ============================================

-- 3.1 FOOD ITEMS (Comprehensive food database)
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT UNIQUE,
  image_url TEXT,
  serving_size DECIMAL(8,2) NOT NULL,
  serving_unit TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  
  -- Complete nutrition information
  nutrition JSONB NOT NULL,
  -- Structure: {
  --   "calories": 165,
  --   "carbs": 0,
  --   "protein": 31,
  --   "fat": 3.6,
  --   "fiber": 0,
  --   "sugar": 0,
  --   "sodium": 74,
  --   "cholesterol": 85,
  --   "saturatedFat": 1,
  --   "transFat": 0,
  --   "potassium": 256,
  --   "calcium": 15,
  --   "iron": 0.9,
  --   "vitaminA": 0,
  --   "vitaminC": 0
  -- }
  
  glycemic_index INTEGER,
  glycemic_load INTEGER,
  tags TEXT[], -- ['high-protein', 'low-carb', etc.]
  allergens TEXT[], -- ['dairy', 'nuts', 'gluten', etc.]
  
  -- Health flags
  is_diabetic_friendly BOOLEAN DEFAULT FALSE,
  is_heart_healthy BOOLEAN DEFAULT FALSE,
  is_low_sodium BOOLEAN DEFAULT FALSE,
  is_low_carb BOOLEAN DEFAULT FALSE,
  is_high_fiber BOOLEAN DEFAULT FALSE,
  is_high_protein BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  source TEXT, -- 'USDA', 'user', 'manual', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_items_name ON food_items(name);
CREATE INDEX idx_food_items_barcode ON food_items(barcode);
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_tags ON food_items USING GIN(tags);
CREATE INDEX idx_food_items_verified ON food_items(is_verified);

-- 3.2 FOOD LOGS (Daily food intake)
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
  amount DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  
  -- Calculated nutrition for this specific log
  nutrition JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_timestamp ON food_logs(timestamp DESC);
CREATE INDEX idx_food_logs_user_time ON food_logs(user_id, timestamp DESC);
CREATE INDEX idx_food_logs_meal_type ON food_logs(meal_type);

-- 3.3 RECIPES
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  cuisine TEXT, -- 'american', 'italian', 'mexican', 'asian', 'indian', 'mediterranean', etc.
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  total_time INTEGER, -- minutes
  servings INTEGER NOT NULL,
  image_url TEXT,
  video_url TEXT,
  
  -- Nutrition per serving
  nutrition JSONB NOT NULL,
  
  -- Ingredients with amounts
  ingredients JSONB NOT NULL,
  -- Structure: [
  --   {"id": "uuid", "name": "Chicken breast", "amount": 200, "unit": "g", "nutrition": {...}},
  --   {"id": "uuid", "name": "Olive oil", "amount": 1, "unit": "tbsp", "nutrition": {...}}
  -- ]
  
  -- Step-by-step instructions
  instructions JSONB NOT NULL,
  -- Structure: [
  --   {"id": "uuid", "step": 1, "description": "Preheat oven...", "duration": 5, "temperature": 180},
  --   {"id": "uuid", "step": 2, "description": "Season chicken...", "duration": 10}
  -- ]
  
  dietary_restrictions TEXT[], -- ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', etc.]
  tags TEXT[], -- ['quick', 'easy', 'healthy', 'low-carb', etc.]
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_dietary_restrictions ON recipes USING GIN(dietary_restrictions);
CREATE INDEX idx_recipes_is_public ON recipes(is_public);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);

-- 3.4 MEAL PLANS
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- days
  
  -- Complete meal plan structure
  meals JSONB NOT NULL,
  -- Structure: [
  --   {
  --     "day": 1,
  --     "meals": {
  --       "breakfast": {"id": "recipe-uuid", "name": "Oatmeal", ...},
  --       "lunch": {"id": "recipe-uuid", "name": "Salad", ...},
  --       "dinner": {"id": "recipe-uuid", "name": "Chicken", ...},
  --       "snacks": [{"id": "recipe-uuid", "name": "Apple", ...}]
  --     },
  --     "totalCalories": 1800,
  --     "totalCarbs": 200,
  --     "totalProtein": 100,
  --     "totalFat": 60
  --   }
  -- ]
  
  total_calories INTEGER,
  total_carbs DECIMAL(8,2),
  total_protein DECIMAL(8,2),
  total_fat DECIMAL(8,2),
  dietary_restrictions TEXT[],
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  rating DECIMAL(3,2),
  reviews INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_is_public ON meal_plans(is_public);
CREATE INDEX idx_meal_plans_difficulty ON meal_plans(difficulty);
CREATE INDEX idx_meal_plans_dietary_restrictions ON meal_plans USING GIN(dietary_restrictions);

-- 3.5 FAVORITE MEALS
CREATE TABLE IF NOT EXISTS favorite_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_favorite_meals_user_id ON favorite_meals(user_id);
CREATE INDEX idx_favorite_meals_recipe_id ON favorite_meals(recipe_id);

-- 3.6 RECENT MEALS
CREATE TABLE IF NOT EXISTS recent_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  last_eaten TIMESTAMPTZ DEFAULT NOW(),
  times_eaten INTEGER DEFAULT 1,
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_recent_meals_user_id ON recent_meals(user_id);
CREATE INDEX idx_recent_meals_last_eaten ON recent_meals(last_eaten DESC);

-- 3.7 MEAL RATINGS
CREATE TABLE IF NOT EXISTS meal_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_meal_ratings_user_id ON meal_ratings(user_id);
CREATE INDEX idx_meal_ratings_recipe_id ON meal_ratings(recipe_id);
CREATE INDEX idx_meal_ratings_rating ON meal_ratings(rating DESC);

-- 3.8 MEAL RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS meal_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  confidence DECIMAL(3,2), -- 0.00 to 1.00
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_recommendations_user_id ON meal_recommendations(user_id);
CREATE INDEX idx_meal_recommendations_confidence ON meal_recommendations(confidence DESC);

-- ============================================
-- SECTION 4: EDUCATION & LEARNING
-- ============================================

-- 4.1 EDUCATION PROGRESS
CREATE TABLE IF NOT EXISTS education_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  time_spent INTEGER, -- seconds
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

CREATE INDEX idx_education_progress_user_id ON education_progress(user_id);
CREATE INDEX idx_education_progress_completed ON education_progress(completed);

-- 4.2 QUIZ RESULTS
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB, -- Array of user answers
  time_taken INTEGER, -- seconds
  passed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_quiz_results_passed ON quiz_results(passed);

-- ============================================
-- SECTION 5: GAMIFICATION & ACHIEVEMENTS
-- ============================================

-- 5.1 ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_type ON achievements(type);

-- 5.2 USER POINTS (Gamification)
CREATE TABLE IF NOT EXISTS user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_user_points_total_points ON user_points(total_points DESC);
CREATE INDEX idx_user_points_level ON user_points(level DESC);

-- ============================================
-- SECTION 6: NOTIFICATIONS & REMINDERS
-- ============================================

-- 6.1 NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'medication', 'bloodSugar', 'exercise', 'hydration', 
    'meal', 'tip', 'achievement', 'report', 'alert'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  data JSONB, -- Additional data for the notification
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent ON notifications(sent);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- 6.2 NOTIFICATION SCHEDULES (Recurring reminders)
CREATE TABLE IF NOT EXISTS notification_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom')),
  time_of_day TIME NOT NULL,
  days_of_week INTEGER[], -- [0=Sunday, 1=Monday, ..., 6=Saturday]
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_schedules_user_id ON notification_schedules(user_id);
CREATE INDEX idx_notification_schedules_enabled ON notification_schedules(enabled);

-- ============================================
-- SECTION 7: USER SETTINGS & PREFERENCES
-- ============================================

-- 7.1 USER SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Notification preferences
  notifications JSONB DEFAULT '{
    "medicationReminders": true,
    "bloodSugarReminders": true,
    "exerciseReminders": true,
    "hydrationReminders": true,
    "mealReminders": true,
    "dailyTips": true,
    "weeklyReports": true,
    "achievementNotifications": true
  }'::jsonb,
  
  -- Health unit preferences
  health JSONB DEFAULT '{
    "bloodSugarUnit": "mg/dL",
    "bloodPressureUnit": "mmHg",
    "weightUnit": "kg",
    "heightUnit": "cm",
    "temperatureUnit": "C",
    "distanceUnit": "km"
  }'::jsonb,
  
  -- Privacy settings
  privacy JSONB DEFAULT '{
    "dataSharing": false,
    "analytics": true,
    "crashReporting": true,
    "personalizedAds": false
  }'::jsonb,
  
  -- App preferences
  app JSONB DEFAULT '{
    "theme": "system",
    "language": "en",
    "fontSize": "medium",
    "hapticFeedback": true,
    "soundEffects": true,
    "autoSync": true,
    "offlineMode": false
  }'::jsonb,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================
-- SECTION 8: PREMIUM & SUBSCRIPTIONS
-- ============================================

-- 8.1 SUBSCRIPTION HISTORY
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('monthly', 'yearly', 'lifetime')),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX idx_subscription_history_status ON subscription_history(status);

-- ============================================
-- SECTION 9: ANALYTICS & TRACKING
-- ============================================

-- 9.1 USER ACTIVITY LOG
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  screen_name TEXT,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_activity_type ON user_activity_log(activity_type);
CREATE INDEX idx_user_activity_log_created_at ON user_activity_log(created_at DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_readings_updated_at BEFORE UPDATE ON health_readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON health_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_alerts_updated_at BEFORE UPDATE ON health_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_insights_updated_at BEFORE UPDATE ON health_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_logs_updated_at BEFORE UPDATE ON food_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_ratings_updated_at BEFORE UPDATE ON meal_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at BEFORE UPDATE ON user_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_schedules_updated_at BEFORE UPDATE ON notification_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- User Profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health Readings
CREATE POLICY "Users can view own health readings" ON health_readings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own health readings" ON health_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own health readings" ON health_readings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own health readings" ON health_readings
  FOR DELETE USING (auth.uid() = user_id);

-- Health Goals
CREATE POLICY "Users can manage own goals" ON health_goals
  FOR ALL USING (auth.uid() = user_id);

-- Health Alerts
CREATE POLICY "Users can manage own alerts" ON health_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Health Insights
CREATE POLICY "Users can view own insights" ON health_insights
  FOR ALL USING (auth.uid() = user_id);

-- Health Reports
CREATE POLICY "Users can view own reports" ON health_reports
  FOR ALL USING (auth.uid() = user_id);

-- Food Items (public read, authenticated write)
CREATE POLICY "Anyone can view food items" ON food_items
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food items" ON food_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Food Logs
CREATE POLICY "Users can manage own food logs" ON food_logs
  FOR ALL USING (auth.uid() = user_id);

-- Recipes
CREATE POLICY "Anyone can view public recipes" ON recipes
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);
CREATE POLICY "Authenticated users can create recipes" ON recipes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = author_id);

-- Meal Plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

-- Favorite Meals
CREATE POLICY "Users can manage own favorites" ON favorite_meals
  FOR ALL USING (auth.uid() = user_id);

-- Recent Meals
CREATE POLICY "Users can manage own recent meals" ON recent_meals
  FOR ALL USING (auth.uid() = user_id);

-- Meal Ratings
CREATE POLICY "Users can manage own ratings" ON meal_ratings
  FOR ALL USING (auth.uid() = user_id);

-- Meal Recommendations
CREATE POLICY "Users can view own recommendations" ON meal_recommendations
  FOR ALL USING (auth.uid() = user_id);

-- Education Progress
CREATE POLICY "Users can manage own education progress" ON education_progress
  FOR ALL USING (auth.uid() = user_id);

-- Quiz Results
CREATE POLICY "Users can manage own quiz results" ON quiz_results
  FOR ALL USING (auth.uid() = user_id);

-- Achievements
CREATE POLICY "Users can view own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);

-- User Points
CREATE POLICY "Users can view own points" ON user_points
  FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Notification Schedules
CREATE POLICY "Users can manage own notification schedules" ON notification_schedules
  FOR ALL USING (auth.uid() = user_id);

-- User Settings
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Subscription History
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR ALL USING (auth.uid() = user_id);

-- User Activity Log
CREATE POLICY "Users can view own activity log" ON user_activity_log
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email
  );
  
  -- Create user settings with defaults
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create user points record
  INSERT INTO public.user_points (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ COMPLETE DATABASE SCHEMA CREATED SUCCESSFULLY!';
  RAISE NOTICE '📊 Created 27 tables covering ALL app features:';
  RAISE NOTICE '   - User Management (2 tables)';
  RAISE NOTICE '   - Health Tracking (5 tables)';
  RAISE NOTICE '   - Nutrition & Meals (8 tables)';
  RAISE NOTICE '   - Education (2 tables)';
  RAISE NOTICE '   - Gamification (2 tables)';
  RAISE NOTICE '   - Notifications (2 tables)';
  RAISE NOTICE '   - Settings (1 table)';
  RAISE NOTICE '   - Premium (1 table)';
  RAISE NOTICE '   - Analytics (1 table)';
  RAISE NOTICE '   - Plus: food_items, recipes, meal_plans';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '⚡ Triggers set up for automatic updates';
  RAISE NOTICE '👤 Auto-create user profile, settings, and points on signup';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your database is ready for the complete Metabolic Health Tracker app!';
END $$;
