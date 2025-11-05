# 🏥 Metabolic Health Tracker

> A comprehensive mobile health application for managing diabetes, hypertension, and cardiovascular health.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.10-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📱 About

Metabolic Health Tracker is a cross-platform mobile application (iOS, Android, Web) designed to help users manage chronic metabolic conditions through comprehensive health tracking, personalized meal planning, and evidence-based education.

### ✨ Key Features

- 📊 **Health Tracking** - Blood sugar, blood pressure, weight, activity, medication, sleep, and hydration
- 🍽️ **Nutrition Management** - Meal planning, recipe database, food logging with 1000+ items
- 📚 **Health Education** - Articles, interactive quizzes, and daily health tips
- 📈 **Analytics & Insights** - Trends, patterns, and AI-powered recommendations
- 🎯 **Goal Setting** - Track progress toward health objectives
- 🔔 **Smart Reminders** - Medication, blood sugar checks, exercise, and hydration
- 🌙 **Dark Mode** - System-aware theme support
- 🌍 **Multi-language** - Internationalization ready
- 💎 **Premium Features** - Ad-free, advanced analytics, unlimited meal plans

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio
- Expo Go app on your physical device (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metabolic-health/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your device

## 📁 Project Structure

```
client/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx            # Home/Dashboard
│   │   ├── learn.tsx            # Education hub
│   │   ├── log.tsx              # Health logging
│   │   ├── meal.tsx             # Meal planning
│   │   └── more.tsx             # Settings/Profile
│   ├── screens/                  # Feature screens
│   │   ├── auth/                # Authentication flows
│   │   ├── education/           # Learning content
│   │   ├── health/              # Health tracking
│   │   ├── nutrition/           # Meal & nutrition
│   │   └── settings/            # App settings
│   └── log/                     # Quick log screens
├── component/                    # Reusable components
│   ├── modals/                  # Modal dialogs
│   ├── charts/                  # Data visualization
│   ├── health/                  # Health widgets
│   ├── nutrition/               # Nutrition components
│   └── ui/                      # UI components
├── store/                        # Redux store
│   └── slices/                  # State slices
│       ├── authSlice.ts         # Authentication state
│       ├── healthSlice.ts       # Health data state
│       ├── mealSlice.ts         # Meal planning state
│       └── settingsSlice.ts     # App settings state
├── services/                     # API services
│   ├── firebase/                # Firebase integration
│   │   ├── auth.ts              # Authentication service
│   │   ├── database.ts          # Firestore service
│   │   └── config.ts            # Firebase config
│   └── health/                  # Health integrations
│       ├── appleHealth.ts       # Apple HealthKit
│       └── googleFit.ts         # Google Fit
├── types/                        # TypeScript definitions
│   ├── auth.types.ts            # Auth types
│   ├── health.types.ts          # Health data types
│   ├── meal.types.ts            # Meal/nutrition types
│   └── navigation.types.ts      # Navigation types
├── data/                         # Static/mock data
│   ├── recipes.ts               # Recipe database
│   ├── foodDatabase.ts          # Food items
│   ├── mealPlans.ts             # Meal plans
│   └── education/               # Educational content
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── useHealthData.ts         # Health data hook
│   └── useNotifications.ts      # Notifications hook
├── contexts/                     # React contexts
├── utils/                        # Utility functions
│   ├── constants.ts             # App constants
│   ├── dateUtils.ts             # Date helpers
│   ├── healthUtils.ts           # Health calculations
│   └── validationUtils.ts       # Input validation
├── assets/                       # Images, fonts, icons
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native 0.81.4 with Expo SDK ~54.0.10
- **Navigation**: Expo Router 6.0.8 + React Navigation 7.x
- **State Management**: Redux Toolkit 2.9.0
- **Styling**: NativeWind 4.2.1 (TailwindCSS for React Native)
- **UI Components**: Custom components with Expo Vector Icons
- **Charts**: React Native Gifted Charts 1.4.64
- **Animations**: React Native Reanimated 4.1.1 + Lottie
- **Language**: TypeScript 5.9.2

### Backend (Configured)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Push Notifications**: Firebase Cloud Messaging
- **Local Storage**: AsyncStorage

### Key Dependencies
```json
{
  "@reduxjs/toolkit": "^2.9.0",
  "@react-navigation/native": "^7.1.17",
  "expo-router": "~6.0.8",
  "nativewind": "^4.2.1",
  "react-native-gifted-charts": "^1.4.64",
  "react-native-reanimated": "~4.1.1",
  "lottie-react-native": "^7.3.4"
}
```

## 📊 Features Deep Dive

### 1. Health Tracking
Track comprehensive health metrics with detailed logging:

#### Blood Sugar Monitoring
- Log glucose readings (mg/dL or mmol/L)
- Meal type context (fasting, pre-meal, post-meal, random)
- Time of day tracking (morning, afternoon, evening, night)
- Trend analysis with charts
- Target range alerts

#### Blood Pressure Tracking
- Systolic/Diastolic readings
- Position tracking (sitting, standing, lying)
- Arm selection (left/right)
- Historical trends
- Hypertension alerts

#### Weight Management
- Weight logging with unit preferences
- BMI calculation
- Body composition (body fat %, muscle mass)
- Progress visualization
- Goal tracking

#### Activity & Exercise
- Steps counter
- Calories burned
- Distance traveled
- Active minutes
- Exercise type logging
- Heart rate monitoring

#### Medication Management
- Medication schedule
- Dosage tracking
- Reminder system
- Side effects logging
- Adherence monitoring
- Refill reminders

#### Additional Metrics
- Heart rate monitoring
- Sleep tracking (duration, quality, sleep phases)
- Water intake logging
- Hydration goals

### 2. Nutrition & Meal Planning

#### Meal Plans
- Pre-built plans (7-day, 14-day, 30-day)
- Condition-specific (diabetes, hypertension, heart disease)
- Custom meal plan creation
- Calorie and macro tracking
- Dietary restriction filters

#### Recipe Database
- 100+ diabetic-friendly recipes
- Detailed nutritional information
- Step-by-step instructions
- Prep and cook time
- Difficulty levels
- Dietary tags (vegan, gluten-free, low-carb, etc.)

#### Food Database
- Comprehensive nutrition database (1000+ items)
- Barcode scanning support
- Custom food entry
- Serving size calculations
- Glycemic index/load data
- Allergen information

#### Food Logging
- Meal type categorization
- Portion tracking
- Daily nutrition summary
- Macro breakdown
- Calorie goals

### 3. Education & Learning

#### Educational Content
- Diabetes management guides
- Hypertension information
- Nutrition education
- Exercise guidelines
- Emergency procedures
- Red flags awareness

#### Interactive Features
- Knowledge assessment quizzes
- Progress tracking
- Gamified learning
- Achievement badges
- Daily health tips

### 4. Analytics & Insights

#### Dashboard
- Health score calculation
- Today's progress summary
- Quick log shortcuts
- Recent readings display
- Motivational messages

#### Data Visualization
- Line charts for trends
- Bar charts for comparisons
- Progress indicators
- Goal tracking
- Period filters (7d, 30d, 90d)

#### Health Insights
- Trend analysis
- Pattern recognition
- Personalized recommendations
- Alert notifications

### 5. Settings & Customization

#### Notification Preferences
- Medication reminders
- Blood sugar check reminders
- Exercise reminders
- Hydration reminders
- Daily tips
- Weekly reports
- Achievement notifications

#### Unit Preferences
- Blood sugar (mg/dL vs mmol/L)
- Blood pressure (mmHg vs kPa)
- Weight (kg vs lbs)
- Height (cm vs ft)
- Temperature (°C vs °F)
- Distance (km vs miles)

#### Privacy & Security
- Data sharing preferences
- Analytics opt-in/out
- Crash reporting
- Personalized ads control

#### App Preferences
- Theme (light/dark/system)
- Language selection
- Font size
- Haptic feedback
- Sound effects
- Auto-sync
- Offline mode

## 🗄️ Database Schema

### Required Collections/Tables

#### Core Tables
1. **users** - User authentication data
2. **user_profiles** - Extended user information
3. **health_readings** - All health metrics (blood sugar, BP, weight, etc.)
4. **meal_plans** - User meal plans
5. **food_logs** - Daily food intake logs
6. **food_items** - Food database
7. **recipes** - Recipe database

#### Supporting Tables
8. **favorite_meals** - User's favorite recipes
9. **health_goals** - User health objectives
10. **health_alerts** - Custom health alerts
11. **health_insights** - AI-generated insights
12. **notifications** - Scheduled notifications
13. **user_settings** - User preferences
14. **education_progress** - Learning progress tracking
15. **achievements** - Gamification achievements

### Example Schema: health_readings

```typescript
{
  id: string (PK)
  userId: string (FK -> users, indexed)
  type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity' | 'heartRate' | 'sleep' | 'water' | 'medication'
  value: number
  unit: string
  timestamp: timestamp (indexed)
  notes: string | null
  metadata: {
    // Type-specific fields
    mealType?: 'fasting' | 'pre-meal' | 'post-meal' | 'random'
    systolic?: number
    diastolic?: number
    bmi?: number
    steps?: number
    // ... more fields
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes**: `userId`, `type`, `timestamp`, composite: `(userId, type, timestamp)`

## 🔌 API Endpoints Required

### Authentication (7 endpoints)
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/social-login` - Google/Apple login
- `POST /api/auth/verify-email` - Send verification email
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Health Tracking (7 endpoints)
- `POST /api/health/readings` - Create health reading
- `GET /api/health/readings` - Get readings (with filters)
- `GET /api/health/readings/:id` - Get specific reading
- `PUT /api/health/readings/:id` - Update reading
- `DELETE /api/health/readings/:id` - Delete reading
- `GET /api/health/trends` - Get health trends
- `GET /api/health/summary` - Get health summary

### Meal Planning (9 endpoints)
- `GET /api/meals/plans` - Get meal plans
- `POST /api/meals/plans` - Create meal plan
- `GET /api/meals/plans/:id` - Get specific plan
- `PUT /api/meals/plans/:id` - Update meal plan
- `DELETE /api/meals/plans/:id` - Delete meal plan
- `GET /api/meals/recipes` - Search recipes
- `GET /api/meals/recipes/:id` - Get recipe details
- `POST /api/meals/favorites` - Add to favorites
- `DELETE /api/meals/favorites/:id` - Remove favorite

### Food Logging (6 endpoints)
- `POST /api/food/logs` - Log food
- `GET /api/food/logs` - Get food logs
- `GET /api/food/items` - Search food database
- `GET /api/food/items/:id` - Get food item
- `POST /api/food/items` - Create custom food
- `GET /api/food/barcode/:code` - Lookup by barcode

### Additional Endpoints
- Goals & Insights (7 endpoints)
- Notifications (4 endpoints)
- Education (4 endpoints)
- Premium (3 endpoints)
- User Management (5 endpoints)

**Total: ~50 API endpoints**

## 🚀 Development Scripts

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

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Reset project
npm run reset-project
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Building for Production

### iOS
```bash
# Create production build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Create production build
eas build --platform android

# Submit to Play Store
eas submit --platform android
```

### Web
```bash
# Build for web
npx expo export:web

# Deploy to hosting
# (Vercel, Netlify, etc.)
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration (when backend is ready)
EXPO_PUBLIC_API_URL=https://api.yourapp.com
EXPO_PUBLIC_API_KEY=your_api_key

# Third-party Services
EXPO_PUBLIC_STRIPE_KEY=your_stripe_key
# Optional: only if you integrate analytics (e.g., GA4). Not used by the app unless you add an analytics SDK.
# EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🏗️ Backend Integration Guide

### Current Status
✅ **Frontend**: 100% complete with full UI/UX  
⚠️ **Backend**: Needs implementation

### Recommended Backend Stack
- **Runtime**: Node.js 18+ with Express or NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Storage**: AWS S3 or Google Cloud Storage
- **Authentication**: JWT with refresh tokens
- **Queue**: Bull/BullMQ for background jobs

### Implementation Phases

#### Phase 1: Core Backend (Weeks 1-2)
- Set up Node.js + Express + PostgreSQL
- Create database schema
- Implement JWT authentication
- Basic CRUD for health readings
- User profile management

#### Phase 2: Health Features (Weeks 3-4)
- All health reading types
- Trends and analytics
- Goals and alerts
- Data visualization APIs
- Export functionality

#### Phase 3: Nutrition (Weeks 5-6)
- Food database integration
- Meal planning APIs
- Recipe management
- Food logging
- Nutrition calculations

#### Phase 4: Advanced Features (Weeks 7-8)
- Push notifications
- Background jobs
- Health insights (ML)
- Premium features
- Payment integration (Stripe)

#### Phase 5: Polish & Deploy (Weeks 9-10)
- Performance optimization
- Security audit
- Load testing
- Documentation
- Production deployment

### Integration Steps

1. **Update Redux Thunks**
   ```typescript
   // Replace Firebase calls with REST API calls
   export const saveHealthReading = createAsyncThunk(
     'health/saveHealthReading',
     async (reading: HealthReading) => {
       const response = await fetch(`${API_URL}/health/readings`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify(reading)
       });
       return response.json();
     }
   );
   ```

2. **Create API Service Layer**
   ```typescript
   // services/api/client.ts
   export class ApiClient {
     private baseURL: string;
     private token: string | null;

     async get(endpoint: string) { /* ... */ }
     async post(endpoint: string, data: any) { /* ... */ }
     async put(endpoint: string, data: any) { /* ... */ }
     async delete(endpoint: string) { /* ... */ }
   }
   ```

3. **Update Authentication**
   ```typescript
   // Replace Firebase Auth with JWT
   const login = async (email: string, password: string) => {
     const response = await api.post('/auth/login', { email, password });
     const { token, refreshToken, user } = response.data;
     await AsyncStorage.setItem('token', token);
     await AsyncStorage.setItem('refreshToken', refreshToken);
     return user;
   };
   ```

## 💎 Premium Features

### Free Tier
- Basic health tracking (limited entries per day)
- Basic meal plans (3 plans)
- Educational content
- Basic analytics (7 days)
- Ads supported

### Premium Tier ($9.99/month or $79.99/year)
- ✨ Unlimited health tracking
- 🍽️ Unlimited meal plans
- 📊 Advanced analytics (unlimited history)
- 📈 AI-powered insights
- 📄 Export reports (PDF)
- 👨‍👩‍👧‍👦 Family sharing (up to 5 members)
- 🚫 Ad-free experience
- 🎯 Priority support
- 🔔 Advanced reminders

## 🔒 Security & Compliance

### Data Security
- End-to-end encryption for sensitive health data
- HTTPS/TLS for all communications
- Secure token storage (encrypted AsyncStorage)
- Biometric authentication support
- Auto-logout on inactivity

### Compliance
- **HIPAA**: Health Insurance Portability and Accountability Act (US)
- **GDPR**: General Data Protection Regulation (EU)
- **CCPA**: California Consumer Privacy Act
- Data export functionality
- Right to deletion
- Privacy policy and terms of service

## 🐛 Troubleshooting

### Common Issues

#### Metro bundler issues
```bash
# Clear cache and restart
npx expo start --clear
```

#### iOS build issues
```bash
# Clean iOS build
cd ios && pod install && cd ..
npx expo run:ios
```

#### Android build issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..
npx expo run:android
```

#### TypeScript errors
```bash
# Regenerate types
npx expo customize tsconfig.json
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work*

## 🙏 Acknowledgments

- American Diabetes Association (ADA) for health guidelines
- World Health Organization (WHO) for health standards
- USDA FoodData Central for nutrition data
- Expo team for the amazing framework
- React Native community

## 📞 Support

- **Email**: support@yourapp.com
- **Documentation**: https://docs.yourapp.com
- **Issues**: https://github.com/yourusername/metabolic-health/issues
- **Discord**: https://discord.gg/yourserver

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Core health tracking
- ✅ Meal planning
- ✅ Education content
- ✅ Basic analytics

### Version 1.1 (Q1 2026)
- 🔄 Backend integration
- 🔄 Real-time sync
- 🔄 Push notifications
- 🔄 Premium features

### Version 1.2 (Q2 2026)
- 📱 Apple HealthKit integration
- 📱 Google Fit integration
- 🤖 AI-powered insights
- 📊 Advanced analytics

### Version 2.0 (Q3 2026)
- 👨‍⚕️ Telemedicine integration
- 🏥 Healthcare provider portal
- 📋 Lab results integration
- 🌐 Multi-language support

---

**Built with ❤️ for better health management**
