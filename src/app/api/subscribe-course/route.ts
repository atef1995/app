import { NextRequest, NextResponse } from "next/server";
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

    console.log(`📧 New course subscriber: ${email}`);

    // Send Day 1 email immediately
    try {
      const result = await emailService.sendFreeCourseEmail(email, 1, name);

      if (!result.success) {
        console.error("Failed to send Day 1 email:", result.error);
        // Continue anyway - don't block the user
      } else {
        console.log(`✅ Day 1 email sent to ${email}`);
      }
    } catch (emailError) {
      console.error("Error sending course email:", emailError);
      // Continue even if email fails - don't block the user
    }

    // TODO: Store email in database for future days (optional)
    // TODO: Set up automated sequence for days 2-5 using cron jobs or email service

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed! Check your email for Day 1."
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
