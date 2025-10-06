"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Zap, Code2, BookOpen, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FreeCoursePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Add your email capture API endpoint here
      const response = await fetch("/api/subscribe-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            🎁 100% FREE - No Credit Card Required
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Master JavaScript in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              5 Days or Less
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Get our <strong>free email course</strong> that teaches you the JavaScript fundamentals
            you need to start building real projects — delivered straight to your inbox.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-900"
                />
              ))}
            </div>
            <span>Join 1,200+ developers already learning</span>
          </div>
        </motion.div>

        {/* What You'll Learn */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            What You&apos;ll Learn (5 Days)
          </h2>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                day: 1,
                title: "Variables & Data Types",
                description: "Master the building blocks",
                icon: Code2,
              },
              {
                day: 2,
                title: "Functions & Scope",
                description: "Write reusable code",
                icon: Zap,
              },
              {
                day: 3,
                title: "Arrays & Objects",
                description: "Organize your data",
                icon: BookOpen,
              },
              {
                day: 4,
                title: "DOM Manipulation",
                description: "Make pages interactive",
                icon: ArrowRight,
              },
              {
                day: 5,
                title: "Build Your First Project",
                description: "Put it all together",
                icon: Trophy,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.day}
                className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Day {item.day}
                </div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Email Form */}
        {!submitted ? (
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              Start Learning Today - It&apos;s Free!
            </h3>
            <p className="text-blue-100 text-center mb-6">
              Enter your email below to get instant access to Day 1
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-transparent focus:border-white focus:outline-none text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? "Subscribing..." : "Get Free Course"}
                </button>
              </div>
              {error && (
                <p className="text-red-200 text-sm mt-2 text-center">{error}</p>
              )}
              <p className="text-blue-100 text-xs mt-3 text-center">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-8 mb-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              You&apos;re In! Check Your Email 📧
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We&apos;ve sent Day 1 of your free JavaScript course. Check your inbox (and spam folder) now!
            </p>
            <Link
              href="/tutorials"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Tutorials
            </Link>
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            {
              icon: Zap,
              title: "Fast & Practical",
              description: "Each lesson takes 10 minutes or less to complete",
            },
            {
              icon: Code2,
              title: "Hands-On Projects",
              description: "Build real things, not just read theory",
            },
            {
              icon: Trophy,
              title: "Beginner Friendly",
              description: "No prior experience needed - start from zero",
            },
          ].map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
