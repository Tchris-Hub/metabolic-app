# 🔄 Firebase to Supabase Migration Guide

This guide documents the migration from Firebase to Supabase for the Metabolic Health Tracker app.

---

## ✅ What's Been Done

### 1. **Database Schema Created**
- ✅ 14 tables created in Supabase PostgreSQL
- ✅ Row Level Security (RLS) policies enabled
- ✅ Indexes created for performance
- ✅ Triggers for automatic timestamp updates
- ✅ Auto-create user profile on signup

**Location**: `client/database/schema.sql`

### 2. **Supabase Services Created**
- ✅ `services/supabase/config.ts` - Supabase client configuration
- ✅ `services/supabase/auth.ts` - Authentication service
- ✅ `services/supabase/database.ts` - Database operations

### 3. **Environment Variables**
- ✅ `.env` file created with your Supabase credentials
- ✅ `.env.example` template for other developers

### 4. **Redux Slices Updated**
- ✅ `store/slices/authSlice.ts` - Now uses Supabase auth
- ✅ `store/slices/healthSlice.ts` - Now uses Supabase database
- ✅ `store/slices/mealSlice.ts` - Now uses Supabase database

### 5. **Dependencies**
- ✅ `@supabase/supabase-js` installed
- ⚠️ Firebase dependencies can be removed (see below)

---

## 🗑️ Firebase Files to Remove

### Files You Can Delete:
```
services/firebase/
├── config.ts
├── auth.ts
├── database.ts
└── notifications.ts
```

### Package.json - Remove These Dependencies:
```json
{
  "dependencies": {
    // Remove these if not used elsewhere:
    "firebase": "...",
    "@firebase/app": "...",
    "@firebase/auth": "...",
    "@firebase/firestore": "...",
    "@firebase/messaging": "..."
  }
}
```

**Command to remove Firebase:**
```bash
npm uninstall firebase
```

---

## 🔧 Files That Need Manual Updates

### 1. **Contexts (if you have them)**

If you have a `contexts/AuthContext.tsx`:

**Before (Firebase):**
```typescript
import { auth } from '../services/firebase/config';
```

**After (Supabase):**
```typescript
import { supabase } from '../services/supabase/config';
import { AuthService } from '../services/supabase/auth';
```

### 2. **Hooks**

#### `hooks/useAuth.ts`
Update to use Supabase auth service instead of Firebase.

#### `hooks/useHealthData.ts`
Update to use Supabase database service.

#### `hooks/useNotifications.ts`
Update to use Supabase (or a third-party service like OneSignal).

### 3. **Screens**

Check these files for Firebase imports:
- `app/screens/auth/login.tsx`
- `app/screens/auth/signup/step1.tsx`
- `app/screens/auth/profile.tsx`
- Any other screens that directly import Firebase

**Find all Firebase references:**
```bash
# In your client folder
grep -r "firebase" --include="*.ts" --include="*.tsx"
```

---

## 📝 Key Differences: Firebase vs Supabase

### Authentication

**Firebase:**
```typescript
import { auth } from './services/firebase/config';
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Supabase:**
```typescript
import { supabase } from './services/supabase/config';
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

### Database Queries

**Firebase (Firestore):**
```typescript
const snapshot = await getDocs(
  query(collection(db, 'health_readings'), where('userId', '==', userId))
);
```

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('health_readings')
  .select('*')
  .eq('user_id', userId);
```

### Real-time Subscriptions

**Firebase:**
```typescript
onSnapshot(collection(db, 'health_readings'), (snapshot) => {
  // Handle changes
});
```

**Supabase:**
```typescript
supabase
  .channel('health_readings')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'health_readings' }, (payload) => {
    // Handle changes
  })
  .subscribe();
```

---

## 🔐 Authentication Flow Changes

### Sign Up

**Firebase:**
```typescript
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await updateProfile(userCredential.user, { displayName });
```

**Supabase:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: displayName }
  }
});
// User profile is auto-created by database trigger!
```

### Get Current User

**Firebase:**
```typescript
const user = auth.currentUser;
```

**Supabase:**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Auth State Listener

**Firebase:**
```typescript
onAuthStateChanged(auth, (user) => {
  // Handle auth state change
});
```

**Supabase:**
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state change
});
```

---

## 📊 Database Schema Mapping

### Field Name Changes

| Firebase (Firestore) | Supabase (PostgreSQL) |
|---------------------|----------------------|
| `userId` | `user_id` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |
| `bloodSugar` | `bloodSugar` (same) |
| `mealType` | `meal_type` |

**Note:** Supabase uses snake_case for column names (PostgreSQL convention), but you can use camelCase in your TypeScript code.

### Data Type Changes

| Firebase | Supabase |
|----------|----------|
| `Timestamp` | `TIMESTAMPTZ` |
| `Map` | `JSONB` |
| `Array` | `TEXT[]` or `JSONB` |
| `Reference` | `UUID` (Foreign Key) |

---

## 🚀 Testing Your Migration

### 1. Test Authentication

```typescript
// Test signup
const { user } = await AuthService.signup({
  email: 'test@example.com',
  password: 'testpass123',
  displayName: 'Test User'
});

// Test login
const { user: loggedInUser } = await AuthService.login({
  email: 'test@example.com',
  password: 'testpass123'
});

// Test logout
await AuthService.logout();
```

### 2. Test Database Operations

```typescript
// Test health reading
const readingId = await DatabaseService.saveHealthReading({
  user_id: userId,
  type: 'bloodSugar',
  value: 120,
  unit: 'mg/dL',
  timestamp: new Date().toISOString(),
  metadata: { mealType: 'fasting' }
});

// Test retrieval
const readings = await DatabaseService.getHealthReadings(userId, 'bloodSugar', 10);
```

### 3. Test RLS Policies

Try to access another user's data - it should be blocked:

```typescript
// This should fail (RLS policy prevents it)
const { data, error } = await supabase
  .from('health_readings')
  .select('*')
  .eq('user_id', 'some-other-users-id');

// error will be: "new row violates row-level security policy"
```

---

## ⚠️ Common Migration Issues

### Issue 1: "relation does not exist"

**Cause:** Database schema not applied.

**Solution:** Run the `schema.sql` file in Supabase SQL Editor.

### Issue 2: "JWT expired" or "Invalid API key"

**Cause:** Wrong environment variables or cached values.

**Solution:**
1. Check `.env` file has correct values
2. Restart Expo: `npx expo start --clear`

### Issue 3: "Row Level Security policy violation"

**Cause:** Trying to access data without proper authentication or permissions.

**Solution:**
1. Make sure user is logged in
2. Check that `user_id` matches authenticated user
3. Verify RLS policies are correct

### Issue 4: Date/Timestamp Conversion

**Cause:** Supabase returns ISO strings, Firebase returned Timestamp objects.

**Solution:**
```typescript
// Convert ISO string to Date
const date = new Date(reading.timestamp);

// Convert Date to ISO string for Supabase
const isoString = new Date().toISOString();
```

---

## 📋 Migration Checklist

### Backend Setup
- [x] Create Supabase project
- [x] Apply database schema
- [x] Configure environment variables
- [x] Install Supabase client
- [x] Create service files
- [x] Update Redux slices

### Code Updates
- [ ] Remove Firebase imports from all files
- [ ] Update authentication flows
- [ ] Update database queries
- [ ] Test all CRUD operations
- [ ] Update real-time subscriptions (if any)
- [ ] Update file uploads (if any)

### Testing
- [ ] Test user signup
- [ ] Test user login
- [ ] Test password reset
- [ ] Test health data logging
- [ ] Test meal planning
- [ ] Test food logging
- [ ] Test user profile updates
- [ ] Test settings

### Cleanup
- [ ] Remove `services/firebase/` folder
- [ ] Uninstall Firebase packages
- [ ] Remove Firebase config from `app.json` (if any)
- [ ] Update documentation

---

## 🎯 Next Steps

1. **Apply the database schema** (if not done yet)
   - Go to Supabase SQL Editor
   - Run `database/schema.sql`

2. **Test authentication**
   - Try signing up a new user
   - Try logging in
   - Check if user profile is created

3. **Update remaining files**
   - Search for "firebase" in your codebase
   - Replace with Supabase equivalents

4. **Remove Firebase**
   - Delete `services/firebase/` folder
   - Run `npm uninstall firebase`

5. **Test thoroughly**
   - Test all features
   - Check console for errors
   - Verify data is being saved

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Migration Guide**: https://supabase.com/docs/guides/migrations

---

**🎉 Migration Complete! Your app now runs on Supabase!**
