import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Easing, DimensionValue } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base Skeleton component with shimmer animation
 * Used as a placeholder while content is loading
 */
export default function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const { isDarkMode, colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const baseColor = isDarkMode ? colors.surfaceSecondary : colors.borderLight;
  const highlightColor = isDarkMode ? colors.border : colors.surfaceSecondary;

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}


/**
 * CardSkeleton - Skeleton placeholder for recipe/health cards
 */
export function CardSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.cardContainer, style]}>
      {/* Image placeholder */}
      <Skeleton width="100%" height={120} borderRadius={12} />
      
      {/* Title placeholder */}
      <View style={styles.cardContent}>
        <Skeleton width="80%" height={18} borderRadius={4} style={styles.marginBottom} />
        
        {/* Description placeholder */}
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.marginBottomSmall} />
        <Skeleton width="60%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

/**
 * ListSkeleton - Skeleton placeholder for list items
 */
export function ListSkeleton({ 
  count = 3,
  showAvatar = false,
  style,
}: { 
  count?: number;
  showAvatar?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
          {showAvatar && (
            <Skeleton width={48} height={48} borderRadius={24} style={styles.avatar} />
          )}
          <View style={styles.listContent}>
            <Skeleton width="70%" height={16} borderRadius={4} style={styles.marginBottomSmall} />
            <Skeleton width="50%" height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * ProfileSkeleton - Skeleton placeholder for profile sections
 */
export function ProfileSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.profileContainer, style]}>
      {/* Avatar */}
      <Skeleton width={80} height={80} borderRadius={40} style={styles.profileAvatar} />
      
      {/* Name */}
      <Skeleton width={150} height={20} borderRadius={4} style={styles.marginBottom} />
      
      {/* Email/subtitle */}
      <Skeleton width={200} height={14} borderRadius={4} />
    </View>
  );
}

/**
 * RecipeSkeleton - Skeleton placeholder for recipe details
 */
export function RecipeSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.recipeContainer, style]}>
      {/* Hero image */}
      <Skeleton width="100%" height={200} borderRadius={0} />
      
      <View style={styles.recipeContent}>
        {/* Title */}
        <Skeleton width="90%" height={24} borderRadius={4} style={styles.marginBottom} />
        
        {/* Meta info row */}
        <View style={styles.metaRow}>
          <Skeleton width={60} height={14} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </View>
        
        {/* Description */}
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.marginBottomSmall} />
        <Skeleton width="100%" height={14} borderRadius={4} style={styles.marginBottomSmall} />
        <Skeleton width="70%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    opacity: 0.5,
  },
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 12,
  },
  marginBottom: {
    marginBottom: 12,
  },
  marginBottomSmall: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profileAvatar: {
    marginBottom: 16,
  },
  recipeContainer: {
    backgroundColor: 'transparent',
  },
  recipeContent: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingRight: 40,
  },
});
