import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { SUBSCRIPTION_PLANS } from '../../services/stripe/config';

type PlanType = 'MONTHLY' | 'YEARLY';

export default function PremiumSubscriptionScreen() {
  const { isDarkMode, colors, gradients } = useTheme();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('YEARLY');
  const [isProcessing, setIsProcessing] = useState(false);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSubscribe = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to subscribe to Premium.');
      router.push('/screens/auth/login' as any);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsProcessing(true);

    try {
      // TODO: Implement actual Stripe payment flow
      // This requires Supabase Edge Functions to be set up
      
      Alert.alert(
        'Coming Soon',
        'Stripe payment integration is ready! To complete setup:\n\n' +
        '1. Create Supabase Edge Functions for payment processing\n' +
        '2. Add your Stripe Secret Key to Supabase\n' +
        '3. Configure webhook endpoints\n\n' +
        'Visit the Stripe Dashboard to set up products and prices.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to process subscription'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const PlanCard = ({ type }: { type: PlanType }) => {
    const plan = SUBSCRIPTION_PLANS[type];
    const isSelected = selectedPlan === type;
    const showSavings = type === 'YEARLY';
    const planSavings = type === 'YEARLY' ? (plan as typeof SUBSCRIPTION_PLANS.YEARLY).savings : undefined;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedPlan(type);
        }}
        style={[
          styles.planCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? '#667eea' : colors.border,
            borderWidth: isSelected ? 3 : 1,
          },
        ]}
      >
        {showSavings && planSavings && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>SAVE {planSavings}</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
          <View style={styles.planTitleContainer}>
            <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
            <Text style={[styles.planInterval, { color: colors.textSecondary }]}>
              Billed {plan.interval}ly
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.currency, { color: colors.text }]}>$</Text>
          <Text style={[styles.price, { color: colors.text }]}>{plan.price.toFixed(2)}</Text>
          <Text style={[styles.perInterval, { color: colors.textSecondary }]}>/{plan.interval}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2'] as [string, string, ...string[]]}
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
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
          <View style={{ width: 40 }} />
        </View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <View style={styles.iconContainer}>
            <Ionicons name="star" size={48} color="#FFD700" />
          </View>
          <Text style={styles.heroTitle}>Unlock All Features</Text>
          <Text style={styles.heroSubtitle}>
            Take your health journey to the next level
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Plans */}
          <View style={styles.plansSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose Your Plan
            </Text>
            <PlanCard type="YEARLY" />
            <PlanCard type="MONTHLY" />
          </View>

          {/* All Features */}
          <View style={styles.allFeaturesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Everything You Get
            </Text>
            <View style={[styles.allFeaturesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {[
                ...new Set([
                  ...SUBSCRIPTION_PLANS.YEARLY.features,
                  ...SUBSCRIPTION_PLANS.MONTHLY.features
                ])
              ].map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
                  <Text style={[styles.allFeatureText, { color: colors.text }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustSection}>
            <View style={styles.trustRow}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                Secure payment with Stripe
              </Text>
            </View>
            <View style={styles.trustRow}>
              <Ionicons name="refresh" size={24} color="#2196F3" />
              <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                Cancel anytime, no questions asked
              </Text>
            </View>
            <View style={styles.trustRow}>
              <Ionicons name="lock-closed" size={24} color="#FF9800" />
              <Text style={[styles.trustText, { color: colors.textSecondary }]}>
                Your data is private and encrypted
              </Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomCTA, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.ctaContent}>
          <View>
            <Text style={[styles.ctaPrice, { color: colors.text }]}>
              ${SUBSCRIPTION_PLANS[selectedPlan].price.toFixed(2)}/{SUBSCRIPTION_PLANS[selectedPlan].interval}
            </Text>
            <Text style={[styles.ctaSubtext, { color: colors.textSecondary }]}>
              {selectedPlan === 'YEARLY' ? 'Best value • Save 17%' : 'Flexible monthly billing'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.subscribeButton, isProcessing && styles.subscribeButtonDisabled]}
            onPress={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  plansSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  planCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#667eea',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667eea',
  },
  planTitleContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  planInterval: {
    fontSize: 13,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  perInterval: {
    fontSize: 16,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  allFeaturesSection: {
    marginBottom: 32,
  },
  allFeaturesCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    gap: 14,
  },
  allFeatureText: {
    fontSize: 15,
    flex: 1,
  },
  trustSection: {
    gap: 16,
    marginBottom: 32,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustText: {
    fontSize: 14,
    flex: 1,
  },
  bottomCTA: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ctaSubtext: {
    fontSize: 13,
  },
  subscribeButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
