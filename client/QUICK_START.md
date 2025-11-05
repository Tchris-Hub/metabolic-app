# ⚡ Quick Start Guide

Get your Metabolic Health Tracker app running in 5 minutes!

---

## 🎯 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Expo CLI installed (`npm install -g expo-cli`)
- ✅ Supabase project created at https://app.supabase.com
- ✅ Your Supabase credentials ready

---

## 🚀 Step 1: Apply Database Schema (2 minutes)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar (icon: `</>`)
   - Click "New Query"

3. **Run Schema**
   - Open file: `client/database/schema.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click "Run" (or Ctrl+Enter)

4. **Verify Success**
   - You should see: "✅ Database schema created successfully!"
   - Click "Table Editor" - you should see 14 tables

---

## 📦 Step 2: Install Dependencies (1 minute)

```bash
cd client
npm install
```

This will install:
- Supabase client
- All React Native dependencies
- Expo packages

---

## 🔧 Step 3: Environment Setup (1 minute)

Your `.env` file is already created with your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://suqmsiqwpxjncssejpyu.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **No action needed** - it's already configured!

---

## 🎬 Step 4: Start the App (1 minute)

```bash
npx expo start
```

Then:
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

---

## ✅ Step 5: Test It Out!

### Test Authentication

1. Click "Sign Up" in the app
2. Enter email and password
3. Create an account
4. Check Supabase Dashboard → Authentication → Users
5. You should see your new user!

### Test Health Logging

1. Log in to the app
2. Go to Home screen
3. Click "Blood Sugar" card
4. Enter a reading (e.g., 120 mg/dL)
5. Save it
6. Check Supabase Dashboard → Table Editor → health_readings
7. You should see your reading!

---

## 🎉 You're Done!

Your app is now running with Supabase backend!

---

## 🔍 What's Next?

### Explore the App
- ✅ Log health data (blood sugar, blood pressure, weight)
- ✅ Browse recipes and meal plans
- ✅ Read educational articles
- ✅ Set health goals
- ✅ Customize settings

### Customize
- Add your own recipes
- Create custom meal plans
- Add food items to database
- Configure notification preferences

### Deploy
- Build for iOS: `eas build --platform ios`
- Build for Android: `eas build --platform android`
- Deploy web version: `npx expo export:web`

---

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and restart
npx expo start --clear
```

### Database errors?
- Check that schema.sql was run successfully
- Verify .env file has correct credentials
- Check Supabase project is active (not paused)

### Authentication not working?
- Go to Supabase Dashboard → Authentication → Providers
- Make sure "Email" provider is enabled
- Check email templates are configured

### Can't see data?
- Make sure you're logged in
- Check that user_id matches authenticated user
- Verify RLS policies are working (this is good security!)

---

## 📚 Documentation

- **Full Setup Guide**: `database/SUPABASE_SETUP.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Database Docs**: `database/README.md`
- **Main README**: `README.md`

---

## 🆘 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev

---

## 📋 Quick Commands

```bash
# Start development server
npm start

# Start with cache clear
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Type check
npx tsc --noEmit

# Lint code
npm run lint
```

---

**🎊 Happy coding! Your health app is ready to help people manage their metabolic health!**
