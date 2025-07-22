import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export { stripePromise };

// Utility functions for payment operations
export const createCheckoutSession = async (plan: string, annual: boolean = false) => {
  try {
    const response = await fetch('/api/payments/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan,
        annual,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create checkout session');
    }

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await fetch('/api/payments/subscription');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch subscription status');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout
export const redirectToCheckout = async (plan: string, annual: boolean = false) => {
  try {
    const { url } = await createCheckoutSession(plan, annual);
    
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL received');
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};
