import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/emailService";
import mailchecker from "mailchecker";

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    const body = await request.json();

    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!mailchecker.isValid(email)) {
      return NextResponse.json(
        { error: "Invalid or disposable email address" },
        { status: 400 }
      );
    }

    // Get user agent for debugging purposes
    const userAgent = request.headers.get("user-agent") || undefined;

    // Send email
    const result = await emailService.sendContactFormEmail({
      name,
      email,
      subject,
      message,
      userAgent,
    });

    if (!result.success) {
      console.error("Contact form email failed:", result.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    console.log(`📧 Contact form submitted by ${name} (${email}): ${subject}`);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
