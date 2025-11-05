import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { MealRecommendation } from '../../services/MealRecommendationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RecommendationCardProps {
  recommendation: MealRecommendation;
  onPress: () => void;
}

export default function RecommendationCard({ recommendation, onPress }: RecommendationCardProps) {
  const { colors, isDarkMode } = useTheme();
  const { recipe, reason, priority, healthFlags } = recommendation;

  const getPriorityColor = (): [string, string] => {
    switch (priority) {
      case 3: return ['#FF4444', '#CC2222']; // Critical - Red
      case 2: return ['#FF9800', '#F57C00']; // High - Orange
      case 1: return ['#4CAF50', '#388E3C']; // Medium - Green
      default: return ['#2196F3', '#1976D2']; // Low - Blue
    }
  };

  const getHealthFlagIcon = (flag: string) => {
    switch (flag) {
      case 'blood-sugar-friendly': return 'heart';
      case 'weight-management': return 'scale';
      case 'blood-pressure-friendly': return 'medical';
      case 'low-gi': return 'checkmark-circle';
      case 'high-fiber': return 'leaf';
      case 'high-protein': return 'nutrition';
      case 'low-sodium': return 'water';
      case 'heart-healthy': return 'heart';
      default: return 'checkmark-circle';
    }
  };

  const getHealthFlagLabel = (flag: string) => {
    switch (flag) {
      case 'blood-sugar-friendly': return 'Blood Sugar';
      case 'weight-management': return 'Weight';
      case 'blood-pressure-friendly': return 'BP Friendly';
      case 'low-gi': return 'Low GI';
      case 'high-fiber': return 'High Fiber';
      case 'high-protein': return 'High Protein';
      case 'low-sodium': return 'Low Sodium';
      case 'heart-healthy': return 'Heart Healthy';
      default: return flag;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={getPriorityColor()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Priority Badge */}
        <View style={styles.priorityBadge}>
          <Ionicons
            name={priority >= 2 ? 'warning' : 'checkmark-circle'}
            size={16}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.content}>
          {/* Recipe Title */}
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {recipe.name}
          </Text>

          {/* Reason */}
          <Text style={styles.reason} numberOfLines={2}>
            {reason}
          </Text>

          {/* Health Flags */}
          {healthFlags.length > 0 && (
            <View style={styles.healthFlags}>
              {healthFlags.slice(0, 3).map((flag, index) => (
                <View key={index} style={styles.healthFlag}>
                  <Ionicons
                    name={getHealthFlagIcon(flag) as any}
                    size={14}
                    color="#FFFFFF"
                  />
                  <Text style={styles.healthFlagText}>
                    {getHealthFlagLabel(flag)}
                  </Text>
                </View>
              ))}
              {healthFlags.length > 3 && (
                <Text style={styles.moreFlagsText}>+{healthFlags.length - 3}</Text>
              )}
            </View>
          )}

          {/* Recipe Stats */}
          <View style={styles.recipeStats}>
            <View style={styles.stat}>
              <Ionicons name="time" size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{recipe.prepTime + recipe.cookTime}m</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="flame" size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{recipe.nutrition.calories}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{recipe.rating}</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 120,
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 18,
  },
  healthFlags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  healthFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  healthFlagText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  moreFlagsText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipeStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
