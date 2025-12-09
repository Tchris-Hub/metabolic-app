import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Skeleton, { CardSkeleton, ListSkeleton, ProfileSkeleton, RecipeSkeleton } from '../ui/Skeleton';

export type SkeletonVariant = 'spinner' | 'card' | 'list' | 'profile' | 'recipe' | 'dashboard';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  variant?: SkeletonVariant;
  count?: number;
}

/**
 * LoadingScreen component with skeleton loader support
 * Supports different skeleton variants for different screen types
 */
export default function LoadingScreen({ 
  message = 'Loading...', 
  fullScreen = true,
  variant = 'spinner',
  count = 3,
}: LoadingScreenProps) {
  const { colors } = useTheme();

  const renderContent = () => {
    switch (variant) {
      case 'card':
        return (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: count }).map((_, index) => (
              <CardSkeleton key={index} style={styles.cardMargin} />
            ))}
          </View>
        );
      
      case 'list':
        return (
          <View style={styles.skeletonContainer}>
            <ListSkeleton count={count} showAvatar />
          </View>
        );
      
      case 'profile':
        return (
          <View style={styles.skeletonContainer}>
            <ProfileSkeleton />
          </View>
        );
      
      case 'recipe':
        return (
          <View style={styles.skeletonContainer}>
            <RecipeSkeleton />
          </View>
        );
      
      case 'dashboard':
        return (
          <View style={styles.skeletonContainer}>
            {/* Header skeleton */}
            <View style={styles.dashboardHeader}>
              <Skeleton width={120} height={24} borderRadius={4} />
              <Skeleton width={40} height={40} borderRadius={20} />
            </View>
            
            {/* Stats cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Skeleton width="100%" height={80} borderRadius={12} />
              </View>
              <View style={styles.statCard}>
                <Skeleton width="100%" height={80} borderRadius={12} />
              </View>
            </View>
            
            {/* Main content cards */}
            {Array.from({ length: 2 }).map((_, index) => (
              <CardSkeleton key={index} style={styles.cardMargin} />
            ))}
          </View>
        );
      
      case 'spinner':
      default:
        return (
          <>
            <ActivityIndicator size="large" color={colors.info} />
            {message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
          </>
        );
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        fullScreen && styles.fullScreen,
        { backgroundColor: colors.background }
      ]}
    >
      {renderContent()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  skeletonContainer: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  cardMargin: {
    marginBottom: 16,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
});
