# Onboarding Flow Analysis

## SQLite App Flow (The Working One)

### Flow Logic:
```
App Launch
    ↓
Check AsyncStorage for 'onboardingComplete'
    ↓
├─ IF NOT COMPLETE (First-time users)
│   ↓
│   1. Splash Screen (with animations)
│   2. Onboarding Slides (swipeable intro screens)
│   3. Consent Screen (terms & conditions)
│   4. Auth Screen (Sign up / Login)
│   5. Profile Setup (age, gender, height, weight, activity level)
│   6. Goals Setup (health conditions, goals, reminder preferences)
│   7. Save to Database → Set 'onboardingComplete' = true
│   8. Navigate to Main App (Home Screen)
│
└─ IF COMPLETE (Returning users)
    ↓
    ├─ IF NOT AUTHENTICATED
    │   → Go directly to Auth Screen (Login)
    │
    └─ IF AUTHENTICATED
        → Go directly to Main App (Home Screen)
```

### Key AsyncStorage Flags:
- `hasLaunched` - Tracks if app has been opened before (for UI purposes)
- `onboardingComplete` - **MAIN FLAG** - Determines if user sees full onboarding
- `userProfile` - Backup of profile data
- `userGoals` - Backup of goals data

### Navigation Logic in AppNavigator.tsx:
```typescript
if (!hasCompletedOnboarding) {
  // Show FULL onboarding flow
  // OnboardingSlides → Consent → Auth → ProfileSetup → GoalsSetup
} else if (!isAuthenticated) {
  // Show ONLY Auth screen (login)
} else {
  // Show Main App
}
```

---

## Supabase App Current Flow (INCORRECT)

### Current Flow:
```
App Launch
    ↓
Check AsyncStorage for 'hasSeenOnboarding'
    ↓
├─ IF NOT SEEN
│   → PremiumOnboardingScreen
│   → Then welcome-screen
│
└─ IF SEEN
    ↓
    ├─ IF NOT AUTHENTICATED
    │   → welcome-screen
    │
    └─ IF AUTHENTICATED && NOT COMPLETED ONBOARDING
        │   → profile screen
        │
        └─ IF AUTHENTICATED && COMPLETED ONBOARDING
            → Main App (tabs)
```

### Problems:
1. ❌ Uses `hasSeenOnboarding` instead of `onboardingComplete`
2. ❌ Missing the full onboarding flow (slides → consent → auth)
3. ❌ Splits onboarding into separate routes instead of sequential flow
4. ❌ No clear "onboarding complete" point
5. ❌ Profile/Goals screens not in onboarding sequence

---

## CORRECT Flow (What Should Be Implemented)

### Target Flow:
```
App Launch
    ↓
Check: 'onboardingComplete' flag
    ↓
├─ IF FALSE/NULL (First-time users)
│   ↓
│   Sequential Onboarding Stack:
│   1. PremiumOnboardingScreen (intro slides)
│   2. Disclaimer/Consent Screen
│   3. Signup/Login Screen
│   4. Profile Screen (collect user info)
│   5. Goals Screen (health conditions & goals)
│   6. → Save to Supabase
│   7. → Set AsyncStorage 'onboardingComplete' = 'true'
│   8. → Navigate to Main App
│
└─ IF TRUE (Returning users who completed onboarding)
    ↓
    Check Authentication:
    ├─ NOT AUTHENTICATED → Go to Login screen
    └─ AUTHENTICATED → Go to Main App
```

### Required Changes:

#### 1. Update `app/index.tsx`:
Replace `hasSeenOnboarding` logic with `onboardingComplete`

#### 2. Create Onboarding Stack Navigator:
Sequential flow that users MUST complete:
- Can't skip steps
- Can't go back to previous screens
- Only exits when "onboardingComplete" is set

#### 3. Update AsyncStorage Keys:
- Remove: `hasSeenOnboarding`
- Add: `onboardingComplete`
- Keep: User profile state in AuthContext

#### 4. Goals Screen:
Should be LAST step in onboarding, then:
- Save data to Supabase
- Set `onboardingComplete = true`
- Navigate to main app

---

## Implementation Plan

### Step 1: Fix app/index.tsx routing logic
```typescript
// Check if user completed onboarding (not just "seen" it)
const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');

if (!onboardingComplete) {
  // First-time user → Full onboarding
  return <Redirect href="/screens/auth/onboarding-flow" />;
}

if (!isAuthenticated) {
  // Returning user, not logged in → Direct to login
  return <Redirect href="/screens/auth/login" />;
}

if (!hasCompletedProfile) {
  // Edge case: Logged in but didn't finish profile
  return <Redirect href="/screens/auth/profile" />;
}

// Normal flow: Authenticated + onboarding complete
return <Redirect href="/(tabs)" />;
```

### Step 2: Create onboarding flow navigator
New file: `app/screens/auth/onboarding/_layout.tsx`
- Stack navigator for onboarding sequence
- No back navigation allowed
- Sequential steps only

### Step 3: Update Goals screen to complete onboarding
```typescript
const handleComplete = async () => {
  // Save to Supabase
  await UserProfileRepository.upsertProfile({...});
  
  // Mark onboarding as complete
  await AsyncStorage.setItem('onboardingComplete', 'true');
  
  // Navigate to main app
  router.replace('/(tabs)');
};
```

---

## Summary

**The key insight from SQLite app:**
- Uses ONE flag (`onboardingComplete`) to control the entire flow
- First-time users see FULL sequential onboarding (can't skip)
- Returning users skip directly to login or main app
- Onboarding is a one-time experience, never shown again

**Current Supabase app mistake:**
- Uses `hasSeenOnboarding` which tracks "did user see slides"
- Doesn't track if user COMPLETED the full onboarding process
- Allows skipping parts of onboarding
- Confusing flow with multiple entry points
