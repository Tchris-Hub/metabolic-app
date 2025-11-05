# 🧪 Test Supabase Connection

Your app is now connected to Supabase! Let's test it.

---

## ✅ What I Just Did

1. **Updated AuthContext.tsx** - Now uses real Supabase authentication
2. **Restarted app** - With cleared cache

---

## 🧪 Test Steps

### 1. Sign Up a New User (2 minutes)

1. **In your app**, click **"Sign Up"** or **"Create Account"**
2. Enter:
   - Email: `test@example.com`
   - Password: `testpass123`
   - Name: `Test User`
3. Click **"Sign Up"**

**Expected**: You should be signed up and redirected to the app

### 2. Verify in Supabase (1 minute)

Go to Supabase Dashboard:

**Check 1: Authentication**
1. Click **"Authentication"** → **"Users"**
2. You should see: `test@example.com` ✅

**Check 2: User Profile**
1. Click **"Table Editor"** → **"user_profiles"**
2. You should see **1 row** with:
   - `user_id` = (UUID)
   - `email` = test@example.com
   - `display_name` = Test User ✅

**Check 3: User Settings**
1. Click **"user_settings"** table
2. You should see **1 row** with default settings ✅

**Check 4: User Points**
1. Click **"user_points"** table
2. You should see **1 row** with:
   - `total_points` = 0
   - `level` = 1
   - `streak_days` = 0 ✅

---

## 🎉 If All Checks Pass

**Congratulations!** Your app is successfully connected to Supabase!

This means:
- ✅ Authentication works
- ✅ Database connection works
- ✅ Auto-creation trigger works
- ✅ RLS policies work

---

## 🏥 Next: Test Health Logging

### 1. Log Blood Sugar

1. In app, go to **"Log"** tab
2. Click **"Blood Sugar"**
3. Enter: `120 mg/dL`
4. Select: "Fasting" + "Morning"
5. Click **"Save"**

### 2. Verify in Supabase

1. Table Editor → **"health_readings"**
2. You should see **1 row** with:
   - `type` = bloodSugar
   - `value` = 120
   - `unit` = mg/dL
   - `metadata` = {"mealType": "fasting", "timeOfDay": "morning"} ✅

---

## 🍽️ Next: Test Food Logging

### 1. Log Food

1. In app, go to **"Meal"** tab
2. Click **"Log Food"** or search for food
3. Select a food item
4. Enter amount
5. Save

### 2. Verify in Supabase

1. Table Editor → **"food_logs"**
2. You should see your food log ✅

---

## ⚠️ Troubleshooting

### "Login failed" or "Signup failed"

**Check**:
1. Is `.env` file in the `client` folder?
2. Does it have the correct Supabase URL and key?
3. Restart the app: `npx expo start --clear`

### "No user_profiles created"

**Check**:
1. Go to Supabase → SQL Editor
2. Run this to check the trigger:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```
3. If empty, re-run `COMPLETE_SCHEMA.sql`

### "Can't see data in Table Editor"

**This is normal!** RLS is working.

**To see all data** (for testing):
1. Go to SQL Editor
2. Run:
```sql
SELECT * FROM user_profiles;
SELECT * FROM health_readings;
```

---

## 📊 Current Status

- ✅ Database: 27 tables created
- ✅ Connection: App connected to Supabase
- ✅ Authentication: Real Supabase auth
- 🔄 Testing: In progress

---

## 🚀 What's Next?

Once all tests pass:

### Option 1: Seed Sample Data
Add recipes and food items for users

### Option 2: Build More Features
- Meal plan creation
- Recipe browsing
- Health insights
- Notifications

### Option 3: Polish UI
- Fix any remaining errors
- Improve user experience
- Add loading states

---

**Let me know how the tests go!** 🎯
