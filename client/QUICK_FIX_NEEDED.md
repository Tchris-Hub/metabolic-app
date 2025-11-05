# ⚠️ One Quick Fix Needed

## Issue: Profile Screen Data Not Saved

The `goals.tsx` screen expects profile data from AsyncStorage, but the profile screen doesn't save it yet.

## Fix (2 minutes)

Add this to `app/screens/auth/profile.tsx`:

### Find the "Continue" button handler and add:

```typescript
const handleContinue = async () => {
  // Validate required fields
  if (!name || !age || !gender || !height || !weight || !activityLevel) {
    Alert.alert('Missing Information', 'Please fill in all required fields');
    return;
  }

  try {
    // Save to AsyncStorage for goals screen
    const profileData = {
      name,
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthConditions: selectedConditions,
      country: selectedCountry?.code,
    };
    
    await AsyncStorage.setItem('tempProfileData', JSON.stringify(profileData));
    
    // Navigate to goals screen
    router.push('/screens/auth/goals');
  } catch (error) {
    console.error('Failed to save profile data:', error);
    Alert.alert('Error', 'Failed to save profile data');
  }
};
```

### Add import at top:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

## That's It!

This ensures the profile data flows correctly:
1. Profile screen → Save to AsyncStorage
2. Goals screen → Read from AsyncStorage + combine with goals
3. Save complete data to Supabase

Everything else is already working! 🎉
