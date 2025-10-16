import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Find the subscriber
    const subscriber = await prisma.courseSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Email not found in our course subscribers" },
        { status: 404 }
      );
    }

    if (subscriber.status === "UNSUBSCRIBED") {
      return NextResponse.json(
        {
          success: true,
          message: "You're already unsubscribed from the course emails.",
          alreadyUnsubscribed: true,
        },
        { status: 200 }
      );
    }

    // Unsubscribe them
    await prisma.courseSubscriber.update({
      where: { email },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: new Date(),
      },
    });

    console.log(`📧 Unsubscribed from course: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message:
          "Successfully unsubscribed from course emails. We're sorry to see you go!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsubscribing from course:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again." },
      { status: 500 }
    );
  }
}
