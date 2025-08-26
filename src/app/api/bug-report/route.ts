import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/emailService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      severity,
      url
    } = body;

    // Basic validation
    if (!title || !description || !stepsToReproduce || !expectedBehavior || !actualBehavior || !severity) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Severity validation
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: "Invalid severity level" },
        { status: 400 }
      );
    }

    // Get browser info from user agent
    const userAgent = request.headers.get("user-agent");
    const browserInfo = userAgent ? userAgent : undefined;

    // Get user info if logged in
    const userEmail = session?.user?.email || undefined;
    const userName = session?.user?.name || undefined;

    // Send bug report email
    const result = await emailService.sendBugReportEmail({
      userEmail,
      userName,
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browserInfo,
      url,
      severity,
    });

    if (!result.success) {
      console.error("Bug report email failed:", result.error);
      return NextResponse.json(
        { error: "Failed to submit bug report. Please try again." },
        { status: 500 }
      );
    }

    console.log(`🐛 Bug report submitted: ${title} [${severity}] by ${userName || 'Anonymous'}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "Bug report submitted successfully! Thank you for helping us improve." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bug report API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}