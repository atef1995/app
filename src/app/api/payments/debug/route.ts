import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        stripeCustomerId: true,
      }
    });

    // Get subscription data
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get payment data
    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get Stripe customer data if exists
    let stripeCustomer = null;
    if (user?.stripeCustomerId) {
      try {
        stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
      } catch (error) {
        console.error("Error fetching Stripe customer:", error);
      }
    }

    return NextResponse.json({
      debug: {
        user,
        subscriptions,
        payments,
        stripeCustomer: stripeCustomer ? {
          id: stripeCustomer.id,
          email: (stripeCustomer as any).email,
          metadata: (stripeCustomer as any).metadata
        } : null,
        environment: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
          nextAuthUrl: process.env.NEXTAUTH_URL,
          nodeEnv: process.env.NODE_ENV
        }
      }
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}