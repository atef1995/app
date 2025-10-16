import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/services/emailService";

export async function GET(req: NextRequest) {
  try {
    // Verify this is from Vercel Cron (optional but recommended)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const stats = {
      totalProcessed: 0,
      emailsSent: 0,
      errors: 0,
      skipped: 0,
      completed: 0,
    };

    console.log(`🕐 Running course email cron at ${now.toISOString()}`);

    // Get all active subscribers
    const subscribers = await prisma.courseSubscriber.findMany({
      where: {
        status: "ACTIVE",
      },
    });

    console.log(`📊 Found ${subscribers.length} active subscribers`);

    for (const subscriber of subscribers) {
      stats.totalProcessed++;

      // Calculate days since signup
      const daysSinceSignup = Math.floor(
        (now.getTime() - subscriber.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine which day's email they should receive next
      // Day 1 is sent immediately on signup
      // Days 2-5 are sent by cron job
      const nextDay = daysSinceSignup + 1;

      // Check if they need an email today
      if (nextDay >= 2 && nextDay <= 5) {
        // Check if they already received this day's email
        if (subscriber.emailsSent.includes(nextDay)) {
          console.log(
            `⏭️  Subscriber ${subscriber.email} already received day ${nextDay}`
          );
          stats.skipped++;
          continue;
        }

        // Send the email
        try {
          console.log(`📧 Sending day ${nextDay} to ${subscriber.email}`);

          const result = await emailService.sendFreeCourseEmail(
            subscriber.email,
            nextDay,
            subscriber.name || undefined
          );

          if (!result.success) {
            throw new Error(result.error || "Failed to send email");
          }

          // Mark email as sent
          await prisma.courseSubscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsSent: [...subscriber.emailsSent, nextDay],
              // Mark as completed if this was day 5
              ...(nextDay === 5
                ? {
                    status: "COMPLETED",
                    completedAt: new Date(),
                  }
                : {}),
            },
          });

          stats.emailsSent++;
          console.log(
            `✅ Successfully sent day ${nextDay} to ${subscriber.email}`
          );

          if (nextDay === 5) {
            stats.completed++;
            console.log(
              `🎉 Subscriber ${subscriber.email} completed the course!`
            );
          }
        } catch (error) {
          console.error(
            `❌ Failed to send day ${nextDay} to ${subscriber.email}:`,
            error
          );
          stats.errors++;
        }
      } else if (nextDay > 5) {
        // Course is complete, mark if not already
        if (subscriber.status === "ACTIVE") {
          await prisma.courseSubscriber.update({
            where: { id: subscriber.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          });
          stats.completed++;
        }
      } else {
        // Too early for next email
        stats.skipped++;
      }
    }

    console.log(`✅ Course email cron completed:`, stats);

    return NextResponse.json({
      success: true,
      message: "Course emails processed successfully",
      stats,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Error in course email cron:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
