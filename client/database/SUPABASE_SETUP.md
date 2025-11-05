# 🚀 Supabase Backend Setup Guide

Complete guide to set up and configure Supabase for the Metabolic Health Tracker app.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Apply Database Schema](#step-1-apply-database-schema)
3. [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Step 3: Verify Setup](#step-3-verify-setup)
5. [Step 4: Test Authentication](#step-4-test-authentication)
6. [Step 5: Enable Storage (Optional)](#step-5-enable-storage-optional)
7. [Troubleshooting](#troubleshooting)
8. [Next Steps](#next-steps)

---

## Prerequisites

✅ You have created a Supabase project at https://app.supabase.com  
✅ You have your Project URL and API keys  
✅ Node.js 18+ installed  
✅ Expo CLI installed

---

## Step 1: Apply Database Schema

### 1.1 Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **"SQL Editor"** in the left sidebar (icon: `</>`)
4. Click **"New Query"**

### 1.2 Run the Schema

1. Open the file: `client/database/schema.sql`
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor
4. Click **"Run"** (or press `Ctrl+Enter`)

### 1.3 Verify Success

You should see a success message:
```
✅ Database schema created successfully!
📊 Created 14 tables with indexes and RLS policies
🔒 Row Level Security enabled for data protection
⚡ Triggers set up for automatic timestamp updates
👤 Auto-create user profile on signup enabled
```

### 1.4 Check Tables Were Created

1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ user_profiles
   - ✅ health_readings
   - ✅ meal_plans
   - ✅ food_items
   - ✅ food_logs
   - ✅ recipes
   - ✅ favorite_meals
   - ✅ health_goals
   - ✅ health_alerts
   - ✅ health_insights
   - ✅ notifications
   - ✅ user_settings
   - ✅ education_progress
   - ✅ achievements

---

## Step 2: Install Dependencies

### 2.1 Install Supabase Client

Open your terminal in the `client` folder and run:

```bash
npm install @supabase/supabase-js
```

### 2.2 Verify Installation

Check your `package.json` - you should see:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

---

## Step 3: Verify Setup

### 3.1 Check Environment Variables

Your `.env` file should contain:
```env
EXPO_PUBLIC_SUPABASE_URL=https://suqmsiqwpxjncssejpyu.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 Test Connection

Create a test file: `client/test-supabase.ts`

```typescript
import { supabase } from './services/supabase/config';

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count');
    
    if (error) {
      console.error('❌ Connection failed:', error);
    } else {
      console.log('✅ Connected to Supabase successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testConnection();
```

Run it:
```bash
npx ts-node test-supabase.ts
```

---

## Step 4: Test Authentication

### 4.1 Enable Email Auth

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Make sure **Email** is enabled
3. Configure email templates (optional but recommended)

### 4.2 Test Signup

Try creating a test user in your app or via SQL:

```sql
-- In Supabase SQL Editor
SELECT auth.signup(
  email := 'test@example.com',
  password := 'testpassword123'
);
```

### 4.3 Verify User Profile Created

Check if the user profile was auto-created:

```sql
SELECT * FROM user_profiles;
```

You should see a new profile for the test user.

---

## Step 5: Enable Storage (Optional)

If you want to store user avatars and images:

### 5.1 Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New Bucket"**
3. Name it: `avatars`
4. Make it **Public** (for profile pictures)
5. Click **"Create Bucket"**

### 5.2 Set Storage Policies

Run this SQL to allow users to upload their own avatars:

```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to avatars
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

---

## Troubleshooting

### Problem: "relation does not exist" error

**Solution:** The schema wasn't applied correctly. Re-run the schema.sql file.

### Problem: "JWT expired" or "Invalid API key"

**Solution:** 
1. Check your `.env` file has the correct keys
2. Restart your Expo server: `npx expo start --clear`

### Problem: "Row Level Security policy violation"

**Solution:** The RLS policies are working! This means:
- Users can only access their own data
- Make sure you're authenticated when making requests

### Problem: Can't insert data

**Solution:** Check:
1. You're logged in (have a valid session)
2. The user_id matches the authenticated user
3. RLS policies allow the operation

### Problem: "Failed to fetch" or network errors

**Solution:**
1. Check your internet connection
2. Verify the Supabase URL is correct
3. Check Supabase project status (might be paused)

---

## Next Steps

### ✅ What's Done

- [x] Database schema created
- [x] Row Level Security enabled
- [x] Authentication configured
- [x] Supabase client installed
- [x] Service files created

### 🔄 What's Next

1. **Update Redux Slices** - Connect to Supabase instead of Firebase
2. **Test Authentication Flow** - Sign up, login, logout
3. **Seed Sample Data** - Add some recipes and food items
4. **Test Health Tracking** - Log blood sugar, weight, etc.
5. **Enable Real-time** - Set up real-time subscriptions (optional)

---

## 📚 Useful Supabase Features

### Real-time Subscriptions

Listen to database changes in real-time:

```typescript
const subscription = supabase
  .channel('health_readings_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'health_readings',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();
```

### Database Functions

Create custom functions for complex queries:

```sql
-- Example: Get health summary for last 7 days
CREATE OR REPLACE FUNCTION get_health_summary(user_uuid UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'blood_sugar_avg', AVG(value) FILTER (WHERE type = 'bloodSugar'),
      'weight_latest', (
        SELECT value FROM health_readings 
        WHERE user_id = user_uuid AND type = 'weight'
        ORDER BY timestamp DESC LIMIT 1
      ),
      'readings_count', COUNT(*)
    )
    FROM health_readings
    WHERE user_id = user_uuid
    AND timestamp > NOW() - INTERVAL '7 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Edge Functions (Serverless)

Deploy serverless functions for:
- Sending emails
- Processing payments
- Generating insights
- Scheduled tasks

---

## 🔐 Security Best Practices

1. **Never expose service_role key** - Only use in backend/server
2. **Use RLS policies** - Already enabled for all tables
3. **Validate input** - Always validate on both client and server
4. **Use prepared statements** - Supabase does this automatically
5. **Enable MFA** - For admin accounts
6. **Monitor logs** - Check for suspicious activity

---

## 📊 Monitoring & Analytics

### Enable Supabase Analytics

1. Go to **Reports** in Supabase Dashboard
2. View:
   - API requests
   - Database performance
   - Storage usage
   - Auth activity

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Configure alerts for:
   - High CPU usage
   - Storage limits
   - Failed auth attempts

---

## 🆘 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **GitHub Issues**: https://github.com/supabase/supabase/issues

---

## 📝 Quick Reference

### Environment Variables
```env
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Import Supabase Client
```typescript
import { supabase } from './services/supabase/config';
```

### Basic Query
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');
```

### Insert Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: 'value' }]);
```

### Update Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', 'some-id');
```

### Delete Data
```typescript
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', 'some-id');
```

---

**🎉 Congratulations! Your Supabase backend is now set up and ready to use!**
