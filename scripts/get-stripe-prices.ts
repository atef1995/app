/**
 * Script to fetch and display all available prices from your Stripe account
 * This helps you get the correct price IDs for your .env.local file
 */

import { config } from "dotenv";
import Stripe from "stripe";

// Load environment variables from .env.local
config({ path: ".env.local" });

console.log(
  "Stripe Secret Key:",
  process.env.STRIPE_SECRET_KEY ? "✅ Found" : "❌ Not found"
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

async function getAllPrices() {
  try {
    console.log(
      "🔍 Fetching all products and prices from your Stripe account...\n"
    );

    // Get all products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    // Get all prices
    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });

    console.log("📦 PRODUCTS:");
    console.log("============");
    products.data.forEach((product) => {
      console.log(`• ${product.name} (${product.id})`);
      console.log(`  Description: ${product.description || "No description"}`);
      console.log(`  Active: ${product.active}`);
      console.log("");
    });

    console.log("💰 PRICES:");
    console.log("===========");
    prices.data.forEach((price) => {
      const product = price.product as Stripe.Product;
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      const currency = price.currency.toUpperCase();
      const interval = price.recurring
        ? `/${price.recurring.interval}`
        : " (one-time)";

      console.log(`• ${price.id}`);
      console.log(`  Product: ${product.name}`);
      console.log(`  Amount: ${currency} ${amount}${interval}`);
      console.log(`  Active: ${price.active}`);
      console.log("");
    });

    console.log("🔧 ENVIRONMENT VARIABLE SUGGESTIONS:");
    console.log("====================================");

    // Try to match common naming patterns
    const premiumMonthly = prices.data.find((p) => {
      const product = p.product as Stripe.Product;
      return (
        product.name?.toLowerCase().includes("vibed") &&
        p.recurring?.interval === "month" &&
        p.unit_amount === 999
      ); // $9.99
    });

    const premiumAnnual = prices.data.find((p) => {
      const product = p.product as Stripe.Product;
      return (
        product.name?.toLowerCase().includes("vibed") &&
        p.recurring?.interval === "year"
      );
    });

    const proMonthly = prices.data.find((p) => {
      const product = p.product as Stripe.Product;
      return (
        product.name?.toLowerCase().includes("cracked") &&
        p.recurring?.interval === "month" &&
        p.unit_amount === 1999
      ); // $19.99
    });

    const proAnnual = prices.data.find((p) => {
      const product = p.product as Stripe.Product;
      return (
        product.name?.toLowerCase().includes("cracked") &&
        p.recurring?.interval === "year"
      );
    });

    if (premiumMonthly) {
      console.log(`STRIPE_CRACKED_PRICE_ID=${premiumMonthly.id}`);
    } else {
      console.log(
        "STRIPE_CRACKED_PRICE_ID=price_your_premium_monthly_price_id"
      );
    }

    if (premiumAnnual) {
      console.log(
        `STRIPE_CRACKSTRIPE_CRACKED_ANNUAL_PRICE_IDED_PRICE_ID=${premiumAnnual.id}`
      );
    } else {
      console.log(
        "STRIPE_CRACKSTRIPE_CRACKED_ANNUAL_PRICE_IDED_PRICE_ID=price_your_premium_annual_price_id"
      );
    }

    if (proMonthly) {
      console.log(`STRIPE_VIBED_PRICE_ID=${proMonthly.id}`);
    } else {
      console.log("STRIPE_VIBED_PRICE_ID=price_your_pro_monthly_price_id");
    }

    if (proAnnual) {
      console.log(`STRIPE_VIBED_ANNUAL_PRICE_ID=${proAnnual.id}`);
    } else {
      console.log(
        "STRIPE_VIBED_ANNUAL_PRICE_ID=price_your_pro_annual_price_id"
      );
    }

    console.log(
      "\n💡 Copy the price IDs above and update your .env.local file"
    );
    console.log(
      '   Make sure to use the price IDs (starting with "price_"), not product IDs!'
    );
  } catch (error) {
    console.error("❌ Error fetching Stripe data:", error);
    console.log("\n🔧 Common solutions:");
    console.log(
      "1. Check that your STRIPE_SECRET_KEY is correct in .env.local"
    );
    console.log(
      "2. Make sure you have products and prices created in your Stripe dashboard"
    );
    console.log(
      "3. Verify you're using the correct Stripe account (test vs live mode)"
    );
  }
}

getAllPrices();
