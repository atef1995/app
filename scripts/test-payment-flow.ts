import dotenv from "dotenv";
import Stripe from "stripe";

// Load environment variables
dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

async function testPaymentFlow() {
  console.log("🧪 Testing Payment Flow with New Plan Names...\n");

  // Test environment variables
  console.log("🔧 Environment Variables:");
  console.log("STRIPE_VIBED_PRICE_ID:", process.env.STRIPE_VIBED_PRICE_ID);
  console.log(
    "STRIPE_VIBED_ANNUAL_PRICE_ID:",
    process.env.STRIPE_VIBED_ANNUAL_PRICE_ID
  );
  console.log("STRIPE_CRACKED_PRICE_ID:", process.env.STRIPE_CRACKED_PRICE_ID);
  console.log(
    "STRIPE_CRACKED_ANNUAL_PRICE_ID:",
    process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID
  );
  console.log();

  // Test price retrieval
  const priceIds = [
    process.env.STRIPE_VIBED_PRICE_ID!,
    process.env.STRIPE_VIBED_ANNUAL_PRICE_ID!,
    process.env.STRIPE_CRACKED_PRICE_ID!,
    process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID!,
  ];

  console.log("🔍 Validating Price IDs:");
  for (const priceId of priceIds) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product as string);

      console.log(`✅ ${priceId}`);
      console.log(`   Product: ${product.name}`);
      console.log(
        `   Amount: ${price.currency.toUpperCase()} ${(
          price.unit_amount! / 100
        ).toFixed(2)}/${price.recurring?.interval}`
      );
      console.log(`   Active: ${price.active ? "Yes" : "No"}`);
      console.log();
    } catch (error) {
      console.log(
        `❌ ${priceId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.log();
    }
  }

  // Test plan mapping function
  console.log("🗺️  Testing Plan Mapping:");

  const getPriceId = (planType: string, isAnnual: boolean) => {
    if (planType === "CRACKED") {
      return isAnnual
        ? process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID
        : process.env.STRIPE_CRACKED_PRICE_ID;
    }
    if (planType === "VIBED") {
      return isAnnual
        ? process.env.STRIPE_VIBED_ANNUAL_PRICE_ID
        : process.env.STRIPE_VIBED_PRICE_ID;
    }
    return null;
  };

  const testMappings = [
    { plan: "VIBED", annual: false },
    { plan: "VIBED", annual: true },
    { plan: "CRACKED", annual: false },
    { plan: "CRACKED", annual: true },
  ];

  testMappings.forEach(({ plan, annual }) => {
    const priceId = getPriceId(plan, annual);
    console.log(
      `${plan} ${annual ? "Annual" : "Monthly"}: ${priceId || "NOT FOUND"}`
    );
  });

  console.log("\n✅ Payment flow test completed!");
}

testPaymentFlow().catch(console.error);
