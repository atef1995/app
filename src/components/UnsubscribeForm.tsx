"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  useEffect(() => {
    if (email) {
      setConfirmEmail(email);
    }
  }, [email]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmEmail) {
      setStatus("error");
      setMessage("Please provide an email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: confirmEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unsubscribe");
      }

      setStatus("success");
      setMessage(
        data.message || "Successfully unsubscribed from promotional emails"
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to unsubscribe"
      );
    }
  };

  return (
    <>
      {status === "success" ? (
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Successfully Unsubscribed
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <p className="text-sm text-gray-500 mb-6">
            You&apos;ll no longer receive promotional emails from Vibed to
            Cracked. However, you&apos;ll still receive important
            account-related emails like password resets and security
            notifications.
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Return to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📧</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Unsubscribe from Emails
          </h1>
          <p className="text-gray-600 text-center mb-6">
            We&apos;re sorry to see you go. You can unsubscribe from promotional
            emails below.
          </p>

          {status === "error" && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={status === "loading"}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Unsubscribing will stop promotional
                emails, but you&apos;ll still receive important account
                notifications and security alerts.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </span>
              ) : (
                "Unsubscribe from Promotional Emails"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Cancel and return home
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">
              What you&apos;ll miss:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• New tutorial announcements</li>
              <li>• Exclusive learning tips and resources</li>
              <li>• Special offers and promotions</li>
              <li>• Platform updates and new features</li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
