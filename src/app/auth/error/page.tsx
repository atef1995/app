"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Mail, Github } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorInfo = (errorType: string | null) => {
    switch (errorType) {
      case "OAuthAccountNotLinked":
        return {
          title: "Account Already Exists",
          description:
            "An account with this email already exists but was created using a different sign-in method.",
          solution:
            "Please sign in using your original method (Google or GitHub), or contact support if you need help linking your accounts.",
          icon: Mail,
        };
      case "Configuration":
        return {
          title: "Configuration Error",
          description:
            "There's an issue with the authentication configuration.",
          solution:
            "Please try again later or contact support if the problem persists.",
          icon: AlertTriangle,
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description:
            "You cancelled the sign-in process or access was denied.",
          solution:
            "Please try signing in again and grant the necessary permissions.",
          icon: AlertTriangle,
        };
      case "Verification":
        return {
          title: "Email Verification Required",
          description:
            "Please check your email and click the verification link.",
          solution:
            "If you didn't receive an email, please try signing in again.",
          icon: Mail,
        };
      default:
        return {
          title: "Authentication Error",
          description: "Something went wrong during the sign-in process.",
          solution:
            "Please try again or contact support if the problem continues.",
          icon: AlertTriangle,
        };
    }
  };

  const errorInfo = getErrorInfo(error);
  const ErrorIcon = errorInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Error Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <ErrorIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {errorInfo.title}
        </motion.h1>

        {/* Error Description */}
        <motion.p
          className="text-gray-600 dark:text-gray-400 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {errorInfo.description}
        </motion.p>

        {/* Solution */}
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Solution:</strong> {errorInfo.solution}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {error === "OAuthAccountNotLinked" && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link
                href="/auth/signin?provider=google"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                Google
              </Link>
              <Link
                href="/auth/signin?provider=github"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            </div>
          )}

          <Link
            href="/auth/signin"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && error && (
          <motion.div
            className="mt-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <strong>Debug:</strong> Error type: {error}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
