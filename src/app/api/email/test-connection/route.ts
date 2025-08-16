import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/emailService";
import { requireAdmin } from "@/lib/auth-utils";

export async function GET(_req: NextRequest) {
  try {
    // Verify admin access
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    // Test the email connection
    const result = await emailService.verifyConnection();

    return NextResponse.json({
      success: result.success,
      service: "Zoho Mail",
      timestamp: new Date().toISOString(),
      error: result.error,
      config: {
        host: process.env.SMTP_HOST || "smtppro.zoho.com",
        port: process.env.SMTP_PORT || "587",
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER ? "***configured***" : "not set",
      },
    });
  } catch (error) {
    console.error("Email connection test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
