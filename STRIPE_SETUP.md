# Stripe Payment Integration Setup

This guide walks you through setting up Stripe payments for your subscription-based JavaScript learning platform.

## 1. Stripe Account Setup

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: Navigate to Developers > API Keys
   - Copy your **Publishable key** (starts with `pk_`)
   - Copy your **Secret key** (starts with `sk_`)

## 2. Environment Variables

Add these variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_86d4222bfe2e8065b5c57b9180b27e38b760fe170e5432326d146c7cdd0f942c

# Next.js URL for redirects
NEXTAUTH_URL=http://localhost:3000

# Price IDs (you'll create these in step 3)
STRIPE_CRACKED_PRICE_ID=price_premium_monthly_id
STRIPE_CRACKSTRIPE_CRACKED_ANNUAL_PRICE_IDED_PRICE_ID=price_premium_annual_id
STRIPE_VIBED_PRICE_ID=price_pro_monthly_id
STRIPE_VIBED_ANNUAL_PRICE_ID=price_pro_annual_id
```

## 3. Create Products and Prices in Stripe

### Via Stripe Dashboard:

1. **Products**: Go to Products in your Stripe Dashboard
2. **Create Premium Product**:
   - Name: "Vibed Plan"
   - Description: "Unlimited tutorials, quizzes, and premium features"
   
3. **Create PRO Product**:
   - Name: "Cracked Plan"
   - Description: "Everything in Vibed plus AI-powered features and mentorship"

4. **Add Prices** for each product:
   - **Premium Monthly**: $9.99/month recurring
   - **Premium Annual**: $96/year recurring (20% discount)
   - **PRO Monthly**: $19.99/month recurring
   - **PRO Annual**: $192/year recurring (20% discount)

5. **Copy Price IDs**: Update your environment variables with the actual price IDs

### Via Stripe CLI (Alternative):

```bash
# Install Stripe CLI
stripe login

# Create products and prices
stripe products create --name="Vibed Plan" --description="Unlimited tutorials and premium features"
stripe prices create --unit-amount=999 --currency=usd --recurring='{"interval":"month"}' --product=prod_xxxxx

stripe products create --name="Cracked Plan" --description="Everything in Vibed plus AI features"
stripe prices create --unit-amount=1999 --currency=usd --recurring='{"interval":"month"}' --product=prod_xxxxx
```

## 4. Set Up Webhooks

### For Local Development:

1. **Install Stripe CLI**: [Download here](https://stripe.com/docs/stripe-cli)

2. **Login and forward events**:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook
```

3. **Copy the webhook secret** from the CLI output and add it to your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### For Production:

1. **Create Webhook Endpoint** in Stripe Dashboard:
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   
2. **Select Events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

3. **Copy webhook secret** and add to production environment variables

## 5. Update Database Schema

The Stripe integration uses these Prisma models (already included in your schema):

```prisma
model User {
  // ... existing fields
  stripeCustomerId   String?
  // ... rest of model
}

model Payment {
  id                    String   @id @default(cuid())
  userId                String
  amount                Float
  currency              String   @default("usd")
  status                String   @default("PENDING")
  stripePaymentIntentId String?
  stripeSessionId       String?
  plan                  String
  metadata              Json?
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String
  plan                 String
  status               String   @default("TRIAL")
  stripeSubscriptionId String?
  stripePriceId        String?
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  cancelAtPeriodEnd    Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 6. Testing the Integration

### Test Payment Flow:

1. **Start your application**: `npm run dev`
2. **Start webhook listener**: `stripe listen --forward-to localhost:3000/api/payments/webhook`
3. **Navigate to pricing page**: `http://localhost:3000/pricing`
4. **Click on a premium plan** (make sure you're logged in)
5. **Use test card numbers**:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - More test cards: [Stripe Testing Guide](https://stripe.com/docs/testing)

### Test Webhooks:

```bash
# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

## 7. API Endpoints

The integration provides these endpoints:

- **POST** `/api/payments/create-checkout` - Creates Stripe Checkout session
- **POST** `/api/payments/webhook` - Handles Stripe webhooks
- **GET** `/api/payments/subscription` - Gets user's subscription status

## 8. Frontend Integration

### Pricing Page
The pricing page (`/pricing`) automatically handles:
- Plan selection
- Annual vs monthly billing
- Redirecting to Stripe Checkout

### Success Page
After successful payment, users are redirected to `/payment/success` which shows:
- Payment confirmation
- Subscription details
- What features are unlocked

## 9. Production Checklist

Before going live:

- [ ] Switch to live Stripe keys (remove `_test` from keys)
- [ ] Set up production webhook endpoint
- [ ] Test with real payment methods
- [ ] Configure proper tax settings in Stripe
- [ ] Set up email notifications for failed payments
- [ ] Configure subscription management (billing portal)
- [ ] Set up monitoring and alerts

## 10. Subscription Management

### Customer Portal (Recommended Addition):

```typescript
// Add to your subscription service
export const createBillingPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });
  return session;
};
```

This allows customers to:
- Update payment methods
- Cancel subscriptions
- View billing history
- Download invoices

## 11. Error Handling

Common issues and solutions:

### "No such price" error:
- Verify price IDs in environment variables
- Ensure prices are created in the correct Stripe account

### Webhook signature verification failed:
- Check webhook secret is correct
- Ensure webhook endpoint is accessible
- Verify event types are properly configured

### Customer not found:
- Ensure Stripe customer is created before checkout
- Check user metadata mapping

## 12. Security Considerations

- Never expose secret keys in frontend code
- Always verify webhook signatures
- Validate amount and currency server-side
- Use HTTPS in production
- Store sensitive data securely
- Implement proper error logging

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For implementation questions:
- Check the code comments in the API routes
- Review the SubscriptionService utility functions
- Test with Stripe's webhook event simulator
