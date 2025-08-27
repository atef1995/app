"use client";

import React from "react";
import Link from "next/link";
import { Crown, Zap } from "lucide-react";

interface AccessResult {
  canAccess: boolean;
  needsUpgrade?: boolean;
  reason?: string;
}

interface AccessWarningBannerProps {
  accessCheck: AccessResult;
}

export default function AccessWarningBanner({ accessCheck }: AccessWarningBannerProps) {
  // Only show warning if access is denied but we don't need full upgrade flow
  if (accessCheck.canAccess || accessCheck.needsUpgrade) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-3">
        <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-1">
            Upgrade Required
          </h3>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
            {accessCheck.reason}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Zap className="w-4 h-4" />
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
}