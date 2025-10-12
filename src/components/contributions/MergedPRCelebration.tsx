"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

/**
 * MergedPRCelebration Component
 *
 * Animated success screen when a PR is merged.
 * Shows confetti animation, XP earned, badge unlocks, and portfolio update.
 *
 * Features:
 * - Canvas confetti animation
 * - XP counter animation
 * - Badge showcase
 * - Portfolio link
 * - Social sharing buttons
 */

interface MergedPRCelebrationProps {
  projectTitle: string;
  featureTitle: string;
  xpEarned: number;
  prUrl: string;
  submissionId: string;
  badgeUnlocked?: {
    id: string;
    title: string;
    icon: string;
  };
  onClose?: () => void;
}

export default function MergedPRCelebration({
  projectTitle,
  featureTitle,
  xpEarned,
  prUrl,
  submissionId,
  badgeUnlocked,
  onClose,
}: MergedPRCelebrationProps) {
  const [xpCount, setXpCount] = useState(0);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#ec4899"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Animate XP counter
    const xpInterval = setInterval(() => {
      setXpCount((prev) => {
        if (prev >= xpEarned) {
          clearInterval(xpInterval);
          return xpEarned;
        }
        return prev + Math.ceil(xpEarned / 50);
      });
    }, 30);

    // Show badge after delay
    if (badgeUnlocked) {
      setTimeout(() => setShowBadge(true), 1500);
    }

    return () => {
      clearInterval(xpInterval);
    };
  }, [xpEarned, badgeUnlocked]);

  const handleShare = (platform: "twitter" | "linkedin") => {
    const text = `Just got my PR merged on Vibed to Cracked! 🎉\n\nProject: ${projectTitle}\nFeature: ${featureTitle}\nXP Earned: ${xpEarned}\n\n`;
    const url = prUrl;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-full p-6 mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-2"
          >
            PR Merged! 🎉
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg"
          >
            Your code is now live in production!
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Project Info */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{projectTitle}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Feature: <span className="font-medium">{featureTitle}</span>
            </p>
          </div>

          {/* XP Earned */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center border-2 border-blue-200 dark:border-blue-800"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              XP EARNED
            </p>
            <motion.p
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              key={xpCount}
            >
              +{xpCount}
            </motion.p>
          </motion.div>

          {/* Badge Unlock */}
          <AnimatePresence>
            {badgeUnlocked && showBadge && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 text-center border-2 border-yellow-300 dark:border-yellow-700"
              >
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  🏆 NEW BADGE UNLOCKED!
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl">{badgeUnlocked.icon}</span>
                  <div className="text-left">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {badgeUnlocked.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolio Update */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Portfolio Updated
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This PR has been added to your public portfolio. Recruiters can now see this
                contribution!
              </p>
            </div>
          </div>

          {/* GitHub Contribution */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-800 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                GitHub Contribution
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This counts as a real open-source contribution on your GitHub profile!
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Share your achievement
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors text-center font-medium"
            >
              View on GitHub
            </a>
            <a
              href={`/contributions/submissions/${submissionId}`}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              View Submission
            </a>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
