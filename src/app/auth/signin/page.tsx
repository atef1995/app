"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, useSession, getProviders } from "next-auth/react";
import Link from "next/link";
import type { ClientSafeProvider } from "next-auth/react";
import { CheckCircle, Github } from "lucide-react";
import Button from "@/components/ui/Button";
import { BUTTON_COLOR } from "@/types/button";
import LinkButton from "@/components/ui/LinkButton";
import { LINK_BUTTON_COLOR } from "@/types/linkButton";

function SignInContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  // Redirect authenticated users to the callback URL
  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = callbackUrl;
    }
  }, [status, callbackUrl]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, middleware will handle redirect, but show message just in case
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-green-600 mb-4 flex justify-center">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You are signed in!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecting you to your destination...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-4">
              Signed in as: {session?.user?.email}
            </p>
            <div className="mt-6">
              <Link
                href={callbackUrl}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block text-center active:scale-95"
              >
                Continue to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-blue-600">Vibed</span> to{" "}
            <span className="text-purple-600">Cracked</span>
          </h1>
          <p className="text-gray-600">
            Sign in to start your mood-driven JavaScript learning journey
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  {error === "OAuthAccountNotLinked" ? (
                    <p>
                      An account with this email already exists. Please sign in
                      with your original method (Google or GitHub).
                    </p>
                  ) : error === "AccessDenied" ? (
                    <p>
                      Access was denied. Please try again and grant the
                      necessary permissions.
                    </p>
                  ) : error === "Configuration" ? (
                    <p>
                      There&apos;s a configuration issue. Please try again
                      later.
                    </p>
                  ) : (
                    <p>
                      Something went wrong during sign-in. Please try again.
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Link
                    href={`/auth/error?error=${error}`}
                    className="text-sm text-red-600 hover:text-red-500 underline"
                  >
                    View detailed error information →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <>
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl })}
                  color={BUTTON_COLOR.BLUE}
                >
                  {provider.name === "GitHub" && <Github />}
                  {provider.name === "Google" && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with {provider.name}
                </Button>
              </>
            ))}
        </div>

        <div className="mt-8 text-center">
          <LinkButton
            href="/"
            text="← Back to home"
            color={LINK_BUTTON_COLOR.DEFAULT}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
