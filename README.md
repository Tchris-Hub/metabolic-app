# Metabolic Health App — Setup & Launch Readme

This document tells you exactly what to provide so I can fully set up the app, add any needed services, and make it live in the stores.

If you already have some of these, check them off and share the credentials securely (see “How to deliver secrets safely”). If you don’t, I’ll create or configure them for you once you authorize me or share temporary access.


## 1) Quick checklist — What I need from you

Provide the following items. If something isn’t applicable, mark it N/A.

- App identity
  - App name (store display name)
  - Short tagline (optional)
  - Primary brand color and any accent colors (hex values)
  - App icon and splash screen assets (see specs below)
  - Support email address
  - Company/Developer name and website URL
  - Privacy Policy URL and Terms of Service URL

- Developer program access
  - Apple Developer Program: team invite (Admin/Developer) OR an App Store Connect API key (Issuer ID, Key ID, .p8 file)
  - Google Play Console: invite my Google account with Release Manager/Developer role
  - Expo account (if you already use one) OR allow me to create/use an Expo account and share project access

- Backend and third‑party services
  - Supabase project URL and anon/public key (and service role key if server-side tasks are needed)
  - Database schema status: confirm if the default schema from this repo should be applied (see section 6)
  - Push Notifications:
    - Firebase project (for Android/FCM): Server key and Sender ID (or access to your Firebase project)
    - Apple Push (APNs): Apple account access (I’ll generate a key) or provide an existing APNs key
  - Analytics/Crash reporting (optional):
    - Sentry DSN (if using Sentry)
    - Google Analytics/GA4 Measurement ID or alternative
  - Any other API keys the app uses (e.g., OpenAI, Stripe, custom APIs)

- Store listing materials
  - App description (short and full)
  - Keywords (iOS) / Tags (Android)
  - Category and subcategory
  - Age rating answers (Apple + Google questionnaires)
  - Content rating questionnaire responses (Google)
  - Screenshots per platform and device family (see specs below)
  - Feature/Promo graphics (Android) and App Preview videos (optional)
  - In-app purchase products (if any): list, pricing, and localization

- Release preferences
  - Version name/numbering policy (e.g., 1.0.0)
  - Release track for Google (Internal, Closed, Open, Production)
  - Release type for Apple (Manual release vs. automatic after approval)
  - Countries/regions to publish to
  - App pricing (Free or paid; if paid, price tiers)

- Legal and compliance
  - Data collection summary (what you collect and why)
  - Consent requirements (GDPR/CCPA/ATT prompts and text)
  - Third‑party data sharing disclosures (if any)


## 2) Credentials and access — exact items to share

- Apple
  - App Store Connect user invite OR API Key (Issuer ID, Key ID, .p8)
  - Apple Developer Program membership should be active
- Google
  - Play Console user invite (Release Manager) to manage builds and listings
  - Firebase project access for FCM (Editor role is sufficient)
- Expo / EAS
  - Existing Expo account credentials or invite my account to the project
  - If none exists, I’ll initialize under an agreed Expo account
- Supabase
  - Project URL and anon key for the client
  - Service role key if migrations/automation are needed
  - Access to Supabase dashboard for policies (optional but recommended)

Share via a password manager link (1Password/Bitwarden) or a secure channel. Never send secrets in plain email or chat.


## 3) Environment variables — what to provide and where

This project has a .env.example under:
- metabolic-health/client/.env.example

Please fill a copy as metabolic-health/client/.env with:
- SUPABASE_URL=
- SUPABASE_ANON_KEY=
- EXPO_PUBLIC_SUPABASE_URL= (if the app expects Expo public vars)
- EXPO_PUBLIC_SUPABASE_ANON_KEY=
- EXPO_PUBLIC_API_BASE= (if any external API is used)
- SENTRY_DSN= (optional)
- EXPO_PUBLIC_FIREBASE_SENDER_ID= (optional for notifications)
- EXPO_PUBLIC_FEATURE_FLAGS= (optional JSON string)

Notes:
- Prefix EXPO_PUBLIC_ for variables used on the client.
- Do not commit .env to git. I will set the same values in EAS secrets for cloud builds.


## 4) Brand assets — exact specs

- App Icon
  - 1024×1024 PNG, no transparency (Apple requirement), squared artwork centered
- Splash / Launch Screen
  - 1242×2436 (portrait) PNG background or 2048×2048 for adaptive scaling; provide brand color and centered logo (transparent PNG)
- Android Feature Graphic
  - 1024×500 PNG or JPG
- Screenshots
  - iOS: iPhone 6.7", 6.5", 5.5" at minimum; PNGs straight from device/simulator
  - Android: Phone (1080×1920 min), other form factors optional
- App Preview/Promo video (optional)
  - iOS App Preview: 15–30s MOV/MP4 in device aspect
  - Google Promo: YouTube URL

If you only have a logo, send the source file (SVG/AI/PSD) and I’ll export the required sizes.


## 5) Store listing content — what to write

- Title (30 chars iOS / 50 chars Android)
- Subtitle (30 chars, iOS)
- Short description (80 chars, Android)
- Full description (4000 chars max)
- Keywords (iOS, comma-separated)
- Category (Health & Fitness) + subcategory (if applicable)
- Support URL and Marketing URL
- Privacy Policy URL and Terms URL
- Contact email
- App rating/content questionnaire answers (I’ll provide forms if needed)

I can draft initial copy if you provide your value proposition and target audience.


## 6) Backend (Supabase) — what I need to know

- Do you want me to create a new Supabase project or use an existing one?
- Should I apply migrations/tables as used by this repo? Typical entities in this app include:
  - User profile
  - Health readings (blood sugar, blood pressure, weight)
  - Medication schedules/records
  - Content/recipes
- Confirm row‑level security policies (RLS): I will configure RLS so users only see their own data.
- If you already have data, provide export or schema so I can adapt queries.

If you want automated reports/cron, I may need service role key to create Edge Functions or cron jobs.


## 7) Notifications setup — what I need

- Firebase project (Android): project ID, Sender ID, Server key OR add me to Firebase
- Apple Push key (APNs) OR allow me to generate one in your Apple account
- Decision: in‑app vs. push and what triggers
- Copy for notification messages (optional)

I will wire this with Expo Notifications and configure credentials in EAS.


## 8) Analytics and crash reporting (optional but recommended)

- Choose provider: Sentry, Expo Notifications analytics, GA4, or Mixpanel
- Provide DSN/keys or allow me to create and share back
- Events you care about (e.g., log reading, complete quiz, open tip)


## 9) Build and release — how I’ll make it live

- iOS (App Store)
  1. Configure app.json and eas.json with bundleIdentifier, icons, splash, and permissions
  2. Set EAS secrets (ENV, keys)
  3. Build: `cd metabolic-health/client && npx eas build -p ios --profile production`
  4. Submit: `npx eas submit -p ios` (uses App Store Connect API key or session)
  5. Resolve any review feedback; release per your preference

- Android (Google Play)
  1. Configure app.json and eas.json with android.package, icons, splash, permissions
  2. Set EAS secrets (ENV, FCM key)
  3. Build: `cd metabolic-health/client && npx eas build -p android --profile production`
  4. Submit: `npx eas submit -p android`
  5. Assign release track and roll out per your preference

- Over‑the‑Air (OTA) updates
  - After initial store release, we can ship UI/JS updates via `npx expo publish` with proper release channels


## 10) Permissions and disclosures

Please confirm if the app requires any of the following so I can add the correct descriptions and store disclosures:
- Camera, Photos, Media, Files
- Health data collection specifics
- Background tasks/notifications
- Location or Bluetooth

I will align app.json manifests and store questionnaires accordingly.


## 11) How to deliver secrets safely

- Use a password manager share (1Password, Bitwarden, Proton Pass) or an expiring encrypted note
- Do not email credentials or paste them in chat
- For large files, use a private cloud folder (Google Drive/Dropbox) with restricted access


## 12) What I will hand back

- Updated repo with configurations
- Filled-in app.json/eas.json per your brand and identifiers
- .env (uncommitted) and EAS secrets set in your Expo project
- Build artifacts (IPA/AAB) and submission status
- Store listing drafts and final submissions
- A short operations guide for future releases and OTA updates


## 13) Optional enhancements you can choose now

- Sentry crash reporting + performance
- Feature flagging (Expo Updates channels)
- In‑app review prompts after milestones
- Deep links and universal links
- Monitoring dashboards (Supabase/Metabase)


## Send these items, and I’ll take it from there
Once you provide the checklist items above, I will configure everything, produce signed builds, submit to the stores, and guide you through approvals and go‑live.
