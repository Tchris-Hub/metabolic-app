# ✅ Complete Onboarding Flow - FINAL VERSION

## The Correct Flow (As Requested)

```
FIRST-TIME USER:
┌─────────────────────────────────────────────────────────────┐
│ 1. Onboarding Slides (PremiumOnboardingScreen)             │
│    - 3 swipeable slides introducing the app                 │
│    - "Get Started" → "Continue" → "Let's Begin"             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Disclaimer & Consent (disclaimer-consent.tsx)           │
│    - Read terms & conditions                                │
│    - Check required consent boxes                           │
│    - Must read for 8 seconds before accepting               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Welcome Screen (welcome-screen.tsx)                     │
│    - "Create an Account" button                             │
│    - "Sign In" button                                       │
│    - "Continue with Email/Google/Apple" options            │
└─────────────────────────────────────────────────────────────┘
           ↓                                      ↓
    [Create Account]                         [Sign In]
           ↓                                      ↓
┌────────────────────────────┐    ┌─────────────────────────────┐
│ 4a. Signup (signup/step1)  │    │ 4b. Login (login.tsx)       │
│    - Enter email/password  │    │    - Enter email/password   │
│    - Create new account    │    │    - Authenticate           │
└────────────────────────────┘    └─────────────────────────────┘
           ↓                                      ↓
           ↓                          ┌───────────────────────────┐
           ↓                          │ Check Profile in Database │
           ↓                          │ - Load existing profile   │
           ↓                          │ - Load health conditions  │
           ↓                          │ - Load goals              │
           ↓                          └───────────────────────────┘
           ↓                                      ↓
           ↓                          ┌───────────────────────────┐
           ↓                          │ Main App (Home Screen)    │
           ↓                          │ - Shows: "Hello [Name]!"  │
           ↓                          │ - User's actual data      │
           ↓                          │ - Their health stats      │
           ↓                          └───────────────────────────┘
           ↓
┌────────────────────────────────┐
│ 5. Profile Setup (profile.tsx)│
│    - Name                      │
│    - Age                       │
│    - Gender                    │
│    - Height                    │
│    - Weight                    │
│    - Activity Level            │
│    - Health Conditions         │
└────────────────────────────────┘
           ↓
┌────────────────────────────────┐
│ 6. Goals Setup (goals.tsx)    │
│    - Select health goals       │
│    - Blood sugar control       │
│    - Weight loss               │
│    - Etc.                      │
└────────────────────────────────┘
           ↓
    [Save to Database]
    [Set onboardingComplete = true]
           ↓
┌────────────────────────────────┐
│ 7. Main App (Home Screen)     │
│    - Shows: "Hello [Name]!"    │
│    - User's profile data       │
│    - Ready to track health     │
└────────────────────────────────┘
```

---

## RETURNING USER (Already Signed Up Before):

```
App Launch
    ↓
Check: onboardingComplete = true
    ↓
Check: isAuthenticated
    ↓
├─ IF NOT AUTHENTICATED:
│   ↓
│   Login Screen
│   ↓
│   [User logs in]
│   ↓
│   Load Profile from Database
│   ↓
│   Main App (Shows "Hello [Their Name]!")
│
└─ IF AUTHENTICATED:
    ↓
    Main App Directly (Shows "Hello [Their Name]!")
```

---

## Key Points

### 1. Welcome Screen is the Decision Point ✅
After consent, user sees welcome screen with TWO options:
- **"Create an Account"** → Signup → Profile → Goals → Main App
- **"Sign In"** → Login → Load their data → Main App

### 2. Returning Users Skip Everything ✅
- Check `onboardingComplete` flag
- If true → Skip onboarding entirely
- If not authenticated → Go to login
- If authenticated → Go to main app

### 3. User Name Display ✅
The app should greet users by their actual name:
- **New Users**: Name from profile setup ("Hello Austin!")
- **Returning Users**: Name loaded from database ("Hello Austin!")

### 4. onboardingComplete Flag ✅
Set to `true` ONLY when:
- User completes signup
- AND completes profile setup
- AND completes goals setup
- AND data is saved to Supabase

---

## Files Changed

### 1. `app/index.tsx` ✅
Routes based on `onboardingComplete` flag:
```typescript
if (!onboardingComplete) {
  // First-time users → Full onboarding
  return <Redirect href="/screens/auth/PremiumOnboardingScreen" />;
}

if (!isAuthenticated) {
  // Returning users → Direct to login
  return <Redirect href="/screens/auth/login" />;
}

// Authenticated users → Main app
return <Redirect href="/(tabs)" />;
```

### 2. `app/screens/auth/disclaimer-consent.tsx` ✅
After accepting terms → Welcome screen:
```typescript
const accept = async () => {
  router.replace('/screens/auth/welcome-screen');
};
```

### 3. `app/screens/auth/welcome-screen.tsx` ✅
Two paths:
- "Create Account" → `/screens/auth/signup/step1`
- "Sign In" → `/screens/auth/login`

### 4. `app/screens/auth/login.tsx` ✅
Login successful → Load profile → Main app:
```typescript
await login(email, password);
router.replace('/(tabs)');
// AuthContext loads user profile automatically
```

### 5. `app/screens/auth/signup/step1.tsx` ✅
Signup successful → Profile setup:
```typescript
await signup(email, password, name);
router.replace('/screens/auth/profile');
```

### 6. `app/screens/auth/profile.tsx` ✅
Profile complete → Goals setup:
```typescript
// Save profile data to AsyncStorage temporarily
await AsyncStorage.setItem('tempProfileData', JSON.stringify(profileData));
router.replace('/screens/auth/goals');
```

### 7. `app/screens/auth/goals.tsx` ✅
Goals complete → Save everything → Main app:
```typescript
// Get profile data
const profileData = await AsyncStorage.getItem('tempProfileData');

// Save to Supabase
await UserProfileRepository.upsertProfile({
  user_id: user.id,
  display_name: profileData.name,
  age: profileData.age,
  // ... all profile + goals data
});

// Mark onboarding complete
await AsyncStorage.setItem('onboardingComplete', 'true');

// Navigate to main app
router.replace('/(tabs)');
```

### 8. `app/(tabs)/index.tsx` (Home Screen) ✅
Loads and displays user name:
```typescript
const profile = await UserProfileRepository.getProfileByUserId(user.id);
setUserName(profile.display_name || user.name);

// UI shows: "Good morning, Austin!"
```

---

## Error Handling

### Login Errors ✅
```typescript
try {
  await login(email, password);
  router.replace('/(tabs)');
} catch (error) {
  if (error.message.includes('Invalid login credentials')) {
    Alert.alert('Login Failed', 'Invalid email or password');
  } else if (error.message.includes('Email not confirmed')) {
    Alert.alert('Login Failed', 'Please confirm your email first');
  }
  // Show error, don't navigate
}
```

### Profile Not Found (Returning Users) ✅
```typescript
const profile = await UserProfileRepository.getProfileByUserId(user.id);
if (profile) {
  setUserName(profile.display_name);
} else {
  // Fallback to email name or "User"
  setUserName(user.name || 'User');
}
```

---

## Testing Checklist

### Test 1: First-Time User (Complete Flow)
- [ ] Open app
- [ ] See onboarding slides (swipe through 3)
- [ ] See disclaimer, read and accept
- [ ] **See welcome screen with "Create Account" and "Sign In"**
- [ ] Tap "Create an Account"
- [ ] Enter email/password, sign up
- [ ] See profile screen, fill in details
- [ ] See goals screen, select goals
- [ ] Land on main app home screen
- [ ] **Home screen shows "Hello [Your Name]!"**

### Test 2: Returning User (Login)
- [ ] Close and reopen app
- [ ] **Should go directly to login (skip onboarding)**
- [ ] Enter email/password
- [ ] Login successful
- [ ] **Home screen shows "Hello [Your Name]!" (from database)**

### Test 3: Sign In from Welcome Screen
- [ ] Clear app data / uninstall
- [ ] Go through onboarding slides
- [ ] Accept disclaimer
- [ ] **On welcome screen, tap "Sign In" (not Create Account)**
- [ ] Enter existing email/password
- [ ] Login successful
- [ ] **Home screen shows existing profile data**

### Test 4: Login Error
- [ ] Try logging in with wrong password
- [ ] **Should see error message**
- [ ] **Should NOT navigate to main app**
- [ ] **Should stay on login screen**

---

## Summary

✅ **Onboarding Slides** → User sees app introduction
✅ **Disclaimer** → User accepts terms
✅ **Welcome Screen** → User chooses "Sign Up" OR "Sign In"
✅ **Sign Up Path** → Signup → Profile → Goals → Main App
✅ **Sign In Path** → Login → Load data from DB → Main App
✅ **User Name** → Always shows their actual name from profile
✅ **Returning Users** → Skip onboarding, go straight to login/main app
✅ **Error Handling** → Shows clear error messages, doesn't crash

**The flow now matches exactly what you described!** 🎉
