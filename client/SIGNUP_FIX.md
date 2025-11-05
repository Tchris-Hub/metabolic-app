# 🔧 Signup Failing - Fix Guide

## ❌ Problem:
Signup keeps failing with error: "Signup failed: Em..."

## 🔍 Root Cause:
**Email confirmation is enabled in Supabase**, but your app isn't configured to handle it properly.

---

## ✅ Solution: Disable Email Confirmation (Recommended for Development)

### **Step 1: Go to Supabase Dashboard**

1. Open https://app.supabase.com
2. Select your project
3. Go to **Authentication** → **Providers** → **Email**

### **Step 2: Disable Email Confirmation**

Find the setting:
- **"Confirm email"** → **Turn OFF**

Or:
- **"Enable email confirmations"** → **Uncheck**

Click **Save**

---

## 🧪 Test Again:

1. Restart your app: `npx expo start --clear`
2. Try signing up with a new email
3. Should work immediately! ✅

---

## 📧 Alternative: Keep Email Confirmation Enabled

If you want to keep email confirmation:

### **Option A: Use a Real Email Service**

1. In Supabase → **Project Settings** → **Auth**
2. Configure SMTP settings with a real email provider:
   - Gmail
   - SendGrid
   - Mailgun
   - AWS SES

### **Option B: Check Confirmation Emails**

1. After signup, check your email inbox
2. Click the confirmation link
3. Then you can log in

### **Option C: Update App to Handle Confirmation**

The app needs to show a message:
```
"Please check your email to confirm your account"
```

---

## 🎯 Quick Fix (Do This Now):

**Disable email confirmation in Supabase:**

1. Supabase Dashboard
2. Authentication → Providers → Email
3. **Turn OFF "Confirm email"**
4. Save
5. Try signup again ✅

---

## 🔍 How to Check Current Setting:

In Supabase Dashboard:
- Go to **Authentication** → **Providers** → **Email**
- Look for **"Confirm email"** toggle
- If it's **ON** → That's why signup fails
- Turn it **OFF** → Signup will work

---

## ✅ After Disabling Email Confirmation:

Your signup will:
1. Create user immediately ✅
2. No email confirmation needed ✅
3. User can log in right away ✅
4. Profile data saves to database ✅

---

**Do this now and try signing up again!** 🚀
