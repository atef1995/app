"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, TrendingUp, Zap, X } from "lucide-react";

/**
 * UpgradeOverlay Component
 *
 * Creates FOMO by showing blurred premium content with upgrade CTA
 * Used to convert FREE/VIBED users to CRACKED plan
 * Can be dismissed to explore preview mode
 */

interface UpgradeOverlayProps {
  /** Feature name being locked */
  featureName: string;
  /** Value proposition - why this feature matters */
  valueProp: string;
  /** Key benefits (3-4 bullet points) */
  benefits: string[];
  /** User's current plan */
  currentPlan: "FREE" | "VIBED" | "CRACKED";
  /** Custom className */
  className?: string;
  /** Show video demo button */
  showDemo?: boolean;
  /** Callback when overlay is dismissed */
  onDismiss?: () => void;
}

export function UpgradeOverlay({
  featureName,
  valueProp,
  benefits,
  currentPlan,
  className = "",
  showDemo = false,
  onDismiss,
}: UpgradeOverlayProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Calculate upgrade price based on current plan
  const upgradePrice = currentPlan === "VIBED" ? "$9.92" : "$19.90";
  const savingsText = currentPlan === "FREE" ? "Save 33%" : "Unlock everything";

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  // If dismissed, don't render
  if (isDismissed) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Backdrop Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-blue-900/30 rounded-lg z-10" />

      {/* Lock Icon Background */}
      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-10">
        <Lock className="w-48 h-48 text-white" />
      </div>

      {/* Main CTA Card */}
      <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border-4 border-purple-500 animate-pulse-slow relative">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            aria-label="Close overlay"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
          </button>
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              CRACKED EXCLUSIVE
            </div>
          </div>

          {/* Feature Name */}
          <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {featureName}
          </h3>

          {/* Value Prop */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {valueProp}
          </p>

          {/* Benefits List */}
          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
              >
                <div className="bg-green-500 rounded-full p-1 mt-0.5">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-purple-900 dark:text-purple-200">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">1,247 developers upgraded this month</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {upgradePrice}
              <span className="text-lg text-gray-500 dark:text-gray-400">/month</span>
            </div>
            {currentPlan === "FREE" && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                $29.90/month
              </div>
            )}
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
              {savingsText}
            </div>
          </div>

          {/* Primary CTA */}
          <Link
            href="/subscription/upgrade"
            className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg mb-3"
          >
            Start 7-Day FREE Trial
          </Link>

          {/* Secondary Info */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No credit card required • Cancel anytime
            </p>
            {showDemo && (
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                Watch Demo Video →
              </button>
            )}
          </div>

          {/* Feature Comparison Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/pricing"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Compare all plans →
            </Link>
          </div>

          {/* Close Hint */}
          <div className="text-center mt-4">
            <button
              onClick={handleDismiss}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Close to explore preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight Upgrade Banner
 * For smaller CTAs above features
 */
interface UpgradeBannerProps {
  message: string;
  ctaText?: string;
  compact?: boolean;
}

export function UpgradeBanner({
  message,
  ctaText = "Upgrade to CRACKED",
  compact = false,
}: UpgradeBannerProps) {
  return (
    <div
      className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white ${
        compact ? "px-4 py-2" : "px-6 py-4"
      } rounded-lg flex items-center justify-between gap-4`}
    >
      <div className="flex items-center gap-3">
        <Lock className={compact ? "w-4 h-4" : "w-5 h-5"} />
        <span className={compact ? "text-sm" : "text-base"}>{message}</span>
      </div>
      <Link
        href="/subscription/upgrade"
        className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
      >
        {ctaText}
      </Link>
    </div>
  );
}
