import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { lowCarbRecipes, Recipe as LowCarbRecipe } from '../../../data/recipes/lowCarbRecipes';
import { Recipe } from '../../../data/recipes';
import { useAuth } from '../../../contexts/AuthContext';
import { DatabaseService } from '../../../services/supabase/database';
import { useTheme } from '../../../context/ThemeContext';
import { NutritionCalculator } from '../../../services/nutrition/NutritionCalculator';
import { useDispatch, useSelector } from 'react-redux';
import { store, RootState } from '../../../store/store';
import { getRecipeDetailsById } from '../../../store/slices/mealSlice';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentRecipeDetails, apiLoading } = useSelector((state: RootState) => state.meal);
  const [recipe, setRecipe] = useState<Recipe | LowCarbRecipe | null>(null);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [computedNutrition, setComputedNutrition] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    const loadRecipe = async () => {
      console.log('🔍 Loading recipe with ID:', id);
      console.log('🔍 Type of ID:', typeof id);
      
      // First check local recipes
      let foundRecipe = lowCarbRecipes.find(r => String(r.id) === String(id));
      console.log('🔍 Found in local recipes:', !!foundRecipe);

      if (!foundRecipe) {
        // Check if it's in the online recipes from search results
        const state = store.getState();
        const online = (state?.meal?.onlineRecipes || []) as any[];
        const match = online.find((r: any) => String(r.id) === String(id));
        
        if (match) {
          // If we have basic info but no full details, fetch from API
          const recipeId = Number(match.id);
          if (!isNaN(recipeId) && (!match.ingredients || match.ingredients.length === 0)) {
            setIsLoadingDetails(true);
            await dispatch(getRecipeDetailsById(recipeId) as any);
            setIsLoadingDetails(false);
            return; // Recipe will be set from Redux state
          }
          foundRecipe = match as any;
        } else {
          // Try to fetch from API if it's a numeric ID
          const recipeId = Number(id);
          if (!isNaN(recipeId)) {
            setIsLoadingDetails(true);
            await dispatch(getRecipeDetailsById(recipeId) as any);
            setIsLoadingDetails(false);
            return; // Recipe will be set from Redux state
          }
        }
      }

      console.log('✅ Recipe loaded:', foundRecipe ? foundRecipe.name : 'NOT FOUND');
      setRecipe(foundRecipe || null);
      
      // Compute nutrition from ingredients if available
      if (foundRecipe && foundRecipe.ingredients && foundRecipe.ingredients.length > 0) {
        const computed = NutritionCalculator.calculateRecipeNutrition(foundRecipe.ingredients);
        const perServing = NutritionCalculator.calculatePerServing(computed, foundRecipe.servings);
        setComputedNutrition(perServing);
      }
    };

    loadRecipe();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, dispatch]);

  // Update recipe when API data is loaded
  useEffect(() => {
    if (currentRecipeDetails && String(currentRecipeDetails.id) === String(id)) {
      setRecipe(currentRecipeDetails);
      
      // Compute nutrition from ingredients if available
      if (currentRecipeDetails.ingredients && currentRecipeDetails.ingredients.length > 0) {
        const computed = NutritionCalculator.calculateRecipeNutrition(currentRecipeDetails.ingredients);
        const perServing = NutritionCalculator.calculatePerServing(computed, currentRecipeDetails.servings);
        setComputedNutrition(perServing);
      }
    }
  }, [currentRecipeDetails, id]);

  if (isLoadingDetails || apiLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text, fontSize: 16 }]}>Loading recipe details...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text, fontSize: 16 }]}>Recipe not found</Text>
        <TouchableOpacity
          style={{ marginTop: 20, padding: 10, backgroundColor: '#FF9800', borderRadius: 8 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#FFFFFF' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getCategoryColor = () => {
    switch (recipe.category) {
      case 'breakfast': return ['#FFF3E0', '#FFFFFF'];
      case 'lunch': return ['#E3F2FD', '#FFFFFF'];
      case 'dinner': return ['#F3E5F5', '#FFFFFF'];
      case 'snack': return ['#E8F5E9', '#FFFFFF'];
      default: return ['#F5F5F5', '#FFFFFF'];
    }
  };

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const handleAddToMealPlan = async () => {
    if (!recipe) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { data: { user: current } } = await (await import('../../../services/supabase/config')).supabase.auth.getUser();
      const userId = current?.id || user?.id;
      if (!userId) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      // Persist as a single-meal plan entry for today for now
      const today = new Date();
      const mealPlan: any = {
        user_id: userId,
        name: `${recipe.name} plan`,
        description: 'Quick add from recipe detail',
        duration: 1,
        meals: [{ day: 1, meals: { lunch: { id: recipe.id, name: recipe.name } } }],
        total_calories: recipe.nutrition.calories,
        total_carbs: recipe.nutrition.carbs,
        total_protein: recipe.nutrition.protein,
        total_fat: recipe.nutrition.fat,
      };
      await DatabaseService.saveMealPlan(mealPlan);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Hero Section */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={isDarkMode ? (gradients.meal as [string, string, ...string[]]) : (getCategoryColor() as [string, string, ...string[]])}
          style={styles.heroGradient}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#FFFFFF' : '#1F2937'} />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>{(recipe as any).image || '🍽️'}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Recipe Header */}
          <View style={styles.headerSection}>
            <Text style={[styles.recipeName, { color: colors.text }]}>{recipe.name}</Text>
            <Text style={[styles.recipeDescription, { color: colors.textSecondary }]}>{recipe.description}</Text>

            {/* Meta Info */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={20} color="#FF9800" />
                <Text style={[styles.metaText, { color: colors.text }]}>{recipe.prepTime + recipe.cookTime} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={20} color="#FF9800" />
                <Text style={[styles.metaText, { color: colors.text }]}>{recipe.servings} servings</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="flame-outline" size={20} color="#FF9800" />
                <Text style={[styles.metaText, { color: colors.text }]}>{recipe.nutrition.calories} cal</Text>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {recipe.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#FFF3E0' }]}>
                  <Text style={[styles.tagText, { color: isDarkMode ? colors.text : '#FF9800' }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Nutrition Card */}
          <View style={styles.nutritionSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Facts</Text>
            <View style={[styles.nutritionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {computedNutrition ? computedNutrition.protein : recipe.nutrition.protein}g
                  </Text>
                  <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={[styles.nutritionValue, { color: colors.text }]}>
                    {computedNutrition ? computedNutrition.carbs : recipe.nutrition.carbs}g
                  </Text>
                  <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {computedNutrition ? computedNutrition.fat : recipe.nutrition.fat}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionRow}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {computedNutrition ? computedNutrition.fiber : recipe.nutrition.fiber}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Fiber</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {computedNutrition ? computedNutrition.sugar : recipe.nutrition.sugar}g
                  </Text>
                  <Text style={styles.nutritionLabel}>Sugar</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {computedNutrition ? computedNutrition.calories : recipe.nutrition.calories}
                  </Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('ingredients');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('instructions');
              }}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.tabTextActive]}>
                Instructions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'ingredients' ? (
            <View style={styles.contentSection}>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientDot} />
                    <Text style={[styles.ingredientText, { color: colors.text }]}>
                      <Text style={styles.ingredientAmount}>
                        {ingredient.amount} {(ingredient as any).unit || ''}
                      </Text>
                      {' '}{(ingredient as any).name || (ingredient as any).item}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No ingredients available
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.contentSection}>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.instructionText, { color: colors.text }]}>{instruction}</Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No instructions available
                </Text>
              )}
            </View>
          )}

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToMealPlan}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add to Meal Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    height: 280,
  },
  heroGradient: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  heroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmoji: {
    fontSize: 120,
  },
  difficultyBadge: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    padding: 20,
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  nutritionSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  nutritionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  nutritionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FF9800',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9800',
    marginTop: 6,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  ingredientAmount: {
    fontWeight: 'bold',
    color: '#FF9800',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF9800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
