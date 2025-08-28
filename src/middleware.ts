import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("Middleware executed for:", pathname);

  // Check for session token in cookies (NextAuth uses different cookie names)
  const sessionToken =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  console.log("Session token exists:", !!sessionToken, "for path:", pathname);

  // If we have a session token and user is trying to access signin page, redirect to dashboard
  if (sessionToken && pathname.startsWith("/auth/signin")) {
    const callbackUrl =
      req.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    console.log("Redirecting authenticated user from signin to:", callbackUrl);
    return NextResponse.redirect(new URL(callbackUrl, req.url));
  }

  // Check if the route requires authentication
  if (isProtectedRoute(pathname) && !sessionToken) {
    console.log("Redirecting unauthenticated user to signin for:", pathname);
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check tutorial access limits for authenticated users
  if (pathname.startsWith("/tutorials/category/") && sessionToken) {
    const limitCheckResult = await checkTutorialAccessLimits(
      sessionToken,
      pathname,
      req
    );
    console.log("🔍 Check result:", { limitCheckResult });

    if (!limitCheckResult.hasAccess) {
      console.log(`🚫 Tutorial access denied: ${limitCheckResult.reason}`);

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
      console.log("✅ Tutorial access granted");
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    "/dashboard",
    "/tutorials",
    "/practice",
    "/quizzes",
    "/quiz",
    "/settings",
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
      console.log("🔧 No tutorial slug found, allowing category page");
      return { hasAccess: true }; // Allow category pages
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
    "/dashboard/:path*",
    "/tutorials/:path*",
    "/practice/:path*",
    "/quizzes/:path*",
    "/quiz/:path*",
    "/settings/:path*",
    "/auth/signin",
    "/auth/signin/:path*",
    // Catch all auth routes
    "/auth/:path*",
  ],
};
