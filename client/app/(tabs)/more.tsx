import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

export default function MoreScreen() {
  const [isPremium] = useState(false);
  const { isDarkMode, toggleTheme, colors, gradients } = useTheme();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
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
  }, []);

  const settingsCategories = [
    {
      id: 'preferences',
      title: 'App Preferences',
      icon: 'settings-outline',
      color: '#2196F3',
      route: '/more/preferences',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      color: '#FF9800',
      route: '/more/notifications',
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-checkmark-outline',
      color: '#4CAF50',
      route: '/more/privacy',
    },
    {
      id: 'data',
      title: 'Data & Reports',
      icon: 'document-text-outline',
      color: '#9C27B0',
      route: '/more/data',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#E91E63',
      route: '/more/help',
    },
  ];

  const quickActions = [
    { id: 'export', title: 'Export Data', icon: 'download-outline' },
    { id: 'share', title: 'Share App', icon: 'share-social-outline' },
    { id: 'rate', title: 'Rate Us', icon: 'star-outline' },
  ];

  const handleToggleDarkMode = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={gradients.more as [string, string, ...string[]]}
          style={styles.heroSection}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>Settings & More ⚙️</Text>
                <Text style={styles.heroTitle}>Customize Your App</Text>
              </View>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>SJ</Text>
                </View>
                <View style={styles.avatarBadge}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Sarah Johnson</Text>
                <Text style={styles.profileEmail}>sarah.j@email.com</Text>
                {isPremium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Dark Mode Toggle */}
        <View style={[styles.darkModeSection, isDarkMode && styles.darkModeSectionDark]}>
          <View style={[styles.darkModeCard, isDarkMode && styles.darkModeCardDark]}>
            <View style={styles.darkModeInfo}>
              <View style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
                <Ionicons name={isDarkMode ? "moon" : "sunny"} size={24} color={isDarkMode ? "#FFD700" : "#FF9800"} />
              </View>
              <View style={styles.darkModeText}>
                <Text style={[styles.darkModeTitle, isDarkMode && styles.darkModeTitleDark]}>Dark Mode</Text>
                <Text style={[styles.darkModeSubtitle, isDarkMode && styles.darkModeSubtitleDark]}>
                  {isDarkMode ? 'Dark theme enabled' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#667eea' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Settings Categories */}
        <View style={[styles.settingsSection, isDarkMode && styles.settingsSectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Settings</Text>
          {settingsCategories.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                opacity: fadeAnim,
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + (index * 10)]
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={[styles.settingItem, isDarkMode && styles.settingItemDark]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(category.route as any);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIcon, { backgroundColor: `${category.color}20` }]}>
                  <Ionicons name={category.icon as any} size={24} color={category.color} />
                </View>
                <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{category.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#9CA3AF" : "#9CA3AF"} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={24} color="#667eea" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutText}>Health Tracker v1.0.0</Text>
          <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <Text style={styles.aboutLink}>Terms & Privacy</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  containerDark: {
    backgroundColor: '#111827',
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
    marginBottom: 24,
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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Dark Mode Section
  darkModeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  darkModeSectionDark: {
    // No additional styles needed
  },
  darkModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  darkModeCardDark: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  darkModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  darkModeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeIconDark: {
    backgroundColor: '#374151',
  },
  darkModeText: {
    flex: 1,
  },
  darkModeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  darkModeTitleDark: {
    color: '#F9FAFB',
  },
  darkModeSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  darkModeSubtitleDark: {
    color: '#9CA3AF',
  },
  settingsSectionDark: {
    // No additional styles needed
  },
  sectionTitleDark: {
    color: '#F9FAFB',
  },
  settingItemDark: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingTitleDark: {
    color: '#F9FAFB',
  },
  profileSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  profileGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  premiumSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  aboutSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  aboutLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
});
