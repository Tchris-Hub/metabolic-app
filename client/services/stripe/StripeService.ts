import { supabase } from '../supabase/config';

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionParams {
  priceId: string;
  customerId?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  clientSecret: string;
  status: string;
}

/**
 * Stripe Service
 * Handles payment intents and subscriptions through Supabase Edge Functions
 * 
 * Note: This requires Supabase Edge Functions to be set up on the backend
 * to securely handle Stripe API calls with your secret key
 */
export class StripeService {
  /**
   * Create a payment intent for one-time payments
   * Requires a Supabase Edge Function: 'create-payment-intent'
   */
  static async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: params.amount,
          currency: params.currency || 'usd',
          customerId: params.customerId,
          metadata: params.metadata,
        },
      });

      if (error) throw error;
      if (!data?.clientSecret) {
        throw new Error('No client secret returned from payment intent');
      }

      return {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId,
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw new Error(
        `Payment initialization failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Create a subscription
   * Requires a Supabase Edge Function: 'create-subscription'
   */
  static async createSubscription(
    params: CreateSubscriptionParams
  ): Promise<SubscriptionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          priceId: params.priceId,
          customerId: params.customerId,
        },
      });

      if (error) throw error;
      if (!data?.clientSecret) {
        throw new Error('No client secret returned from subscription');
      }

      return {
        subscriptionId: data.subscriptionId,
        clientSecret: data.clientSecret,
        status: data.status,
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw new Error(
        `Subscription creation failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get or create a Stripe customer
   * Requires a Supabase Edge Function: 'get-or-create-customer'
   */
  static async getOrCreateCustomer(
    userId: string,
    email: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('get-or-create-customer', {
        body: { userId, email },
      });

      if (error) throw error;
      if (!data?.customerId) {
        throw new Error('No customer ID returned');
      }

      return data.customerId;
    } catch (error) {
      console.error('Failed to get/create customer:', error);
      throw new Error(
        `Customer creation failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Cancel a subscription
   * Requires a Supabase Edge Function: 'cancel-subscription'
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw new Error(
        `Subscription cancellation failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get subscription status
   * Requires a Supabase Edge Function: 'get-subscription-status'
   */
  static async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('get-subscription-status', {
        body: { userId },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      throw new Error(
        `Failed to get subscription status: ${(error as Error).message}`
      );
    }
  }
}
