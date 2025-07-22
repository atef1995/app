import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

interface PriceData {
  id: string;
  planType: 'PREMIUM' | 'PRO';
  interval: string;
  amount: number;
  currency: string;
  productName: string;
}

export async function GET() {
  try {
    // Get all active prices with product information
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    // Map price IDs to their data for easy lookup
    const priceMap: Record<string, PriceData> = {};
    
    prices.data.forEach(price => {
      const product = price.product as Stripe.Product;
      const planType: 'PREMIUM' | 'PRO' = product.name?.includes('Vibed') ? 'PREMIUM' : 'PRO';
      const interval = price.recurring?.interval || 'month';
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;
      
      priceMap[price.id] = {
        id: price.id,
        planType,
        interval,
        amount,
        currency: price.currency,
        productName: product.name || '',
      };
    });

    // Get specific prices based on environment variables
    const premiumMonthly = priceMap[process.env.STRIPE_PREMIUM_PRICE_ID!];
    const premiumAnnual = priceMap[process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!];
    const proMonthly = priceMap[process.env.STRIPE_PRO_PRICE_ID!];
    const proAnnual = priceMap[process.env.STRIPE_PRO_ANNUAL_PRICE_ID!];

    return NextResponse.json({
      success: true,
      prices: {
        PREMIUM: {
          monthly: premiumMonthly,
          annual: premiumAnnual,
        },
        PRO: {
          monthly: proMonthly,
          annual: proAnnual,
        },
      },
      allPrices: priceMap,
    });

  } catch (error) {
    console.error("Error fetching Stripe prices:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: error instanceof Error ? error.message : "Failed to fetch prices" 
        } 
      },
      { status: 500 }
    );
  }
}
