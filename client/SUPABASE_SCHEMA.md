# Supabase Database Schema

## Overview
This document outlines the database schema required for the Metabolic Health Tracker app.

## Tables

### 1. user_profiles
Stores extended user profile information beyond auth.users.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height NUMERIC, -- in cm
  weight NUMERIC, -- in kg
  age INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  health_conditions TEXT[], -- Array of conditions
  health_goals TEXT[], -- Array of goals
  reminder_preferences JSONB DEFAULT '{"bloodSugar": false, "medication": false, "exercise": false, "meals": false}'::jsonb,
  target_weight NUMERIC,
  country TEXT,
  medications TEXT[],
  premium_status BOOLEAN DEFAULT false,
  subscription_expiry TIMESTAMPTZ,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2. health_readings
Unified table for all health metrics (blood sugar, BP, weight, etc.).

```sql
CREATE TABLE health_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bloodSugar', 'bloodPressure', 'weight', 'activity', 'heartRate', 'sleep', 'water', 'medication')),
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  metadata JSONB, -- For type-specific fields (e.g., systolic/diastolic, meal_context)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_health_readings_user_id ON health_readings(user_id);
CREATE INDEX idx_health_readings_type ON health_readings(type);
CREATE INDEX idx_health_readings_timestamp ON health_readings(timestamp DESC);
CREATE INDEX idx_health_readings_user_type_time ON health_readings(user_id, type, timestamp DESC);

-- RLS Policies
ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readings" ON health_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings" ON health_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings" ON health_readings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own readings" ON health_readings
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. food_items
Database of food items with nutritional information.

```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT UNIQUE,
  image_url TEXT,
  serving_size NUMERIC NOT NULL,
  serving_unit TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  nutrition JSONB NOT NULL, -- {calories, protein, carbs, fat, fiber, sugar, sodium, etc.}
  glycemic_index INTEGER,
  glycemic_load INTEGER,
  tags TEXT[],
  allergens TEXT[],
  is_diabetic_friendly BOOLEAN DEFAULT false,
  is_heart_healthy BOOLEAN DEFAULT false,
  is_low_sodium BOOLEAN DEFAULT false,
  is_low_carb BOOLEAN DEFAULT false,
  is_high_fiber BOOLEAN DEFAULT false,
  is_high_protein BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_food_items_name ON food_items USING gin(to_tsvector('english', name));
CREATE INDEX idx_food_items_category ON food_items(category);
CREATE INDEX idx_food_items_barcode ON food_items(barcode);

-- RLS: Public read access
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view food items" ON food_items
  FOR SELECT USING (true);
```

### 4. food_logs
User's daily food intake logs.

```sql
CREATE TABLE food_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES food_items(id),
  custom_food_name TEXT, -- For custom entries
  amount NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  nutrition JSONB, -- Calculated nutrition for this serving
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_timestamp ON food_logs(timestamp DESC);
CREATE INDEX idx_food_logs_user_date ON food_logs(user_id, DATE(timestamp));

-- RLS
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own food logs" ON food_logs
  FOR ALL USING (auth.uid() = user_id);
```

### 5. recipes
Recipe database with nutritional information.

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')) NOT NULL,
  cuisine TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER NOT NULL,
  image_url TEXT,
  video_url TEXT,
  nutrition JSONB NOT NULL, -- Per serving
  ingredients JSONB NOT NULL, -- [{name, amount, unit}, ...]
  instructions TEXT[] NOT NULL,
  dietary_restrictions TEXT[],
  tags TEXT[],
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipes_name ON recipes USING gin(to_tsvector('english', name));

-- RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public recipes" ON recipes
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = author_id);
```

### 6. meal_plans
User's meal plans.

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- days
  meals JSONB NOT NULL, -- [{day, meal_type, recipe_id}, ...]
  total_calories INTEGER,
  total_carbs NUMERIC,
  total_protein NUMERIC,
  total_fat NUMERIC,
  dietary_restrictions TEXT[],
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);

-- RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meal plans" ON meal_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public meal plans" ON meal_plans
  FOR SELECT USING (is_public = true);
```

### 7. favorite_meals
User's favorite recipes.

```sql
CREATE TABLE favorite_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Indexes
CREATE INDEX idx_favorite_meals_user_id ON favorite_meals(user_id);

-- RLS
ALTER TABLE favorite_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorite_meals
  FOR ALL USING (auth.uid() = user_id);
```

### 8. user_settings
App settings and preferences.

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT CHECK (theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  language TEXT DEFAULT 'en',
  units JSONB DEFAULT '{"bloodSugar": "mg/dL", "weight": "kg", "height": "cm", "temperature": "C"}'::jsonb,
  notifications_enabled BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  privacy_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);
```

## Functions

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_readings_updated_at BEFORE UPDATE ON health_readings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_food_logs_updated_at BEFORE UPDATE ON food_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Setup Instructions

1. **Run in Supabase SQL Editor** (in order):
   - Create tables (user_profiles, health_readings, etc.)
   - Create indexes
   - Enable RLS and create policies
   - Create functions and triggers

2. **Verify Setup**:
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Check RLS is enabled
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. **Test Policies**:
   - Create a test user via Supabase Auth
   - Try inserting/reading data via the client
   - Verify RLS blocks unauthorized access

## Notes

- All timestamps use `TIMESTAMPTZ` for timezone awareness
- RLS policies ensure users can only access their own data
- Indexes are optimized for common query patterns
- JSONB fields allow flexible metadata storage
- Arrays used for multi-value fields (tags, conditions, etc.)
