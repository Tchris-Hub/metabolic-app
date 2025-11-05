# 🔄 Reset App & Test Complete Flow

## ❌ Problem:
App is skipping onboarding and going straight to homepage because of cached data from previous tests.

## ✅ Solution: Clear All App Data

### **Method 1: Clear AsyncStorage (Recommended)**

Add this temporary button to reset everything:

1. Open your app
2. Shake device (or press `Cmd+D` on iOS / `Cmd+M` on Android)
3. Select "Debug" menu
4. Or use the reset code below

### **Method 2: Uninstall & Reinstall App**

**On iOS Simulator:**
```bash
# Delete app from simulator
# Then restart expo
npx expo start --clear
# Press 'i' to open iOS
```

**On Android:**
```bash
# Uninstall app
# Then restart expo
npx expo start --clear
# Press 'a' to open Android
```

### **Method 3: Clear Expo Cache Completely**

```bash
# Stop the server
# Then run:
npx expo start --clear --reset-cache

# Delete node_modules/.cache
rm -rf node_modules/.cache

# Restart
npx expo start
```

---

## 🎯 Complete Flow (What Should Happen)

### **First-Time User:**
```
1. App Launch
   ↓
2. Onboarding Slides (3 screens)
   ↓
3. Disclaimer & Consent
   ↓
4. Welcome Screen
   ↓
5. Sign Up (email/password)
   ↓
6. Profile Setup (name, DOB, gender, height, weight, country)
   ↓
7. Goals Selection
   ↓
8. Main App (tabs)
```

### **Returning User (Logged Out):**
```
1. App Launch
   ↓
2. Welcome Screen (skip onboarding)
   ↓
3. Login
   ↓
4. Main App (tabs)
```

### **Returning User (Logged In):**
```
1. App Launch
   ↓
2. Main App (auto-login)
```

---

## 🔧 Quick Reset Code

Add this to your app temporarily to reset everything:

```typescript
// Add to any screen temporarily
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './services/supabase/config';

const resetEverything = async () => {
  // Clear AsyncStorage
  await AsyncStorage.clear();
  
  // Logout from Supabase
  await supabase.auth.signOut();
  
  console.log('✅ Everything reset!');
  
  // Reload app
  // On web: window.location.reload()
  // On native: Restart app manually
};

// Call this function once
resetEverything();
```

---

## 📝 What's Stored That's Causing Issues:

1. **AsyncStorage:**
   - `hasSeenOnboarding` = 'true' (from previous test)
   - This makes app skip onboarding

2. **Supabase Session:**
   - User session from previous signup
   - This makes app think you're logged in

3. **Auth Context:**
   - User data cached
   - `hasCompletedOnboarding` flag

---

## ✅ After Reset:

1. **Uninstall app** from simulator/device
2. **Run**: `npx expo start --clear`
3. **Install fresh** (press 'i' or 'a')
4. **Should see onboarding** ✅

---

## 🎯 Test The Complete Flow:

1. **Fresh install** → See onboarding
2. **Complete onboarding** → See disclaimer
3. **Accept disclaimer** → See welcome screen
4. **Sign up** → Go to profile setup
5. **Fill profile** → Save to database
6. **Select goals** → Go to main app
7. **Close app** → Reopen
8. **Should auto-login** → Main app

---

**Do this now: Uninstall the app and reinstall fresh!**
