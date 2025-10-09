/**
 * Anonymous Progress Banner
 *
 * Shows anonymous users how many tutorials they've viewed and encourages signup.
 * Displays after viewing 3+ tutorials.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { getAnonymousSession } from '@/lib/anonymousId';

const ANONYMOUS_TUTORIAL_LIMIT = 5;

export default function AnonymousProgressBanner() {
  const [show, setShow] = useState(false);
  const [viewedCount, setViewedCount] = useState(0);

  useEffect(() => {
    const session = getAnonymousSession();
    if (session) {
      const count = session.tutorialsViewed.length;
      setViewedCount(count);

      // Show banner after viewing 3+ tutorials
      if (count >= 3 && count < ANONYMOUS_TUTORIAL_LIMIT) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  const remaining = ANONYMOUS_TUTORIAL_LIMIT - viewedCount;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-20 left-0 right-0 z-40 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">
                  You&apos;ve viewed {viewedCount} tutorial{viewedCount !== 1 ? 's' : ''}
                </p>
                <p className="text-sm opacity-90">
                  {remaining} free tutorial{remaining !== 1 ? 's' : ''} remaining.
                  Sign up to unlock unlimited access!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Sign Up Free
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShow(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
