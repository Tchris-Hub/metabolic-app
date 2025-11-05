# 🔧 Supabase Authentication Setup & Fix Guide

## 🚨 Problem Identified

Your authentication errors are caused by **Supabase email confirmation settings**. Here's what's happening:

### Error 1: "Auth session missing!"
- **Cause**: App tries to get user when no session exists
- **Fixed**: Updated `getCurrentUser()` to check for session first

### Error 2: "Signup failed: No user or session returned"
- **Cause**: Email confirmation is **ENABLED** in Supabase (default setting)
- **What happens**: When email confirmation is enabled:
  - ✅ User is created
  - ✅ Confirmation email is sent
  - ❌ **NO SESSION** is created until email is confirmed
  - ❌ User cannot log in until they click the email link

### Error 3: "Invalid login credentials"
- **Cause**: User tries to log in before confirming their email
- **Solution**: Either disable email confirmation OR handle it properly in the app

---

## ✅ Solution 1: Disable Email Confirmation (For Testing)

**Best for development/testing. Follow these steps:**

### Step 1: Go to Supabase Dashboard
1. Open your browser and go to: https://supabase.com/dashboard
2. Select your project: `suqmsiqwpxjncssejpyu`

### Step 2: Navigate to Authentication Settings
1. Click **Authentication** in the left sidebar
2. Click **Providers** tab
3. Find **Email** provider
4. Click the **⚙️ gear icon** to configure

### Step 3: Disable Email Confirmation
1. Look for **"Confirm email"** toggle
2. **Turn it OFF** (disable it)
3. Click **Save**

### Step 4: Restart Your App
```bash
# Stop current server (Ctrl+C)
npx expo start --clear
```

✅ **Result**: Users can now sign up and immediately log in without email confirmation!

---

## ✅ Solution 2: Handle Email Confirmation Properly (Production)

**Best for production. Keep email confirmation enabled.**

### What I've Already Fixed:
1. ✅ Updated `AuthService.signup()` to return `session | null`
2. ✅ Updated `AuthContext` to detect when email confirmation is required
3. ✅ Fixed `getCurrentUser()` to handle missing sessions gracefully

### What You Need to Do:

#### 1. Update Your Signup Screen
Show a confirmation message when session is null:

```typescript
// In your signup screen (app/screens/auth/signup/step1.tsx)
try {
  await signup(email, password, displayName);
  
  // Check if user is authenticated (has session)
  if (isAuthenticated) {
    // Email confirmation disabled - user logged in immediately
    router.replace('/');
  } else {
    // Email confirmation required - show message
    router.push('/screens/auth/email-confirmation');
  }
} catch (error) {
  // Handle error
}
```

#### 2. Create Email Confirmation Screen
Your app already has this file: `app/screens/auth/email-confirmation.tsx`

Make sure it:
- ✅ Shows "Check your email" message
- ✅ Explains user must click the link
- ✅ Provides a "Resend email" button (using `AuthService.resendConfirmationEmail()`)

#### 3. Set Up Supabase Email Redirect
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Redirect URLs** to your app's deep link:
   - For Expo: `exp://localhost:8081` (development)
   - For production: Your custom scheme (e.g., `metabolichealth://`)

---

## 🔍 How to Test Authentication Now

### Test Signup (Email Confirmation Disabled):
```bash
1. Sign up with: test@example.com / Password123!
2. Should immediately redirect to home screen
3. User should be logged in
```

### Test Signup (Email Confirmation Enabled):
```bash
1. Sign up with: test@example.com / Password123!
2. Should show "Check your email" screen
3. Go to your email inbox
4. Click confirmation link
5. App redirects and logs you in
```

### Test Login:
```bash
1. Use existing account credentials
2. Should log in immediately
3. Redirect to home screen
```

---

## 🎯 Recommended Approach

### For Development (Right Now):
1. **Disable email confirmation** in Supabase dashboard
2. This lets you test signup/login flows quickly
3. No email verification needed

### For Production (Before Launch):
1. **Re-enable email confirmation** for security
2. Test the full email confirmation flow
3. Make sure email-confirmation.tsx screen works properly
4. Set up proper email templates in Supabase

---

## 📋 Quick Checklist

- [ ] Go to Supabase Dashboard
- [ ] Authentication → Providers → Email
- [ ] Disable "Confirm email" toggle
- [ ] Save changes
- [ ] Restart Expo app with `npx expo start --clear`
- [ ] Test signup with new email
- [ ] Verify immediate login works

---

## 🐛 Still Having Issues?

### Check These:

1. **Supabase URL/Key are correct**
   - Open `.env` file
   - Verify `EXPO_PUBLIC_SUPABASE_URL` matches your project
   - Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` is correct

2. **Restart the app completely**
   ```bash
   # Kill all processes
   npx expo start --clear
   ```

3. **Clear AsyncStorage (app cache)**
   ```typescript
   // Run this once in your app
   import AsyncStorage from '@react-native-async-storage/async-storage';
   AsyncStorage.clear();
   ```

4. **Check Supabase Auth Logs**
   - Supabase Dashboard → Authentication → Logs
   - Look for errors or failed attempts

---

## ✨ What's Fixed in Your Code

### ✅ `services/supabase/auth.ts`
- `signup()` now returns `session | null` (handles email confirmation)
- `getCurrentUser()` checks for session first (no more "Auth session missing" errors)

### ✅ `contexts/AuthContext.tsx`
- `signup()` checks if session exists
- Only sets user if session is active
- Logs message when email confirmation is required

### ✅ Error Handling
- No more crashes from missing sessions
- Graceful handling of email confirmation flow
- Proper error messages in console

---

## 🚀 Next Steps After Fix

1. Test the complete auth flow
2. Verify home/settings screens display correctly
3. If using email confirmation, test the email verification flow
4. Set up proper error UI (instead of console logs)
5. Add "Resend email" functionality to confirmation screen

---

**Need help?** Check the Supabase docs: https://supabase.com/docs/guides/auth/auth-email
