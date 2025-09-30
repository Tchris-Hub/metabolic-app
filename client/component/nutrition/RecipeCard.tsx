import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Recipe } from '../../data/recipes/lowCarbRecipes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  index: number;
}

export default function RecipeCard({ recipe, onPress, index }: RecipeCardProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress();
  };

  const getCategoryColor = () => {
    switch (recipe.category) {
      case 'breakfast': return ['#FFF3E0', '#FFFFFF'];
      case 'lunch': return ['#E3F2FD', '#FFFFFF'];
      case 'dinner': return ['#F3E5F5', '#FFFFFF'];
      case 'snack': return ['#E8F5E9', '#FFFFFF'];
      default: return ['#F5F5F5', '#FFFFFF'];
    }
  };

  const getCategoryIcon = () => {
    switch (recipe.category) {
      case 'breakfast': return 'sunny';
      case 'lunch': return 'restaurant';
      case 'dinner': return 'moon';
      case 'snack': return 'nutrition';
      default: return 'restaurant';
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={getCategoryColor() as [string, string, ...string[]]}
          style={styles.gradient}
        >
          {/* Recipe Image/Emoji */}
          <View style={styles.imageContainer}>
            <Text style={styles.emoji}>{recipe.image}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>

          {/* Recipe Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.recipeName} numberOfLines={2}>
              {recipe.name}
            </Text>

            {/* Time & Servings */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{recipe.prepTime + recipe.cookTime}m</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color="#6B7280" />
                <Text style={styles.metaText}>{recipe.servings}</Text>
              </View>
            </View>

            {/* Nutrition Highlights */}
            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>cal</Text>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>carbs</Text>
              </View>
              <View style={styles.nutritionDivider} />
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>protein</Text>
              </View>
            </View>

            {/* Category Icon */}
            <View style={styles.categoryIcon}>
              <Ionicons name={getCategoryIcon() as any} size={16} color="#9CA3AF" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    padding: 12,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  emoji: {
    fontSize: 64,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  infoContainer: {
    position: 'relative',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    minHeight: 40,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  nutritionContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  nutritionDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  categoryIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
