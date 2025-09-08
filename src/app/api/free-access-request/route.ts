import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/emailService";
import { headers } from "next/headers";
import mailchecker from "mailchecker";

// Rate limiting store (in production, use Redis or database)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_DAY = 1; // Only 1 request per IP per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return "unknown";
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    // First request from this IP
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (now > record.resetTime) {
    // Reset window has passed
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_DAY) {
    return { allowed: false, resetTime: record.resetTime };
  }

  // Increment count
  record.count++;
  rateLimit.set(ip, record);
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      const hoursUntilReset = rateLimitCheck.resetTime
        ? Math.ceil((rateLimitCheck.resetTime - Date.now()) / (1000 * 60 * 60))
        : 24;

      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can only submit one free access request per day. Please try again in ${hoursUntilReset} hours.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "country", "reason", "goals"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (mailchecker.isValid(body.email)) {
      return NextResponse.json({ error: "error email" }, { status: 400 });
    }

    // Get additional security information
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "Unknown";
    const acceptLanguage = headersList.get("accept-language") || "Unknown";
    const referer = headersList.get("referer") || "Direct";

    // Security data for abuse prevention
    const securityData = {
      ip: clientIP,
      userAgent,
      acceptLanguage,
      referer,
      timestamp: new Date().toISOString(),
      requestHeaders: {
        "x-forwarded-for": headersList.get("x-forwarded-for"),
        "x-real-ip": headersList.get("x-real-ip"),
        "cf-connecting-ip": headersList.get("cf-connecting-ip"),
        "cf-ipcountry": headersList.get("cf-ipcountry"),
      },
    };

    // Prepare free access request data
    const freeAccessData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      country: body.country.trim(),
      age: body.age ? parseInt(body.age) : null,
      occupation: body.occupation?.trim() || "Not specified",
      experience: body.experience || "Not specified",
      reason: body.reason.trim(),
      goals: body.goals.trim(),
      timeCommitment: body.timeCommitment || "Not specified",
      hasTriedOtherPlatforms:
        body.hasTriedOtherPlatforms?.trim() || "Not specified",
      financialSituation: body.financialSituation?.trim() || "Not specified",
      howFoundUs: body.howFoundUs?.trim() || "Not specified",
      securityInfo: securityData,
    };

    // Send email to admin
    const result = await emailService.sendFreeAccessRequestEmail(
      freeAccessData
    );

    if (!result.success) {
      console.error("Failed to send free access request email:", result.error);
      return NextResponse.json(
        { error: "Failed to send request. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Free access request submitted successfully. We'll review it and get back to you within 48 hours.",
    });
  } catch (error) {
    console.error("Free access request error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimit.entries()) {
    if (now > record.resetTime) {
      rateLimit.delete(ip);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour
