# Supabase Phone Auth Setup (SMS OTP)

Follow these steps to enable “Sign up with phone” in your Supabase project and connect it to the app.

## 1) Enable Phone Auth in Supabase
1. Open Supabase Dashboard → Your Project → Authentication → Providers → Phone.
2. Toggle "Enable phone" ON.
3. Under SMS provider, select a provider (e.g., Twilio) and enter your credentials.
   - Twilio: Account SID, Auth Token, Messaging Service SID or From phone number
4. Save changes.

Notes:
- In Development, Supabase can return OTP codes in logs when using "Debug" mode (check Auth → Logs). Do NOT rely on this in production.

## 2) Configure Auth Policies (default is fine)
- The starter policies allow signing in with phone by default. If you customized policies, ensure `auth.users` and `user_profiles` inserts/updates are allowed via RLS policies for authenticated users.

## 3) App Environment Variables
Set these in your client/.env (or your environment via eas secrets):

- EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
- EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

If you haven’t already, the Supabase client in `services/supabase/config.ts` should read from these.

## 4) How the Flow Works in the App
- User enters phone (+1.. international format) on the Phone screen.
- App calls `AuthService.signInWithPhone(phone)` → Supabase sends SMS OTP.
- User enters code → App calls `AuthService.verifyPhoneOtp(phone, token)`.
- On success, Supabase returns a session and the user is signed in.

Files added/updated:
- services/supabase/auth.ts → `signInWithPhone`, `verifyPhoneOtp`
- app/screens/auth/phone-auth.tsx → UI for phone and code
- app/screens/auth/welcome-screen.tsx → “Continue with Phone” routes to phone screen

## 5) Testing
- Turn on Debug/Sandbox on your SMS provider if available.
- Try with a real test device/number. In some regions, alphanumeric sender IDs or SMS may be filtered.

## 6) Production Checklist
- Ensure Twilio (or other) has a verified sender or messaging service.
- Ensure you have sufficient SMS balance/credits.
- Update legal copy for SMS (opt‑in, rates may apply, help/stop keywords) if required by your region.

## 7) Troubleshooting
- Error "Failed to send OTP": Verify your phone format (+ country code) and SMS provider credentials.
- Error "Failed to verify OTP": Double-check the 6‑digit code and that it hasn’t expired.
- No SMS received: Try a different number/provider, check if messaging service supports the destination country/route.
