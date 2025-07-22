import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

interface PriceData {
  id: string;
  planType: "VIBED" | "CRACKED";
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
      expand: ["data.product"],
    });

    // Map price IDs to their data for easy lookup
    const priceMap: Record<string, PriceData> = {};

    prices.data.forEach((price) => {
      const product = price.product as Stripe.Product;
      const planType: "VIBED" | "CRACKED" = product.name?.includes("Vibed")
        ? "VIBED"
        : "CRACKED";
      const interval = price.recurring?.interval || "month";
      const amount = price.unit_amount ? price.unit_amount / 100 : 0;

      priceMap[price.id] = {
        id: price.id,
        planType,
        interval,
        amount,
        currency: price.currency,
        productName: product.name || "",
      };
    });

    // Get specific prices based on environment variables
    const crackedMonthly = priceMap[process.env.STRIPE_CRACKED_PRICE_ID!];
    const crackedAnnual = priceMap[process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID!];
    const vibedMonthly = priceMap[process.env.STRIPE_VIBED_PRICE_ID!];
    const vibedAnnual = priceMap[process.env.STRIPE_VIBED_ANNUAL_PRICE_ID!];

    return NextResponse.json({
      success: true,
      prices: {
        CRACKED: {
          monthly: crackedMonthly,
          annual: crackedAnnual,
        },
        VIBED: {
          monthly: vibedMonthly,
          annual: vibedAnnual,
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
          message:
            error instanceof Error ? error.message : "Failed to fetch prices",
        },
      },
      { status: 500 }
    );
  }
}
