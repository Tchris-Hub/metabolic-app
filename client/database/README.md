# 📊 Database Documentation

This folder contains all database-related files for the Metabolic Health Tracker application.

---

## 📁 Files

### `schema.sql`
Complete PostgreSQL database schema for Supabase.

**Contains:**
- 14 table definitions
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic updates
- Foreign key relationships

**How to use:**
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy and paste entire `schema.sql` file
4. Click "Run"

### `SUPABASE_SETUP.md`
Step-by-step guide to set up Supabase backend.

**Covers:**
- Prerequisites
- Database schema application
- Dependency installation
- Environment configuration
- Testing and verification
- Troubleshooting

---

## 🗄️ Database Tables

### Core Tables

1. **user_profiles** - Extended user information
   - Links to `auth.users` (Supabase auth)
   - Stores health profile data
   - Premium subscription status

2. **health_readings** - All health metrics
   - Blood sugar, blood pressure, weight, etc.
   - Flexible metadata field for type-specific data
   - Indexed for fast queries

3. **meal_plans** - User meal plans
   - Pre-built and custom plans
   - Nutritional information
   - Public/private visibility

4. **food_items** - Food database
   - Comprehensive nutrition data
   - Barcode support
   - Dietary flags (diabetic-friendly, low-carb, etc.)

5. **food_logs** - Daily food intake
   - Links to food_items
   - Meal type categorization
   - Calculated nutrition per log

6. **recipes** - Recipe database
   - Ingredients and instructions
   - Nutritional information
   - User-generated and curated

7. **favorite_meals** - User's favorite recipes
   - Many-to-many relationship
   - Quick access to preferred meals

### Supporting Tables

8. **health_goals** - User health objectives
9. **health_alerts** - Custom health thresholds
10. **health_insights** - AI-generated recommendations
11. **notifications** - Scheduled reminders
12. **user_settings** - App preferences
13. **education_progress** - Learning tracking
14. **achievements** - Gamification

---

## 🔒 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- ✅ Users can only access their own data
- ✅ Public data (recipes, food items) is readable by all
- ✅ Authenticated users can create data
- ✅ Users can only modify their own records

### Example Policy

```sql
-- Users can only view their own health readings
CREATE POLICY "Users can view own health readings" 
ON health_readings
FOR SELECT 
USING (auth.uid() = user_id);
```

---

## 📈 Indexes

Indexes are created for:
- Foreign keys (`user_id`, `food_item_id`, etc.)
- Frequently queried columns (`type`, `timestamp`)
- Composite indexes for common query patterns
- Full-text search (GIN indexes on arrays)

### Example Indexes

```sql
-- Single column index
CREATE INDEX idx_health_readings_user_id ON health_readings(user_id);

-- Composite index for common query
CREATE INDEX idx_health_readings_user_type_time 
ON health_readings(user_id, type, timestamp DESC);

-- GIN index for array search
CREATE INDEX idx_food_items_tags ON food_items USING GIN(tags);
```

---

## 🔄 Triggers

### Automatic Timestamp Updates

All tables with `updated_at` column have triggers that automatically update the timestamp on any UPDATE operation.

```sql
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create User Profile

When a new user signs up, a profile and settings record are automatically created:

```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 🔍 Common Queries

### Get User's Recent Health Readings

```sql
SELECT * FROM health_readings
WHERE user_id = 'user-uuid'
  AND type = 'bloodSugar'
  AND timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC
LIMIT 30;
```

### Get Daily Nutrition Summary

```sql
SELECT 
  DATE(timestamp) as date,
  SUM((nutrition->>'calories')::numeric) as total_calories,
  SUM((nutrition->>'protein')::numeric) as total_protein,
  SUM((nutrition->>'carbs')::numeric) as total_carbs,
  SUM((nutrition->>'fat')::numeric) as total_fat
FROM food_logs
WHERE user_id = 'user-uuid'
  AND timestamp >= CURRENT_DATE
GROUP BY DATE(timestamp);
```

### Search Food Items

```sql
SELECT * FROM food_items
WHERE name ILIKE '%chicken%'
  AND is_diabetic_friendly = true
ORDER BY name
LIMIT 20;
```

### Get User's Favorite Recipes

```sql
SELECT r.* 
FROM recipes r
INNER JOIN favorite_meals fm ON r.id = fm.recipe_id
WHERE fm.user_id = 'user-uuid'
ORDER BY fm.added_at DESC;
```

---

## 🚀 Performance Tips

### 1. Use Indexes Wisely
- All foreign keys are indexed
- Add indexes for columns used in WHERE clauses
- Use composite indexes for multi-column queries

### 2. Limit Results
Always use `LIMIT` for large tables:
```sql
SELECT * FROM health_readings LIMIT 100;
```

### 3. Use Specific Columns
Instead of `SELECT *`, specify columns:
```sql
SELECT id, value, timestamp FROM health_readings;
```

### 4. Filter Early
Apply WHERE clauses before JOINs when possible:
```sql
-- Good
SELECT * FROM health_readings 
WHERE user_id = 'uuid' AND type = 'bloodSugar';

-- Less efficient
SELECT * FROM health_readings 
WHERE type = 'bloodSugar' AND user_id = 'uuid';
```

---

## 📊 Data Types

### JSONB Fields

Several tables use JSONB for flexible data storage:

**health_readings.metadata:**
```json
{
  "mealType": "fasting",
  "timeOfDay": "morning",
  "systolic": 120,
  "diastolic": 80
}
```

**food_items.nutrition:**
```json
{
  "calories": 165,
  "protein": 31,
  "carbohydrates": 0,
  "fat": 3.6,
  "fiber": 0,
  "sodium": 74
}
```

**user_settings.notifications:**
```json
{
  "medicationReminders": true,
  "bloodSugarReminders": true,
  "exerciseReminders": false
}
```

### Querying JSONB

```sql
-- Get specific field
SELECT metadata->>'mealType' as meal_type FROM health_readings;

-- Filter by JSONB field
SELECT * FROM health_readings 
WHERE metadata->>'mealType' = 'fasting';

-- Check if JSONB contains key
SELECT * FROM health_readings 
WHERE metadata ? 'systolic';
```

---

## 🔧 Maintenance

### Backup

Supabase automatically backs up your database, but you can also:

```bash
# Export schema
pg_dump -h db.xxx.supabase.co -U postgres -s > schema_backup.sql

# Export data
pg_dump -h db.xxx.supabase.co -U postgres -a > data_backup.sql
```

### Vacuum (Optimize)

PostgreSQL automatically vacuums, but you can manually trigger:

```sql
VACUUM ANALYZE health_readings;
```

### Check Table Sizes

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📝 Schema Versioning

### Current Version: 1.0.0

**Changes:**
- Initial schema creation
- 14 tables with RLS policies
- Indexes and triggers
- Auto-create user profile

### Future Versions

When updating the schema:
1. Create migration file: `migrations/001_add_feature.sql`
2. Document changes
3. Test on staging first
4. Apply to production
5. Update version number

---

## 🆘 Troubleshooting

### "relation does not exist"
**Solution:** Schema not applied. Run `schema.sql` in SQL Editor.

### "permission denied for table"
**Solution:** RLS policy blocking access. Check authentication.

### "duplicate key value violates unique constraint"
**Solution:** Trying to insert duplicate data. Check unique constraints.

### Slow queries
**Solution:** 
1. Check if indexes exist
2. Use EXPLAIN ANALYZE to see query plan
3. Add missing indexes

```sql
EXPLAIN ANALYZE
SELECT * FROM health_readings WHERE user_id = 'uuid';
```

---

## 📚 Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Supabase Database Guide**: https://supabase.com/docs/guides/database
- **SQL Tutorial**: https://www.postgresqltutorial.com/

---

**Last Updated:** 2025-10-01  
**Schema Version:** 1.0.0
