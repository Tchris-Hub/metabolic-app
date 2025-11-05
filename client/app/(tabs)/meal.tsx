import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { lowCarbRecipes, searchRecipes, Recipe } from '../../data/recipes/lowCarbRecipes';
import RecipeCard from '../../component/nutrition/RecipeCard';
import RecommendationCard from '../../component/nutrition/RecommendationCard';
import LoadingScreen from '../../component/common/LoadingScreen';
import { useTheme } from '../../context/ThemeContext';
import { MealRecommendationService, MealRecommendation } from '../../services/MealRecommendationService';
import { HealthAggregationService } from '../../services/HealthAggregationService';
import { supabase } from '../../services/supabase/config';
import { MealRepository } from '../../services/supabase/repositories/meal/MealRepository';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { searchRecipesOnline, getRandomRecipesOnline } from '../../store/slices/mealSlice';
import { recipes } from '../../data/recipes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function MealScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [recommendations, setRecommendations] = useState<MealRecommendation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Filter modal state
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);

  // Redux state
  const { onlineRecipes, apiLoading, apiError } = useSelector((state: RootState) => state.meal);

  // Use online recipes if available, otherwise fall back to local recipes
  const currentDisplayRecipes = onlineRecipes.length > 0 ? onlineRecipes : filteredRecipes;

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const imageSlideAnim = React.useRef(new Animated.Value(-200)).current;
  const imageSpinAnim = React.useRef(new Animated.Value(0)).current;

  // Diet options
  const dietOptions = [
    { id: 'ketogenic', label: 'Keto', icon: '⚡' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥗' },
    { id: 'high-protein', label: 'High Protein', icon: '💪' },
    { id: 'paleo', label: 'Paleo', icon: '🌿' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛❌' },
  ];

  const cuisineOptions = [
    { id: 'african', label: 'African', icon: '🌍' },
    { id: 'nigerian', label: 'Nigerian', icon: '🇳🇬' },
    { id: 'italian', label: 'Italian', icon: '🇮🇹' },
    { id: 'mexican', label: 'Mexican', icon: '🇲🇽' },
    { id: 'asian', label: 'Asian', icon: '🥢' },
    { id: 'american', label: 'American', icon: '🇺🇸' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { id: 'indian', label: 'Indian', icon: '🇮🇳' },
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 2) {
      // Search online if query is meaningful
      const filters: any = {};
      if (selectedDiets.length > 0) {
        filters.diet = selectedDiets[0]; // Spoonacular supports one diet at a time
      }
      if (selectedCuisines.length > 0) {
        filters.cuisine = selectedCuisines[0]; // One cuisine at a time
      }

      dispatch(searchRecipesOnline({ query, filters }) as any);
    } else if (query.length === 0) {
      // Clear online results when search is cleared
      setFilteredRecipes(lowCarbRecipes);
    }
  };

  const toggleDiet = (dietId: string) => {
    setSelectedDiets(prev =>
      prev.includes(dietId)
        ? prev.filter(d => d !== dietId)
        : [dietId] // Only allow one diet at a time
    );
  };

  const toggleCuisine = (cuisineId: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisineId)
        ? prev.filter(c => c !== cuisineId)
        : [cuisineId] // Only allow one cuisine at a time
    );
  };

  const applyFilters = () => {
    setShowFilters(false);

    if (searchQuery.length > 2) {
      // Re-search with current filters
      handleSearch(searchQuery);
    } else {
      // Get random recipes with filters if no search query
      dispatch(getRandomRecipesOnline({
        count: 20,
        tags: [...selectedDiets, ...selectedCuisines]
      }) as any);
    }
  };

  const clearFilters = () => {
    setSelectedDiets([]);
    setSelectedCuisines([]);
    setShowFilters(false);

    if (searchQuery.length > 0) {
      handleSearch(searchQuery);
    } else {
      setFilteredRecipes(lowCarbRecipes);
    }
  };

  const initializeRecommendations = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setCurrentUserId(user.id);

        // Example: Fetch meal plans from Supabase using the shared repository pattern
        // This mirrors how the Learn screen calls Supabase via EducationRepository
        try {
          const plans = await MealRepository.getMealPlans(user.id);
          console.log('🍽️ Loaded meal plans from Supabase:', plans?.length || 0);
        } catch (e) {
          console.warn('Failed to load meal plans', e);
        }

        // Load personalized recommendations (local algorithm)
        const personalizedRecommendations = await MealRecommendationService.getPersonalizedRecommendations(
          user.id,
          recipes, // Use the full recipe dataset
          3
        );

        setRecommendations(personalizedRecommendations);
      } else {
        // No user logged in, use default recommendations
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Failed to initialize recommendations:', error);
      setRecommendations([]);
    }
  };

  useEffect(() => {
    // Load initial recipes
    const loadRecipes = async () => {
      try {
        setLoading(true);
        // Load local recipes first
        setFilteredRecipes(lowCarbRecipes);
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);

        // Get current user and load recommendations
        await initializeRecommendations();
      } catch (error) {
        console.error('Failed to load recipes:', error);
        setLoading(false);
      }

      // Start animations AFTER loading is complete
      setTimeout(() => {
        // Slide in image from left
        Animated.timing(imageSlideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          // Start continuous spinning after slide-in
          Animated.loop(
            Animated.timing(imageSpinAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            })
          ).start();
        });

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
    };

    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [searchQuery, selectedCategory, selectedTags]);

  const filterRecipes = () => {
    let recipes = [...lowCarbRecipes];

    if (searchQuery) {
      recipes = searchRecipes(searchQuery);
    }

    if (selectedCategory !== 'all') {
      recipes = recipes.filter(r => r.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      recipes = recipes.filter(r =>
        selectedTags.some(tag => r.tags.includes(tag))
      );
    }

    setFilteredRecipes(recipes);
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'breakfast', label: 'Breakfast', icon: 'sunny' },
    { id: 'lunch', label: 'Lunch', icon: 'restaurant' },
    { id: 'dinner', label: 'Dinner', icon: 'moon' },
    { id: 'snack', label: 'Snacks', icon: 'nutrition' },
  ];

  const tags = ['low-carb', 'high-protein', 'keto', 'quick', 'vegetarian'];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleTag = (tag: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate refreshing recipes
    setTimeout(() => {
      filterRecipes();
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);
  };

  // Show loading screen while recipes are being loaded
  if (loading) {
    return <LoadingScreen message="Loading delicious recipes..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.scrollContent}>
          {/* Hero Section with Orange Gradient */}
          <LinearGradient
            colors={['#FF9800', '#F57C00', '#E65100']}
            style={styles.heroSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Rotating Food Animation */}
            <View style={styles.foodImageContainer}>
              <Animated.View
                style={[
                  styles.foodImageWrapper,
                  {
                    transform: [
                      { translateX: imageSlideAnim },
                      {
                        rotate: imageSpinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.foodEmoji}>🍽️</Text>
              </Animated.View>
            </View>

            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting} numberOfLines={1}>Good morning! 👋</Text>
                <Text style={styles.heroTitle} numberOfLines={1}>What would you like to eat?</Text>
              </View>
              
            </View>

            {/* Subtle Stats - Less Prominent */}
            <View style={styles.statsRow}>
              <View style={styles.statCardSubtle}>
                <Text style={styles.statNumberSubtle}>1,247</Text>
                <Text style={styles.statLabelSubtle}>cal</Text>
              </View>
              <View style={styles.statCardSubtle}>
                <Text style={styles.statNumberSubtle}>8.2g</Text>
                <Text style={styles.statLabelSubtle}>protein</Text>
              </View>
              <View style={styles.statCardSubtle}>
                <Text style={styles.statNumberSubtle}>12g</Text>
                <Text style={styles.statLabelSubtle}>carbs</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Search Bar - Floating over gradient */}
          <View style={styles.searchWrapper}>
            <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
              <Ionicons name="search" size={22} color={isDarkMode ? '#FBBF24' : '#FF9800'} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search healthy recipes..."
                value={searchQuery}
                onChangeText={handleSearch}
                placeholderTextColor={colors.textTertiary}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => handleSearch('')}>
                  <Ionicons name="close-circle" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Personalized Recommendations */}
          {recommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <View style={styles.recommendationsHeader}>
                <View>
                  <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                    Personalized for You
                  </Text>
                  <Text style={[styles.recommendationsSubtitle, { color: colors.textSecondary }]}>
                    Based on your health data
                  </Text>
                </View>
                <TouchableOpacity style={styles.refreshButton}>
                  <Ionicons name="refresh" size={20} color={isDarkMode ? '#FBBF24' : '#FF9800'} />
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recommendationsScroll}
              >
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={rec.recipe.id}
                    recommendation={rec}
                    onPress={() => router.push(`/meal/recipe/${rec.recipe.id}` as any)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Recipe Grid with Better Spacing */}
          <View style={styles.recipesSection}>
            <View style={styles.recipeHeader}>
              <View>
                <Text style={[styles.recipesTitle, { color: colors.text }]}>
                  {onlineRecipes.length > 0 ? 'Search Results' : 'Discover Recipes'}
                </Text>
                <Text style={[styles.recipesSubtitle, { color: colors.textSecondary }]}>
                  {currentDisplayRecipes.length} {onlineRecipes.length > 0 ? 'results' : 'delicious options'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters(true)}
              >
                <Ionicons name="funnel-outline" size={20} color={isDarkMode ? '#FBBF24' : '#FF9800'} />
                {(selectedDiets.length > 0 || selectedCuisines.length > 0) && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>
                      {selectedDiets.length + selectedCuisines.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {apiLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Searching online recipes...
                </Text>
              </View>
            ) : currentDisplayRecipes.length > 0 ? (
              <View style={styles.recipeGrid}>
                {currentDisplayRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe as any}
                    index={index}
                    onPress={() => {
                      console.log('📍 Navigating to recipe:', recipe.id);
                      console.log('📍 Recipe name:', recipe.name);
                      console.log('📍 Navigation path:', `/meal/recipe/${recipe.id}`);
                      router.push(`/meal/recipe/${recipe.id}` as any);
                    }}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🍽️</Text>
                <Text style={styles.emptyTitle}>No recipes found</Text>
                <Text style={styles.emptyText}>Try adjusting your search</Text>
              </View>
            )}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/meal/add' as any);
        }}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#FF9800', '#F57C00']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Modal */}
      {showFilters && (
        <View style={styles.filterModalOverlay}>
          <TouchableOpacity
            style={styles.filterModalOverlay}
            activeOpacity={1}
            onPress={() => setShowFilters(false)}
          />
          <Animated.View
            style={[
              styles.filterModal,
              { backgroundColor: colors.surface },
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={[styles.filterModalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>
                Filter Recipes
              </Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Diet Preferences */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Diet Preferences
              </Text>
              <View style={styles.filterOptions}>
                {dietOptions.map((diet) => (
                  <TouchableOpacity
                    key={diet.id}
                    style={[
                      styles.filterOption,
                      { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: isDarkMode ? colors.border : '#E5E7EB' },
                      selectedDiets.includes(diet.id) && styles.filterOptionActive,
                    ]}
                    onPress={() => toggleDiet(diet.id)}
                  >
                    <Text style={styles.filterOptionIcon}>{diet.icon}</Text>
                    <Text
                      style={[
                        styles.filterOptionLabel,
                        { color: colors.text },
                        selectedDiets.includes(diet.id) && styles.filterOptionLabelActive,
                      ]}
                    >
                      {diet.label}
                    </Text>
                    {selectedDiets.includes(diet.id) && (
                      <Ionicons name="checkmark" size={16} color="#FF9800" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Cuisine Preferences */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Cuisine
              </Text>
              <View style={styles.filterOptions}>
                {cuisineOptions.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine.id}
                    style={[
                      styles.filterOption,
                      { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: isDarkMode ? colors.border : '#E5E7EB' },
                      selectedCuisines.includes(cuisine.id) && styles.filterOptionActive,
                    ]}
                    onPress={() => toggleCuisine(cuisine.id)}
                  >
                    <Text style={styles.filterOptionIcon}>{cuisine.icon}</Text>
                    <Text
                      style={[
                        styles.filterOptionLabel,
                        { color: colors.text },
                        selectedCuisines.includes(cuisine.id) && styles.filterOptionLabelActive,
                      ]}
                    >
                      {cuisine.label}
                    </Text>
                    {selectedCuisines.includes(cuisine.id) && (
                      <Ionicons name="checkmark" size={16} color="#FF9800" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filter Actions */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.filterClearButton}
                onPress={clearFilters}
              >
                <Text style={styles.filterClearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterApplyButton}
                onPress={applyFilters}
              >
                <Text style={styles.filterApplyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Hero Section - Compact on small screens
  heroSection: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 20,
    overflow: 'hidden',
    minHeight: Math.max(180, SCREEN_WIDTH * 0.55),
  },
  foodImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  foodImageWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 55,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  foodEmoji: {
    fontSize: 70,
  },
  foodImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // Subtle Stats - Less Prominent
  statCardSubtle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  statNumberSubtle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statLabelSubtle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  // Search
  searchWrapper: {
    paddingHorizontal: 20,
    marginTop: -24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  // Categories
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryPill: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillActive: {
    backgroundColor: '#FF9800',
    shadowOpacity: 0.2,
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrapperActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  // Tags
  tagsSection: {
    marginBottom: 24,
  },
  tagsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  tagBadgeActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#4CAF50',
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  tagLabelActive: {
    color: '#4CAF50',
  },
  // Recipes
  recipesSection: {
    paddingHorizontal: 20,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  recipesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  recipesSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Recommendations
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  // Filter Modal
  filterModalOverlay: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterSection: {
    marginTop: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  filterOptionActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  filterOptionIcon: {
    fontSize: 16,
  },
  filterOptionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterOptionLabelActive: {
    color: '#FF9800',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  filterClearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  filterClearButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  filterApplyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FF9800',
    alignItems: 'center',
  },
  filterApplyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  }
});

export default MealScreen;
