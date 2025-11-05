# 🔐 Stripe Payment Integration Setup Guide

## ✅ What's Already Done

1. ✅ Stripe React Native SDK installed (`@stripe/stripe-react-native`)
2. ✅ Stripe publishable test key added to `.env`
3. ✅ Premium subscription screen created (`/more/premium`)
4. ✅ Stripe service layer created
5. ✅ Subscription plans configured ($9.99/month, $99.99/year)
6. ✅ Premium upgrade card added to More tab

## 📋 What's Left to Complete

### 1. **Create Stripe Products & Prices** (5 minutes)

Go to your [Stripe Dashboard](https://dashboard.stripe.com/test/products):

**Create Monthly Product:**
- Name: "Premium Monthly"
- Description: "Premium subscription - monthly billing"
- Price: $9.99 USD
- Recurring: Every 1 month
- Copy the **Price ID** (looks like: `price_xxxxxxxxxxxxx`)

**Create Yearly Product:**
- Name: "Premium Yearly"  
- Description: "Premium subscription - yearly billing"
- Price: $99.99 USD
- Recurring: Every 1 year
- Copy the **Price ID**

**Update the Price IDs:**
```typescript
// services/stripe/config.ts
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly_premium',
    priceId: 'price_xxxxx', // ← ADD THIS
    // ...
  },
  YEARLY: {
    id: 'yearly_premium',
    priceId: 'price_xxxxx', // ← ADD THIS
    // ...
  },
};
```

---

### 2. **Set Up Supabase Edge Functions** (30 minutes)

Stripe requires server-side API calls for security. Create these Edge Functions in Supabase:

#### **a) create-payment-intent**
```typescript
// supabase/functions/create-payment-intent/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { amount, currency, customerId, metadata } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      customer: customerId,
      metadata,
      automatic_payment_methods: { enabled: true },
    })

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

#### **b) create-subscription**
```typescript
// supabase/functions/create-subscription/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { priceId, customerId } = await req.json()

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })

    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        status: subscription.status,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

#### **c) get-or-create-customer**
```typescript
// supabase/functions/get-or-create-customer/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    const { userId, email } = await req.json()

    // Check if customer already exists in DB
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ customerId: profile.stripe_customer_id }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId },
    })

    // Save customer ID to DB
    await supabase
      .from('user_profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('user_id', userId)

    return new Response(
      JSON.stringify({ customerId: customer.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

**Deploy Edge Functions:**
```bash
supabase functions deploy create-payment-intent
supabase functions deploy create-subscription
supabase functions deploy get-or-create-customer
```

---

### 3. **Add Stripe Secret Key to Supabase**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → Edge Functions
2. Add environment secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your Stripe secret key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
     - Looks like: `sk_test_xxxxxxxxxxxxx`

---

### 4. **Update Database Schema**

Add Stripe customer ID column to user_profiles:

```sql
-- In Supabase SQL Editor
ALTER TABLE user_profiles 
ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;

-- Add index for faster lookups
CREATE INDEX idx_user_profiles_stripe_customer_id 
ON user_profiles(stripe_customer_id);
```

---

### 5. **Implement Payment Flow in App**

Update `app/more/premium.tsx`:

```typescript
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { getStripePublishableKey } from '../../services/stripe/config';
import { StripeService } from '../../services/stripe/StripeService';

// Wrap your app with StripeProvider in _layout.tsx
// <StripeProvider publishableKey={getStripePublishableKey()}>

const handleSubscribe = async () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  try {
    // 1. Get or create Stripe customer
    const customerId = await StripeService.getOrCreateCustomer(user.id, user.email);
    
    // 2. Create subscription with selected plan
    const priceId = SUBSCRIPTION_PLANS[selectedPlan].priceId;
    const { clientSecret, subscriptionId } = await StripeService.createSubscription({
      priceId,
      customerId,
    });
    
    // 3. Initialize payment sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: 'Metabolic Health',
      customerId,
      customerEphemeralKeySecret: clientSecret,
      paymentIntentClientSecret: clientSecret,
    });
    
    if (initError) throw new Error(initError.message);
    
    // 4. Present payment sheet
    const { error: presentError } = await presentPaymentSheet();
    
    if (presentError) {
      Alert.alert('Payment Cancelled', presentError.message);
      return;
    }
    
    // 5. Update user profile with premium status
    await UserProfileRepository.upsertProfile({
      user_id: user.id,
      premium_status: true,
      subscription_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    });
    
    Alert.alert('Success!', 'Welcome to Premium! 🎉');
    router.back();
    
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

---

### 6. **Set Up Webhooks** (Important!)

Stripe webhooks notify your app about payment events:

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add to Supabase secrets: `STRIPE_WEBHOOK_SECRET`

Create webhook handler Edge Function:
```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
    
    // Handle subscription events
    if (event.type.startsWith('customer.subscription')) {
      const subscription = event.data.object as Stripe.Subscription
      // Update user_profiles table based on subscription status
      // ...
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
```

---

## 🧪 Testing

### Test Cards (Stripe Test Mode):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0027 6000 3184`
- Any future expiry date, any CVC

### Test the Flow:
1. Tap "Upgrade to Premium" in More tab
2. Select a plan
3. Tap "Subscribe Now"
4. Enter test card details
5. Complete payment
6. Verify premium status updates

---

## 📚 Resources

- [Stripe React Native Docs](https://stripe.dev/stripe-react-native/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

## 🚀 Going Live

When ready for production:

1. Replace test keys with live keys in `.env` and Supabase
2. Update Stripe Dashboard to "Live mode"
3. Re-create products in Live mode
4. Update webhook endpoints to live URLs
5. Test thoroughly with real card (small amount)
6. Enable production billing in Supabase

---

## 💡 Tips

- Always test webhooks in test mode first
- Monitor Stripe Dashboard for failed payments
- Set up email notifications for subscription events
- Implement grace period for failed payments (3-7 days)
- Add "Manage Subscription" screen for cancellation/updates
- Consider adding promo codes support

---

## 🆘 Troubleshooting

**"Edge Function returned non-2xx"**
- Check Edge Function logs in Supabase Dashboard
- Verify STRIPE_SECRET_KEY is set in Supabase secrets
- Make sure functions are deployed

**Payment Sheet won't open**
- Verify publishable key is correct in `.env`
- Check StripeProvider wraps your app
- Ensure client secret is valid

**Subscription not activating**
- Check webhook is receiving events
- Verify database updates in webhook handler
- Look for errors in Supabase logs

---

Made with ❤️ for Metabolic Health App
