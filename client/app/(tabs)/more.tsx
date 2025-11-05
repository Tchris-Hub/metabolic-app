import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthService } from '../../services/supabase/auth';
import { UserProfileRepository } from '../../services/supabase/repositories/UserProfileRepository';
import Modal from '../../component/ui/Modal';
import { resetApp } from '../../utils/resetApp';

export default function MoreScreen() {
  const [isPremium] = useState(false);
  const { isDarkMode, toggleTheme, colors, gradients } = useTheme();
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string>('Guest');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [accountAction, setAccountAction] = useState<'logout' | 'delete' | null>(null);
  // Profile edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [editHeight, setEditHeight] = useState<string>('');
  const [editWeight, setEditWeight] = useState<string>('');
  const [editAge, setEditAge] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState(false);

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
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          setDisplayName('Guest');
          setEmail('');
          setEditAge('');
          setEditHeight('');
          setEditWeight('');
          return;
        }
        const authUser = AuthService.getUserData(user);
        setDisplayName(authUser.displayName || 'Guest');
        setEmail(authUser.email || '');
        // fetch profile details for age/height/weight
        const profile = await UserProfileRepository.getProfileByUserId(user.id);
        if (profile) {
          setEditAge(profile.age != null ? String(profile.age) : '');
          setEditHeight(profile.height != null ? String(profile.height) : '');
          setEditWeight(profile.weight != null ? String(profile.weight) : '');
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load profile. Please try again.');
        setDisplayName(user?.email?.split('@')[0] || 'Guest');
        setEmail(user?.email || '');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

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

  const handleConfirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setAccountAction('logout');
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await logout();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              try {
                await resetApp({ clearOnboarding: false });
              } catch (e) {
                // Fallback: navigate to login if hard reload fails
                router.replace('/screens/auth/login');
              }
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                'Logout failed',
                error instanceof Error ? error.message : 'Unable to log out right now.'
              );
            } finally {
              setAccountAction(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleConfirmAccountDeletion = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your health data, meal plans, and profile information. You will be signed out immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setAccountAction('delete');
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await AuthService.deleteAccount();
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              try {
                await resetApp({ clearOnboarding: true });
              } catch (e) {
                // Fallback: ensure onboarding flag cleared and navigate to onboarding screen
                router.replace('/screens/auth/PremiumOnboardingScreen');
              }
            } catch (error) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert(
                'Deletion failed',
                error instanceof Error ? error.message : 'Unable to delete your account right now.'
              );
            } finally {
              setAccountAction(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const isProcessingLogout = accountAction === 'logout';
  const isProcessingDelete = accountAction === 'delete';

  const getActionOpacity = (processing: boolean) => (processing ? 0.6 : 1);

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Not logged in', 'Please log in to update your profile.');
      return;
    }
    const height = editHeight ? Number(editHeight) : undefined;
    const weight = editWeight ? Number(editWeight) : undefined;
    const age = editAge ? Number(editAge) : undefined;

    // Basic validation
    if (height !== undefined && (isNaN(height) || height < 50 || height > 260)) {
      Alert.alert('Invalid height', 'Please enter a valid height in cm (50 - 260).');
      return;
    }
    if (weight !== undefined && (isNaN(weight) || weight < 20 || weight > 400)) {
      Alert.alert('Invalid weight', 'Please enter a valid weight in kg (20 - 400).');
      return;
    }
    if (age !== undefined && (isNaN(age) || age < 1 || age > 120)) {
      Alert.alert('Invalid age', 'Please enter a valid age (1 - 120).');
      return;
    }

    try {
      setSavingProfile(true);
      await UserProfileRepository.upsertProfile({
        user_id: user.id,
        height,
        weight,
        age,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEditVisible(false);
    } catch (e) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Update failed', e instanceof Error ? e.message : 'Unable to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
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
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
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
            <TouchableOpacity
              style={styles.profileCard}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/more/profile-view' as any);
              }}
              activeOpacity={0.9}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
                </View>
                <View style={styles.avatarBadge}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{isLoading ? 'Loading...' : displayName}</Text>
                <Text style={styles.profileEmail}>{isLoading ? '' : email}</Text>
                {isPremium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </View>
                )}
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-forward" size={24} color="rgba(255, 255, 255, 0.8)" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
        {/* Dark Mode Toggle */}
        <View style={[styles.darkModeSection, isDarkMode && styles.darkModeSectionDark]}>
          <View style={[styles.darkModeCard, isDarkMode && styles.darkModeCardDark]}>
            <View style={styles.darkModeInfo}>
              <View style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
                <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={isDarkMode ? '#FFD700' : '#FF9800'} />
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
        {/* Premium Upgrade Card */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumSection}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/more/premium' as any);
            }}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500'] as [string, string, ...string[]]}
              style={styles.premiumGradient}
            >
              <View style={styles.premiumIcon}>
                <Ionicons name="star" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock all features & analytics</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
        {/* Settings Categories */}
        <View style={[styles.settingsSection, isDarkMode && styles.settingsSectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Settings</Text>
          {settingsCategories.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + index * 10],
                    }),
                  },
                ],
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
                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9CA3AF' : '#9CA3AF'} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        {/* Account Actions */}
        <View style={[styles.accountSection, isDarkMode && styles.accountSectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Account</Text>
          <TouchableOpacity
            style={[styles.accountItem, isDarkMode && styles.settingItemDark, { opacity: getActionOpacity(isProcessingLogout) }]}
            onPress={() => {
              if (!isProcessingLogout && !isProcessingDelete) {
                handleConfirmLogout();
              }
            }}
            disabled={isProcessingLogout || isProcessingDelete}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
              <Ionicons name="log-out-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>
              {isProcessingLogout ? 'Logging out…' : 'Log Out'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.accountItem, styles.deleteAccountItem, isDarkMode && styles.deleteAccountItemDark, { opacity: getActionOpacity(isProcessingDelete) }]}
            onPress={() => {
              if (!isProcessingLogout && !isProcessingDelete) {
                handleConfirmAccountDeletion();
              }
            }}
            disabled={isProcessingLogout || isProcessingDelete}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, styles.deleteAccountIcon]}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </View>
            <Text style={[styles.settingTitle, styles.deleteAccountText]}>
              {isProcessingDelete ? 'Deleting account…' : 'Delete Account'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#F87171" />
          </TouchableOpacity>
        </View>
        {/* Quick Actions */}
        <View style={[styles.quickActionsSection, isDarkMode && styles.quickActionsSectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, isDarkMode && styles.quickActionCardDark]}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, isDarkMode && styles.quickActionIconDark]}>
                  <Ionicons name={action.icon as any} size={24} color="#667eea" />
                </View>
                <Text style={[styles.quickActionText, isDarkMode && styles.quickActionTextDark]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={[styles.aboutText, isDarkMode && styles.aboutTextDark]}>Health Tracker v1.0.0</Text>
          <TouchableOpacity onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/more/privacy' as any);
          }}>
            <Text style={[styles.aboutLink, isDarkMode && styles.aboutLinkDark]}>Terms & Privacy</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Profile Edit Modal */}
      <Modal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        title="Edit Profile"
        size="medium"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalSubtitle}>Update your personal details</Text>
          
          {/* View Full Profile Button */}
          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => {
              setEditVisible(false);
              router.push('/more/profile-view' as any);
            }}
          >
            <Ionicons name="person-outline" size={20} color="#667eea" />
            <Text style={styles.viewProfileButtonText}>View Full Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#667eea" />
          </TouchableOpacity>

          <View style={styles.modalRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                value={editHeight}
                onChangeText={setEditHeight}
                placeholder="e.g. 175"
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={editWeight}
                onChangeText={setEditWeight}
                placeholder="e.g. 70"
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={editAge}
              onChangeText={setEditAge}
              placeholder="e.g. 30"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setEditVisible(false)} disabled={savingProfile}>
              <Text style={[styles.modalButtonText, styles.modalCancelText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalSave]} onPress={handleSaveProfile} disabled={savingProfile}>
              <Ionicons name="save-outline" size={18} color="#FFFFFF" />
              <Text style={[styles.modalButtonText, { color: '#FFFFFF', marginLeft: 8 }]}>{savingProfile ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  chevronContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  darkModeSectionDark: {},
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
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  settingsSectionDark: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#F9FAFB',
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
  settingItemDark: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
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
  settingTitleDark: {
    color: '#F9FAFB',
  },
  accountSection: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  accountSectionDark: {
    backgroundColor: '#1F2937',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteAccountItemDark: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  deleteAccountIcon: {
    marginRight: 10,
  },
  deleteAccountText: {
    fontSize: 16,
    color: '#ff3b30',
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsSectionDark: {
    backgroundColor: '#111827',
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
  quickActionCardDark: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
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
  quickActionIconDark: {
    backgroundColor: '#374151',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  quickActionTextDark: {
    color: '#F9FAFB',
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
  aboutTextDark: {
    color: '#6B7280',
  },
  aboutLink: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  aboutLinkDark: {
    color: '#818CF8',
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
  // Modal styles
  modalContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: {
    color: '#374151',
  },
  modalSave: {
    backgroundColor: '#667eea',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  viewProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    flex: 1,
    textAlign: 'center',
  },
});
