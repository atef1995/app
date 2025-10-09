import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

interface SignupCTAProps {
  variant?: "primary" | "secondary" | "inline" | "banner";
  message?: string;
  className?: string;
  showBenefits?: boolean;
}

export function SignupCTA({
  variant = "primary",
  message,
  className = "",
  showBenefits = false,
}: SignupCTAProps) {
  const defaultMessages = {
    primary: "Start Learning Free",
    secondary: "Sign Up to Save Progress",
    inline: "Sign up free",
    banner: "Create your free account to continue",
  };

  const displayMessage = message || defaultMessages[variant];

  if (variant === "banner" && showBenefits) {
    return (
      <div
        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl ${className}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <h3 className="text-2xl font-bold">Unlock Your Full Learning Potential</h3>
          </div>
          <p className="text-blue-100 mb-6 text-lg">
            {displayMessage}
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Track Your Progress</p>
                <p className="text-sm text-blue-100">
                  Save your place and pick up where you left off
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Earn Achievements</p>
                <p className="text-sm text-blue-100">
                  Unlock badges and certificates as you learn
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Unlimited Tutorials</p>
                <p className="text-sm text-blue-100">
                  Access our entire library of interactive lessons
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Join the Community</p>
                <p className="text-sm text-blue-100">
                  Connect with thousands of learners like you
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
          >
            Sign Up Free - It&apos;s Quick!
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-blue-100 mt-4">
            No credit card required • 100% free forever • Join 10,000+ learners
          </p>
        </div>
      </div>
    );
  }

  if (variant === "primary") {
    return (
      <Link
        href="/auth/signin"
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg ${className}`}
      >
        {displayMessage}
        <ArrowRight className="h-5 w-5" />
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        href="/auth/signin"
        className={`inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-all ${className}`}
      >
        {displayMessage}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (variant === "inline") {
    return (
      <Link
        href="/auth/signin"
        className={`inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline ${className}`}
      >
        {displayMessage}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  // Banner variant (without benefits)
  return (
    <div
      className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg flex items-center justify-between ${className}`}
    >
      <div>
        <p className="font-bold text-lg mb-1">{displayMessage}</p>
        <p className="text-sm text-blue-100">
          100% free • No credit card required
        </p>
      </div>
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all flex-shrink-0"
      >
        Sign Up Free
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
