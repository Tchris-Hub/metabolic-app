import Constants from 'expo-constants';

// Access environment variables through Expo Constants
const getEnvVar = (key: string): string => {
  return Constants.expoConfig?.extra?.[key] || '';
};

export const STRIPE_CONFIG = {
  publishableKey: 'pk_test_51RCxDLGdLrifKMED0X2bDwIpRWECSDXOKw0PqY7BTC76hTKv7W28jZl9o1liRJMrWEpFSZXvQn9t1duM5x1FPyu800oGYYCUtl',
  merchantIdentifier: 'merchant.com.metabolichealth',
  urlScheme: 'metabolichealth',
};

// Premium subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly_premium',
    name: 'Premium Monthly',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited meal planning',
      'Advanced health analytics',
      'AI-powered recommendations',
      'Recipe import & customization',
      'Priority customer support',
      'Export health reports',
      'Ad-free experience',
    ],
  },
  YEARLY: {
    id: 'yearly_premium',
    name: 'Premium Yearly',
    price: 99.99,
    currency: 'USD',
    interval: 'year',
    features: [
      'All Monthly features',
      'Save 17% ($120/year → $99.99/year)',
      'Early access to new features',
      'Personalized health coaching',
      'Custom meal plan templates',
    ],
    savings: '17%',
  },
};

export const getStripePublishableKey = (): string => {
  const key = STRIPE_CONFIG.publishableKey;
  if (!key || key === 'your_stripe_key') {
    throw new Error('Stripe publishable key is not configured. Please add it to your .env file.');
  }
  return key;
};
