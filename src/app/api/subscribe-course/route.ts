import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/services/emailService";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Get IP address for abuse prevention
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "unknown";

    console.log(`📧 New course subscriber: ${email}`);

    // Check if already subscribed
    const existing = await prisma.courseSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "UNSUBSCRIBED") {
        // Re-subscribe them
        await prisma.courseSubscriber.update({
          where: { email },
          data: {
            status: "ACTIVE",
            unsubscribedAt: null,
            emailsSent: [1], // Reset to Day 1
            updatedAt: new Date(),
          },
        });
      } else {
        // Already subscribed and active
        return NextResponse.json(
          {
            success: true,
            message:
              "You're already subscribed! Check your email for the course content.",
            alreadySubscribed: true,
          },
          { status: 200 }
        );
      }
    } else {
      // Create new subscriber
      await prisma.courseSubscriber.create({
        data: {
          email,
          name: name || null,
          emailsSent: [1], // Mark Day 1 as sent
          status: "ACTIVE",
          ipAddress: ip,
          source: req.headers.get("referer") || "direct",
        },
      });
    }

    // Send Day 1 email immediately
    try {
      const result = await emailService.sendFreeCourseEmail(email, 1, name);

      if (!result.success) {
        console.error("Failed to send Day 1 email:", result.error);
        // Continue anyway - cron job will retry
      } else {
        console.log(`✅ Day 1 email sent to ${email}`);
      }
    } catch (emailError) {
      console.error("Error sending course email:", emailError);
      // Continue - subscriber is saved, cron job will handle retries
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed! Check your email for Day 1.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error subscribing to course:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
