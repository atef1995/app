import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { devMode } from "./lib/services/envService";
const debugMode = devMode();

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (debugMode) {
    console.log("Middleware executed for:", pathname);
  } // Check for session token in cookies (NextAuth uses different cookie names)
  const sessionToken =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  if (debugMode) {
    console.log("Session token exists:", !!sessionToken, "for path:", pathname);
  }
  // If we have a session token and user is trying to access signin page, redirect to dashboard
  if (sessionToken && pathname.startsWith("/auth/signin")) {
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
    if (!sessionToken) {
      // Anonymous user trying to view tutorial - check anonymous limit
      const anonymousCheckResult = await handleAnonymousTutorialAccess(
        req,
        pathname
      );
      if (anonymousCheckResult) {
        return anonymousCheckResult; // Redirect to signup if limit reached
      }
      // Allow access if under limit
      return NextResponse.next();
    } else {
      // Authenticated user - check subscription limits
      const limitCheckResult = await checkTutorialAccessLimits(
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
  if (isProtectedRoute(pathname) && !sessionToken) {
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
  const anonymousId = req.cookies.get("vibed_anonymous_id")?.value;

  if (!anonymousId) {
    // First-time anonymous visitor - allow access
    if (debugMode) {
      console.log("✅ First-time anonymous visitor, allowing tutorial access");
    }
    return null;
  }

  // Check how many tutorials they've viewed
  try {
    const baseUrl = new URL(req.url).origin;
    const trackingUrl = `${baseUrl}/api/anonymous/check-limit?anonymousId=${anonymousId}`;

    const response = await fetch(trackingUrl);

    if (!response.ok) {
      // If check fails, allow access (fail open)
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
    "/quiz/",  // Individual quiz attempts (note the trailing slash to avoid matching /quizzes)
  ];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

interface TutorialAccessResult {
  hasAccess: boolean;
  reason?: string;
  suggestedPlan?: string;
}

async function checkTutorialAccessLimits(
  sessionToken: { name: string; value: string } | undefined,
  pathname: string,
  req: NextRequest
): Promise<TutorialAccessResult> {
  try {
    // Extract tutorial slug from pathname (e.g., /tutorials/category/javascript/variables -> variables)
    const pathParts = pathname.split("/");
    const tutorialSlug = pathParts[pathParts.length - 1];

    if (!tutorialSlug) {
      if (debugMode) {
        console.log("🔧 No tutorial slug found, allowing category page");
        return { hasAccess: true }; // Allow category pages
      }
    }

    // Get user subscription info - use the request origin instead of NEXTAUTH_URL for internal calls
    const baseUrl = new URL(req.url).origin;
    const subscriptionUrl = `${baseUrl}/api/payments/subscription`;

    // Use the session token from cookies
    const sessionTokenCookie = sessionToken?.value;
    const sessionTokenName = sessionToken?.name;

    const subscriptionResponse = await fetch(subscriptionUrl, {
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
    const { subscription, tutorialLimits } = access;

    // If user has premium access, allow all tutorials
    if (subscription.canAccessPremium) {
      return { hasAccess: true };
    }

    // Check if user has reached tutorial limits
    if (!tutorialLimits.withinLimits) {
      return {
        hasAccess: false,
        reason: `You've reached the limit of ${tutorialLimits.max} tutorials on the ${subscription.plan} plan`,
        suggestedPlan: "VIBED",
      };
    }

    // Get tutorial info to check if it's premium
    const tutorialResponse = await fetch(
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
    "/tutorials/category/:path*",  // Keep for anonymous limit checking
    "/auth/signin",
    "/auth/signin/:path*",
    // Catch all auth routes
    "/auth/:path*",
  ],
};
