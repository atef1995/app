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
    };

    // TODO: You need a CourseSubscriber model to track who signed up when
    // For now, this is a placeholder showing the logic you'd implement

    console.log(`🕐 Running course email cron at ${now.toISOString()}`);

    // Example logic (you'd need to implement the CourseSubscriber model):
    /*
    const subscribers = await prisma.courseSubscriber.findMany({
      where: {
        // Find users who need their next email
        // e.g., signed up 1 day ago and haven't received day 2 yet
      }
    });

    for (const subscriber of subscribers) {
      const daysSinceSignup = Math.floor(
        (now.getTime() - subscriber.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const nextDay = daysSinceSignup + 1;

      if (nextDay >= 2 && nextDay <= 5 && !subscriber.emailsSent.includes(nextDay)) {
        try {
          await emailService.sendFreeCourseEmail(subscriber.email, nextDay, subscriber.name);

          // Mark email as sent
          await prisma.courseSubscriber.update({
            where: { id: subscriber.id },
            data: {
              emailsSent: [...subscriber.emailsSent, nextDay]
            }
          });

          stats.emailsSent++;
        } catch (error) {
          console.error(`Failed to send day ${nextDay} to ${subscriber.email}:`, error);
          stats.errors++;
        }
      }

      stats.totalProcessed++;
    }
    */

    console.log(`✅ Course email cron completed:`, stats);

    return NextResponse.json({
      success: true,
      message: "Course emails processed",
      stats,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Error in course email cron:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
