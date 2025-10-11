"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * FeaturePreviewCard Component
 *
 * Shows a preview/teaser of a locked premium feature
 * Used to create FOMO and encourage upgrades to CRACKED plan
 *
 * Features:
 * - Eye-catching gradient border and badge
 * - Feature icon and description
 * - Screenshot/preview image (can be blurred or actual)
 * - Key benefits list
 * - Prominent upgrade CTA
 */

interface FeaturePreviewCardProps {
  /** Feature icon from lucide-react */
  icon: LucideIcon;
  /** Feature title */
  title: string;
  /** Short description (1-2 sentences) */
  description: string;
  /** Key benefits (2-4 items) */
  benefits: string[];
  /** Preview image URL (optional) */
  previewImage?: string;
  /** Blur the preview image (default: true) */
  blurPreview?: boolean;
  /** Custom className */
  className?: string;
  /** Show "Try Demo" button instead of upgrade */
  showDemo?: boolean;
  /** Demo click handler (if showDemo is true) */
  onDemoClick?: () => void;
  /** Show feature as "Coming Soon" */
  comingSoon?: boolean;
}

export function FeaturePreviewCard({
  icon: Icon,
  title,
  description,
  benefits,
  previewImage,
  blurPreview = true,
  className = "",
  showDemo = false,
  onDemoClick,
  comingSoon = false,
}: FeaturePreviewCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl
        bg-white dark:bg-gray-900
        border-2 border-gray-200 dark:border-gray-700
        hover:border-purple-500 dark:hover:border-purple-500
        transition-all duration-300
        hover:shadow-2xl hover:shadow-purple-500/20
        ${className}
      `}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
          </div>

          {/* CRACKED Badge */}
          <div className="flex flex-col gap-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3" />
              CRACKED
            </div>
            {comingSoon && (
              <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold text-center">
                Coming Soon
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>

        {/* Preview Image (if provided) */}
        {previewImage && (
          <div className="relative mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <img
              src={previewImage}
              alt={`${title} preview`}
              className={`w-full h-48 object-cover ${
                blurPreview ? "blur-sm scale-105" : ""
              }`}
            />
            {blurPreview && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-4">
                  <Lock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits List */}
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            What you&apos;ll get:
          </h4>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2">
          {showDemo && !comingSoon ? (
            <>
              <button
                onClick={onDemoClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Try Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/subscription/upgrade"
                className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:underline py-2"
              >
                Unlock Full Version
              </Link>
            </>
          ) : comingSoon ? (
            <div className="w-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold py-3 px-6 rounded-lg text-center cursor-not-allowed">
              Coming Soon
            </div>
          ) : (
            <Link
              href="/subscription/upgrade"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Unlock with CRACKED
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Locked indicator overlay (subtle) */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5 dark:opacity-10 pointer-events-none">
        <Lock className="w-full h-full text-purple-600" />
      </div>
    </div>
  );
}

/**
 * Lightweight Feature Badge
 * For inline feature locking indicators
 */
interface FeatureBadgeProps {
  locked?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function FeatureBadge({
  locked = true,
  size = "md",
  text = "CRACKED",
}: FeatureBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (!locked) {
    return (
      <div
        className={`inline-flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full font-bold ${sizeClasses[size]}`}
      >
        <Sparkles className={iconSizes[size]} />
        {text}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold ${sizeClasses[size]}`}
    >
      <Lock className={iconSizes[size]} />
      {text}
    </div>
  );
}
