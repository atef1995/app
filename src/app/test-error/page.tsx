"use client";

import Link from "next/link";

export default function TestErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Test Error Handling
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Use these links to test different error scenarios:
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/error?error=OAuthAccountNotLinked"
            className="block w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
          >
            Test OAuth Account Not Linked Error
          </Link>

          <Link
            href="/auth/error?error=AccessDenied"
            className="block w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-center"
          >
            Test Access Denied Error
          </Link>

          <Link
            href="/auth/error?error=Configuration"
            className="block w-full bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors text-center"
          >
            Test Configuration Error
          </Link>

          <Link
            href="/auth/error?error=UnknownError"
            className="block w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
          >
            Test Unknown Error
          </Link>

          <Link
            href="/auth/signin?error=OAuthAccountNotLinked"
            className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Test Error on Sign-in Page
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Instructions for testing real OAuth error:
          </p>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Sign in with Google first</li>
            <li>Sign out</li>
            <li>Try to sign in with GitHub using the same email</li>
            <li>You should see the error page</li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
