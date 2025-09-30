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
import LoadingScreen from '../../component/common/LoadingScreen';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MealScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(lowCarbRecipes);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const imageSlideAnim = new Animated.Value(-200);
  const imageSpinAnim = new Animated.Value(0);

  useEffect(() => {
    // Simulate loading recipes
    const loadRecipes = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Reduced to 1.5 seconds
      setLoading(false);
      
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
    let recipes = lowCarbRecipes;

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF9800"
            colors={['#FF9800']}
          />
        }
      >
        {/* Hero Header with Stats */}
        <LinearGradient
          colors={gradients.meal as [string, string, ...string[]]}
          style={styles.heroSection}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            {/* Animated Food Image */}
            <Animated.View
              style={[
                styles.foodImageContainer,
                {
                  transform: [
                    { translateX: imageSlideAnim },
                    {
                      rotate: imageSpinAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ]
                }
              ]}
            >
              <Image
                source={require('../../assets/images/meal.png')}
                style={styles.foodImage}
                resizeMode="contain"
              />
            </Animated.View>

            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋</Text>
                <Text style={styles.heroTitle}>What's cooking today?</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="person-circle" size={40} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{filteredRecipes.length}</Text>
                <Text style={styles.statLabel}>Recipes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>1.2k</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Search Bar - Floating over gradient */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={22} color={isDarkMode ? '#FBBF24' : '#FF9800'} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search healthy recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textTertiary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Pills */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  { backgroundColor: colors.surface },
                  selectedCategory === category.id && styles.categoryPillActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(category.id);
                }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.categoryIconWrapper,
                  selectedCategory === category.id && styles.categoryIconWrapperActive
                ]}>
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={selectedCategory === category.id ? '#FFFFFF' : '#FF9800'}
                  />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  { color: colors.text },
                  selectedCategory === category.id && styles.categoryLabelActive
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Diet Tags */}
        {selectedTags.length > 0 || tags.length > 0 ? (
          <View style={styles.tagsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Diet Preferences</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScroll}
            >
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagBadge,
                    selectedTags.includes(tag) && styles.tagBadgeActive
                  ]}
                  onPress={() => toggleTag(tag)}
                  activeOpacity={0.7}
                >
                  {selectedTags.includes(tag) && (
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  )}
                  <Text style={[
                    styles.tagLabel,
                    selectedTags.includes(tag) && styles.tagLabelActive
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Recipe Grid with Better Spacing */}
        <View style={styles.recipesSection}>
          <View style={styles.recipeHeader}>
            <View>
              <Text style={[styles.recipesTitle, { color: colors.text }]}>Discover Recipes</Text>
              <Text style={[styles.recipesSubtitle, { color: colors.textSecondary }]}>{filteredRecipes.length} delicious options</Text>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="funnel-outline" size={20} color={isDarkMode ? '#FBBF24' : '#FF9800'} />
            </TouchableOpacity>
          </View>

          {filteredRecipes.length > 0 ? (
            <View style={styles.recipeGrid}>
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  index={index}
                  onPress={() => router.push(`/meal/recipe/${recipe.id}` as any)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No recipes found</Text>
              <Text style={styles.emptyText}>Try adjusting your filters</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          // Open camera or add meal
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
  // Hero Section
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  foodImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 24,
  },
  heroGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
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
});
