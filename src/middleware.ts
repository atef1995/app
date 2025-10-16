import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { devMode } from "./lib/services/envService";
const debugMode = devMode();

// Request timeout constant
const FETCH_TIMEOUT = 5000; // 5 seconds

// Helper function to fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

// Helper to generate anonymous ID
function generateAnonymousId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `anon_${random}_${timestamp}`;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (debugMode) {
    console.log("Middleware executed for:", pathname);
  }

  // Use NextAuth's getToken for proper session validation
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Legacy cookie check as fallback
  const sessionToken =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const isAuthenticated = !!token || !!sessionToken;

  if (debugMode) {
    console.log("User authenticated:", isAuthenticated, "for path:", pathname);
  }

  // If we have a valid token and user is trying to access signin page, redirect to dashboard
  if (isAuthenticated && pathname.startsWith("/auth/signin")) {
    const callbackUrl =
      req.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    if (debugMode) {
      console.log(
        "Redirecting authenticated user from signin to:",
        callbackUrl
      );
    }
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  // Handle tutorial access - both anonymous and authenticated
  if (pathname.startsWith("/tutorials/category/")) {
    if (!isAuthenticated) {
      // Anonymous user trying to view tutorial - check anonymous limit
      const anonymousCheckResult = await handleAnonymousTutorialAccess(
        req,
        pathname
      );
      if (anonymousCheckResult) {
        return anonymousCheckResult; // Redirect to signup if limit reached or set cookie
      }
      // Allow access if under limit
      return NextResponse.next();
    } else {
      // Authenticated user - check subscription limits
      const limitCheckResult = await checkTutorialAccessLimits(
        token,
        sessionToken,
        pathname,
        req
      );
      if (debugMode) {
        console.log("🔍 Check result:", { limitCheckResult });
      }
      if (!limitCheckResult.hasAccess) {
        if (debugMode) {
          console.log(`🚫 Tutorial access denied: ${limitCheckResult.reason}`);
        }
        // Redirect to subscription upgrade page with context
        const upgradeUrl = new URL("/subscription/upgrade", req.url);
        upgradeUrl.searchParams.set(
          "reason",
          limitCheckResult.reason || "Access denied"
        );
        upgradeUrl.searchParams.set("feature", "tutorials");
        upgradeUrl.searchParams.set("returnUrl", pathname);

        return NextResponse.redirect(upgradeUrl);
      } else {
        if (debugMode) {
          console.log("✅ Tutorial access granted");
        }
      }
    }
  }

  // Check if the route requires authentication (non-tutorial routes)
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    if (debugMode) {
      console.log("Redirecting unauthenticated user to signin for:", pathname);
    }
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

/**
 * Handle anonymous tutorial access with limits
 * Returns NextResponse redirect if limit reached, null if allowed
 */
async function handleAnonymousTutorialAccess(
  req: NextRequest,
  pathname: string
): Promise<NextResponse | null> {
  const ANONYMOUS_TUTORIAL_LIMIT = 5;

  // Check anonymous session in cookies
  let anonymousId = req.cookies.get("vibed_anonymous_id")?.value;

  if (!anonymousId) {
    // First-time anonymous visitor - generate and set cookie
    anonymousId = generateAnonymousId();

    if (debugMode) {
      console.log(
        "✅ First-time anonymous visitor, setting cookie and allowing tutorial access"
      );
    }

    const response = NextResponse.next();
    response.cookies.set("vibed_anonymous_id", anonymousId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  }

  // Check how many tutorials they've viewed
  try {
    const baseUrl = new URL(req.url).origin;
    const trackingUrl = `${baseUrl}/api/anonymous/check-limit?anonymousId=${anonymousId}`;

    const response = await fetchWithTimeout(trackingUrl);

    if (!response.ok) {
      // If check fails, allow access (fail open)
      if (debugMode) {
        console.log("⚠️ Anonymous check failed, allowing access");
      }
      return null;
    }

    const data = await response.json();

    if (data.limitReached) {
      // Redirect to signup page with message
      if (debugMode) {
        console.log("🚫 Anonymous limit reached, redirecting to signup");
      }

      const signupUrl = new URL("/auth/signin", req.url);
      signupUrl.searchParams.set("callbackUrl", pathname);
      signupUrl.searchParams.set(
        "message",
        `You've viewed ${ANONYMOUS_TUTORIAL_LIMIT} tutorials! Sign up free to continue learning.`
      );
      signupUrl.searchParams.set("reason", "anonymous_limit");

      return NextResponse.redirect(signupUrl);
    }

    // Within limit - allow access
    if (debugMode) {
      console.log(
        `✅ Anonymous access granted (${data.viewedCount}/${ANONYMOUS_TUTORIAL_LIMIT})`
      );
    }
    return null;
  } catch (error) {
    console.error("Error checking anonymous limit:", error);
    // Fail open - allow access
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/practice",
    "/settings",
    "/quiz/", // Individual quiz attempts (not /quizzes listing)
  ];

  return protectedRoutes.some((route) => {
    // Exact match for routes with trailing slash
    if (route.endsWith("/")) {
      // Match /quiz/123 but not /quizzes
      return pathname.startsWith(route) && pathname !== route.slice(0, -1);
    }
    return pathname.startsWith(route);
  });
}

interface TutorialAccessResult {
  hasAccess: boolean;
  reason?: string;
  suggestedPlan?: string;
}

async function checkTutorialAccessLimits(
  token: JWT | null,
  sessionToken: { name: string; value: string } | undefined,
  pathname: string,
  req: NextRequest
): Promise<TutorialAccessResult> {
  try {
    // Extract tutorial slug from pathname (e.g., /tutorials/category/javascript/variables -> variables)
    const pathParts = pathname.split("/").filter(Boolean);
    const tutorialSlug = pathParts[pathParts.length - 1];

    if (!tutorialSlug) {
      if (debugMode) {
        console.log("🔧 No tutorial slug found, allowing category page");
      }
      return { hasAccess: true }; // Allow category pages
    }

    // Get user subscription info - use the request origin instead of NEXTAUTH_URL for internal calls
    const baseUrl = new URL(req.url).origin;
    const subscriptionUrl = `${baseUrl}/api/payments/subscription`;

    // Use the session token from cookies
    const sessionTokenCookie = sessionToken?.value;
    const sessionTokenName = sessionToken?.name;

    const subscriptionResponse = await fetchWithTimeout(subscriptionUrl, {
      headers: {
        Cookie: `${sessionTokenName}=${sessionTokenCookie}`,
      },
    });

    if (!subscriptionResponse.ok) {
      console.error(
        "🔧 Failed to fetch subscription info in middleware, status:",
        subscriptionResponse.status
      );
      return { hasAccess: true }; // Allow access on error to avoid blocking users
    }

    const subscriptionData = await subscriptionResponse.json();

    if (!subscriptionData.success) {
      console.error("Subscription API returned error:", subscriptionData.error);
      return { hasAccess: true }; // Allow access on error
    }

    const { access } = subscriptionData.data;
    const { subscription } = access;

    // If user has premium access, allow all tutorials
    if (subscription.canAccessPremium) {
      return { hasAccess: true };
    }

    // Get tutorial info to check if it's premium
    const tutorialResponse = await fetchWithTimeout(
      `${baseUrl}/api/tutorials?slug=${tutorialSlug}`
    );

    if (!tutorialResponse.ok) {
      return { hasAccess: true }; // Allow access if we can't check tutorial status
    }

    const tutorialData = await tutorialResponse.json();

    if (!tutorialData.success) {
      return { hasAccess: true }; // Allow access if we can't check tutorial status
    }

    const tutorial = tutorialData.data;

    // Check if tutorial is premium and user doesn't have premium access
    if (tutorial.isPremium && !subscription.canAccessPremium) {
      return {
        hasAccess: false,
        reason:
          "This is a premium tutorial. Upgrade to access premium content.",
        suggestedPlan: "VIBED",
      };
    }

    // Check if tutorial requires a specific plan
    if (tutorial.requiredPlan && tutorial.requiredPlan !== "FREE") {
      const planHierarchy = ["FREE", "VIBED", "CRACKED"];
      const userPlanIndex = planHierarchy.indexOf(subscription.plan);
      const requiredPlanIndex = planHierarchy.indexOf(tutorial.requiredPlan);

      if (userPlanIndex < requiredPlanIndex) {
        return {
          hasAccess: false,
          reason: `This tutorial requires the ${tutorial.requiredPlan} plan or higher`,
          suggestedPlan: tutorial.requiredPlan,
        };
      }
    }

    return { hasAccess: true };
  } catch (error) {
    console.error("Error checking tutorial access limits:", error);
    return { hasAccess: true }; // Allow access on error to avoid blocking users
  }
}

export const config = {
  matcher: [
    // Note: /dashboard and /tutorials removed to allow anonymous access
    "/practice/:path*",
    "/quiz/:path*",
    "/settings/:path*",
    "/tutorials/category/:path*", // Keep for anonymous limit checking
    "/auth/signin",
    "/auth/signin/:path*",
    // Catch all auth routes
    "/auth/:path*",
  ],
};
