Repositories Structure

- health/
  - HealthReadingsRepository.ts (blood sugar, blood pressure, weight, meds)
- users/
  - UserProfileRepository.ts (re-export)
- nutrition/
  - RecipesRepository.ts
  - FoodLogsRepository.ts
  - MealPlansRepository.ts
- notifications/
  - NotificationsRepository.ts
- settings/
  - UserSettingsRepository.ts
- education/
  - EducationRepository.ts
- gamification/
  - AchievementsRepository.ts
  - UserPointsRepository.ts

Use `services/supabase/repositories/index.ts` to import from a single place.

