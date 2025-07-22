/**
 * Test script to verify Stripe integration setup
 * Run with: npx tsx scripts/test-stripe.ts
 */

console.log("🧪 Testing Stripe Integration Setup...\n");

// Test 1: Environment Variables
console.log("1. Checking environment variables...");
const requiredEnvVars = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "NEXTAUTH_URL",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.log("❌ Missing required environment variables:");
  missingVars.forEach((varName) => console.log(`   - ${varName}`));
} else {
  console.log("✅ All required environment variables are set");
}

// Test 2: Stripe Connection
console.log("\n2. Testing Stripe connection...");
try {
  import("stripe").then(({ default: Stripe }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-06-30.basil",
    });

    // Test API call
    stripe.prices
      .list({ limit: 1 })
      .then(() => {
        console.log("✅ Stripe API connection successful");
      })
      .catch((error: Error) => {
        console.log("❌ Stripe API connection failed:", error.message);
      });
  });
} catch (error) {
  console.log("❌ Stripe module error:", (error as Error).message);
}

// Test 3: Price IDs
console.log("\n3. Checking price ID configuration...");
const priceIds = ["STRIPE_CRACKED_PRICE_ID", "STRIPE_VIBED_PRICE_ID"];

const missingPriceIds = priceIds.filter((varName) => !process.env[varName]);
if (missingPriceIds.length > 0) {
  console.log("⚠️  Missing price IDs (you'll need to create these in Stripe):");
  missingPriceIds.forEach((varName) => console.log(`   - ${varName}`));
} else {
  console.log("✅ Price IDs are configured");
}

// Test 4: Webhook Secret
console.log("\n4. Checking webhook configuration...");
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.log("⚠️  STRIPE_WEBHOOK_SECRET not set");
  console.log(
    "   For local development, run: stripe listen --forward-to localhost:3000/api/payments/webhook"
  );
} else {
  console.log("✅ Webhook secret is configured");
}

console.log("\n📚 Next steps:");
console.log("1. Set up products and prices in your Stripe dashboard");
console.log("2. Update environment variables with actual price IDs");
console.log("3. Set up webhook endpoints");
console.log("4. Test the payment flow at /pricing");
console.log("\n📖 See STRIPE_SETUP.md for detailed instructions");
