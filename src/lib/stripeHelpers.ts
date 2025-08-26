import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

/**
 * Utility functions for Stripe operations
 */
export class StripeHelpers {
  /**
   * Validates and ensures a Stripe customer exists for a user
   * If the customer ID is invalid, it creates a new customer and updates the database
   */
  static async validateAndGetCustomer(
    userId: string,
    userEmail: string,
    userName?: string
  ): Promise<string> {
    // Get user's Stripe customer ID from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    let customerId = dbUser?.stripeCustomerId;

    // If we have a customer ID, verify it exists in Stripe
    if (customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        
        // Check if customer was deleted
        if ('deleted' in customer && customer.deleted) {
          throw new Error("Customer was deleted");
        }
        
        // Customer is valid, return the ID
        return customerId;
      } catch (error) {
        console.warn(
          `Stripe customer ${customerId} not found or deleted, creating new one...`,
          error
        );
        
        // Customer doesn't exist in Stripe, clear the stored ID
        customerId = null;
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: null },
        });
      }
    }

    // Create customer if doesn't exist or was invalid
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName || undefined,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;

      // Update user with new Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });

      console.log(`Created new Stripe customer ${customerId} for user ${userId}`);
    }

    return customerId;
  }

  /**
   * Safely retrieves a Stripe customer, handling deleted customers
   */
  static async safeRetrieveCustomer(
    customerId: string
  ): Promise<Stripe.Customer | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId);
      
      if ('deleted' in customer && customer.deleted) {
        return null;
      }
      
      return customer as Stripe.Customer;
    } catch (error) {
      console.warn(`Failed to retrieve Stripe customer ${customerId}:`, error);
      return null;
    }
  }
}