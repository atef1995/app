import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/services/emailService";

/**
 * POST /api/admin/broadcast-email
 *
 * Send broadcast emails to all users or specific groups.
 * Only accessible by admin users.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      recipientType,
      specificEmails,
      subject,
      message,
      includeUnsubscribe,
    } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    let recipients: { email: string; name: string | null; username: string | null }[] = [];

    // Fetch recipients based on type
    switch (recipientType) {
      case "all":
        recipients = await prisma.user.findMany({
          where: {
            emailUnsubscribed: false,
          },
          select: {
            email: true,
            name: true,
            username: true,
          },
        });
        break;

      case "free":
        recipients = await prisma.user.findMany({
          where: {
            subscription: "FREE",
            emailUnsubscribed: false,
          },
          select: {
            email: true,
            name: true,
            username: true,
          },
        });
        break;

      case "premium":
        recipients = await prisma.user.findMany({
          where: {
            subscription: {
              in: ["VIBED", "CRACKED"],
            },
            emailUnsubscribed: false,
          },
          select: {
            email: true,
            name: true,
            username: true,
          },
        });
        break;

      case "specific":
        if (!specificEmails || specificEmails.length === 0) {
          return NextResponse.json(
            { error: "Please provide specific email addresses" },
            { status: 400 }
          );
        }

        recipients = await prisma.user.findMany({
          where: {
            email: {
              in: specificEmails,
            },
            emailUnsubscribed: false,
          },
          select: {
            email: true,
            name: true,
            username: true,
          },
        });

        if (recipients.length === 0) {
          return NextResponse.json(
            { error: "No valid recipients found with provided emails" },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid recipient type" },
          { status: 400 }
        );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No recipients found for the selected criteria" },
        { status: 400 }
      );
    }

    // Send emails to all recipients
    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const recipient of recipients) {
      try {
        const result = await emailService.sendBroadcastEmail(
          recipient,
          subject,
          message,
          includeUnsubscribe
        );

        if (result.success) {
          sentCount++;
        } else {
          failedCount++;
          errors.push(`${recipient.email}: ${result.error}`);
        }
      } catch (error) {
        failedCount++;
        errors.push(
          `${recipient.email}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    // Log broadcast activity
    try {
      await prisma.emailLog.create({
        data: {
          type: "BROADCAST",
          subject,
          recipientCount: recipients.length,
          sentCount,
          failedCount,
          recipientType,
          sentBy: session.user.email || "admin",
        },
      });
    } catch (logError) {
      console.error("Failed to log broadcast email:", logError);
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: recipients.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
    });
  } catch (error) {
    console.error("Error sending broadcast emails:", error);
    return NextResponse.json(
      {
        error: "Failed to send broadcast emails",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
