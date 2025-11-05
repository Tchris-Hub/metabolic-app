-- ============================================
-- VERIFY ALL TABLES WERE CREATED
-- ============================================
-- Run this query to check if all 27 tables exist

SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected tables (27 total):
-- 1. achievements
-- 2. education_progress
-- 3. favorite_meals
-- 4. food_items
-- 5. food_logs
-- 6. health_alerts
-- 7. health_goals
-- 8. health_insights
-- 9. health_readings
-- 10. health_reports
-- 11. meal_plans
-- 12. meal_ratings
-- 13. meal_recommendations
-- 14. notification_schedules
-- 15. notifications
-- 16. quiz_results
-- 17. recent_meals
-- 18. recipes
-- 19. subscription_history
-- 20. user_activity_log
-- 21. user_points
-- 22. user_profiles
-- 23. user_settings
