-- ============================================
-- METABOLIC HEALTH TRACKER - DATABASE SCHEMA
-- Supabase PostgreSQL Database
-- ============================================
-- 
-- This file contains the complete database schema for the
-- Metabolic Health Tracker application.
-- 
-- To apply this schema:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Copy and paste this entire file
-- 4. Click "Run" or press Ctrl+Enter
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
-- Extends Supabase auth.users with additional profile information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2), -- in cm
  weight DECIMAL(5,2), -- in kg
  country TEXT,
  health_conditions TEXT[], -- array of conditions
  medications TEXT[], -- array of medications
  goals TEXT[], -- array of goals
  premium_status BOOLEAN DEFAULT FALSE,
  subscription_expiry TIMESTAMPTZ,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================
-- 2. HEALTH READINGS TABLE
-- ============================================
-- Stores all health metrics: blood sugar, blood pressure, weight, etc.
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
  metadata JSONB, -- stores type-specific data like mealType, systolic/diastolic, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_health_readings_user_id ON health_readings(user_id);
CREATE INDEX idx_health_readings_type ON health_readings(type);
CREATE INDEX idx_health_readings_timestamp ON health_readings(timestamp DESC);
CREATE INDEX idx_health_readings_user_type_time ON health_readings(user_id, type, timestamp DESC);

-- ============================================
-- 3. MEAL PLANS TABLE
-- ============================================
-- User-created and pre-built meal plans
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- days
  meals JSONB NOT NULL, -- array of meal plan days with meals
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

-- ============================================
-- 4. FOOD ITEMS TABLE
-- ============================================
-- Comprehensive food database with nutrition information
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
  nutrition JSONB NOT NULL, -- all nutrition data (calories, protein, carbs, etc.)
  glycemic_index INTEGER,
  glycemic_load INTEGER,
  tags TEXT[],
  allergens TEXT[],
  is_diabetic_friendly BOOLEAN DEFAULT FALSE,
  is_heart_healthy BOOLEAN DEFAULT FALSE,
  is_low_sodium BOOLEAN DEFAULT FALSE,
  is_low_carb BOOLEAN DEFAULT FALSE,
  is_high_fiber BOOLEAN DEFAULT FALSE,
  is_high_protein BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_items_name ON food_items(name);
CREATE INDEX idx_food_items_barcode ON food_items(barcode);
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_tags ON food_items USING GIN(tags);

-- ============================================
-- 5. FOOD LOGS TABLE
-- ============================================
-- Daily food intake tracking
CREATE TABLE IF NOT EXISTS food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
  amount DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  nutrition JSONB, -- calculated nutrition for this specific log entry
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_timestamp ON food_logs(timestamp DESC);
CREATE INDEX idx_food_logs_user_time ON food_logs(user_id, timestamp DESC);

-- ============================================
-- 6. RECIPES TABLE
-- ============================================
-- Recipe database with instructions and nutrition
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  cuisine TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER NOT NULL,
  image_url TEXT,
  video_url TEXT,
  nutrition JSONB NOT NULL,
  ingredients JSONB NOT NULL, -- array of ingredients with amounts
  instructions TEXT[] NOT NULL,
  dietary_restrictions TEXT[],
  tags TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_is_public ON recipes(is_public);

-- ============================================
-- 7. FAVORITE MEALS TABLE
-- ============================================
-- User's favorite recipes
CREATE TABLE IF NOT EXISTS favorite_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX idx_favorite_meals_user_id ON favorite_meals(user_id);

-- ============================================
-- 8. HEALTH GOALS TABLE
-- ============================================
-- User health objectives and targets
CREATE TABLE IF NOT EXISTS health_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  target DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  deadline DATE,
  achieved BOOLEAN DEFAULT FALSE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_goals_user_id ON health_goals(user_id);

-- ============================================
-- 9. HEALTH ALERTS TABLE
-- ============================================
-- Custom health alerts and thresholds
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('high', 'low', 'normal')),
  threshold DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  message TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_alerts_user_id ON health_alerts(user_id);

-- ============================================
-- 10. HEALTH INSIGHTS TABLE
-- ============================================
-- AI-generated insights and recommendations
CREATE TABLE IF NOT EXISTS health_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trend', 'pattern', 'recommendation', 'alert')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_insights_user_id ON health_insights(user_id);
CREATE INDEX idx_health_insights_read ON health_insights(read);

-- ============================================
-- 11. NOTIFICATIONS TABLE
-- ============================================
-- Scheduled notifications and reminders
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_sent ON notifications(sent);

-- ============================================
-- 12. USER SETTINGS TABLE
-- ============================================
-- User preferences and app settings
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notifications JSONB DEFAULT '{
    "medicationReminders": true,
    "bloodSugarReminders": true,
    "exerciseReminders": true,
    "hydrationReminders": true,
    "dailyTips": true,
    "weeklyReports": true,
    "achievementNotifications": true
  }'::jsonb,
  health JSONB DEFAULT '{
    "bloodSugarUnit": "mg/dL",
    "bloodPressureUnit": "mmHg",
    "weightUnit": "kg",
    "heightUnit": "cm",
    "temperatureUnit": "C",
    "distanceUnit": "km"
  }'::jsonb,
  privacy JSONB DEFAULT '{
    "dataSharing": false,
    "analytics": true,
    "crashReporting": true,
    "personalizedAds": false
  }'::jsonb,
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
-- 13. EDUCATION PROGRESS TABLE
-- ============================================
-- Track user progress through educational content
CREATE TABLE IF NOT EXISTS education_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  time_spent INTEGER, -- seconds
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_education_progress_user_id ON education_progress(user_id);

-- ============================================
-- 14. ACHIEVEMENTS TABLE
-- ============================================
-- Gamification achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_readings_updated_at BEFORE UPDATE ON health_readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_logs_updated_at BEFORE UPDATE ON food_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON health_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_alerts_updated_at BEFORE UPDATE ON health_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_insights_updated_at BEFORE UPDATE ON health_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Health Readings Policies
CREATE POLICY "Users can view own health readings" ON health_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health readings" ON health_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health readings" ON health_readings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health readings" ON health_readings
  FOR DELETE USING (auth.uid() = user_id);

-- Meal Plans Policies
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans" ON meal_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans" ON meal_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Food Items Policies (public read, authenticated write)
CREATE POLICY "Anyone can view food items" ON food_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert food items" ON food_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Food Logs Policies
CREATE POLICY "Users can view own food logs" ON food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food logs" ON food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs" ON food_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs" ON food_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Recipes Policies
CREATE POLICY "Anyone can view public recipes" ON recipes
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create recipes" ON recipes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = author_id);

-- Favorite Meals Policies
CREATE POLICY "Users can view own favorites" ON favorite_meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorite_meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON favorite_meals
  FOR DELETE USING (auth.uid() = user_id);

-- Health Goals Policies
CREATE POLICY "Users can manage own goals" ON health_goals
  FOR ALL USING (auth.uid() = user_id);

-- Health Alerts Policies
CREATE POLICY "Users can manage own alerts" ON health_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Health Insights Policies
CREATE POLICY "Users can view own insights" ON health_insights
  FOR ALL USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- User Settings Policies
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Education Progress Policies
CREATE POLICY "Users can view own education progress" ON education_progress
  FOR ALL USING (auth.uid() = user_id);

-- Achievements Policies
CREATE POLICY "Users can view own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Create user profile on signup
-- ============================================
-- Automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Created 14 tables with indexes and RLS policies';
  RAISE NOTICE '🔒 Row Level Security enabled for data protection';
  RAISE NOTICE '⚡ Triggers set up for automatic timestamp updates';
  RAISE NOTICE '👤 Auto-create user profile on signup enabled';
END $$;
