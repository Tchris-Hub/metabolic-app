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
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfileRepository, UserProfile } from '../../services/supabase/repositories/UserProfileRepository';
import { AuthService } from '../../services/supabase/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AVATARS = [
  { id: 'avatar1', emoji: '👨‍⚕️' },
  { id: 'avatar2', emoji: '👩‍⚕️' },
  { id: 'avatar3', emoji: '🧑‍💼' },
  { id: 'avatar4', emoji: '👨‍🎓' },
  { id: 'avatar5', emoji: '👩‍🎨' },
  { id: 'avatar6', emoji: '🧑‍🍳' },
  { id: 'avatar7', emoji: '👨‍🏫' },
  { id: 'avatar8', emoji: '👩‍💻' },
  { id: 'avatar9', emoji: '🧑‍🌾' },
  { id: 'avatar10', emoji: '👨‍🚀' },
  { id: 'avatar11', emoji: '👩‍🎤' },
  { id: 'avatar12', emoji: '🧑‍🔬' },
];

export default function ProfileViewScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        if (!user) {
          setIsLoading(false);
          return;
        }

        const authUser = AuthService.getUserData(user);
        setDisplayName(authUser.displayName || 'Guest');
        setEmail(authUser.email || '');

        const userProfile = await UserProfileRepository.getProfileByUserId(user.id);
        if (userProfile) {
          setProfile(userProfile);
          if (userProfile.display_name) {
            setDisplayName(userProfile.display_name);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user]);

  const getAvatarDisplay = () => {
    if (profile?.avatar_url) {
      const avatar = AVATARS.find(a => a.id === profile.avatar_url);
      if (avatar) {
        return <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>;
      }
    }
    return <Ionicons name="person" size={48} color="#FFFFFF" />;
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const formatDateOfBirth = (dob: string | undefined) => {
    if (!dob) return 'Not set';
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateBMI = () => {
    if (profile?.height && profile?.weight) {
      return UserProfileRepository.calculateBMI(profile.height, profile.weight);
    }
    return null;
  };

  const getBMICategory = (bmi: number | null) => {
    if (!bmi) return null;
    return UserProfileRepository.getBMICategory(bmi);
  };

  const InfoCard = ({ icon, label, value, iconColor }: { icon: string; label: string; value: string; iconColor: string }) => (
    <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.infoIcon, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={gradients.more as [string, string, ...string[]]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Avatar */}
        <Animated.View style={[styles.avatarSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.avatarContainer}>
            {getAvatarDisplay()}
          </View>
          <Text style={styles.profileName}>{isLoading ? 'Loading...' : displayName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading profile...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
              
              <InfoCard
                icon="calendar-outline"
                label="Date of Birth"
                value={formatDateOfBirth(profile?.date_of_birth)}
                iconColor="#FF9800"
              />
              
              <InfoCard
                icon="time-outline"
                label="Age"
                value={profile?.age ? `${profile.age} years` : 'Not calculated'}
                iconColor="#2196F3"
              />
              
              <InfoCard
                icon="male-female-outline"
                label="Gender"
                value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'}
                iconColor="#9C27B0"
              />
            </View>

            {/* Physical Measurements Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Physical Measurements</Text>
              
              <InfoCard
                icon="resize-outline"
                label="Height"
                value={profile?.height ? `${profile.height} cm` : 'Not set'}
                iconColor="#4CAF50"
              />
              
              <InfoCard
                icon="fitness-outline"
                label="Weight"
                value={profile?.weight ? `${profile.weight} kg` : 'Not set'}
                iconColor="#FF5722"
              />

              {bmi && (
                <View style={[styles.bmiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.bmiHeader}>
                    <View style={[styles.bmiIcon, { backgroundColor: '#E3F2FD' }]}>
                      <Ionicons name="analytics-outline" size={28} color="#2196F3" />
                    </View>
                    <View style={styles.bmiInfo}>
                      <Text style={[styles.bmiLabel, { color: colors.textSecondary }]}>Body Mass Index (BMI)</Text>
                      <View style={styles.bmiValueContainer}>
                        <Text style={[styles.bmiValue, { color: colors.text }]}>{bmi}</Text>
                        <View style={[styles.bmiCategoryBadge, { backgroundColor: bmiCategory === 'Normal' ? '#E8F5E9' : '#FFF3E0' }]}>
                          <Text style={[styles.bmiCategory, { color: bmiCategory === 'Normal' ? '#4CAF50' : '#FF9800' }]}>
                            {bmiCategory}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
              
              <InfoCard
                icon="location-outline"
                label="Country"
                value={profile?.country || 'Not set'}
                iconColor="#00BCD4"
              />
            </View>

            {/* Health Information Section */}
            {(profile?.health_goals && profile.health_goals.length > 0) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Goals</Text>
                <View style={[styles.tagsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {profile.health_goals.map((goal, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{goal}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {(profile?.health_conditions && profile.health_conditions.length > 0) && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Conditions</Text>
                <View style={[styles.tagsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  {profile.health_conditions.map((condition, index) => (
                    <View key={index} style={[styles.tag, styles.conditionTag]}>
                      <Text style={styles.tagText}>{condition}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Activity Level */}
            {profile?.activity_level && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Level</Text>
                <InfoCard
                  icon="barbell-outline"
                  label="Activity"
                  value={profile.activity_level.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  iconColor="#673AB7"
                />
              </View>
            )}

            {/* Account Information */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
              
              <InfoCard
                icon="mail-outline"
                label="Email"
                value={email}
                iconColor="#F44336"
              />
              
              {profile?.created_at && (
                <InfoCard
                  icon="calendar-outline"
                  label="Member Since"
                  value={new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  iconColor="#607D8B"
                />
              )}
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  bmiCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bmiInfo: {
    flex: 1,
  },
  bmiLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  bmiValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bmiValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bmiCategory: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  conditionTag: {
    backgroundColor: '#FFF3E0',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
});
