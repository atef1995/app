"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import {
  User,
  LogOut,
  Home,
  BookOpen,
  Code,
  Brain,
  Settings,
  Crown,
  Trophy,
  Users,
  Building,
} from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/tutorials", label: "Tutorials", icon: BookOpen },
    { href: "/practice", label: "Practice", icon: Code },
    { href: "/quizzes", label: "Quizzes", icon: Brain },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/social", label: "Social", icon: Users },
    { href: "/pricing", label: "Pricing", icon: Crown },
    { href: "/projects", label: "Projects", icon: Building },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Make it smaller on mobile */}
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            <span className="text-blue-600">Vibed</span>{" "}
            <span className="hidden xs:inline">to </span>
            <span className="text-purple-600">Cracked</span>
          </Link>

          {/* Navigation - Desktop Only */}
          {session && (
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side - Compact on mobile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mood Indicator - Only on larger screens */}
            {session && (
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Learning in</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {currentMood.name}
                </span>
                <span>{currentMood.emoji}</span>
              </div>
            )}

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-sm">
                    {session.user?.name?.split(" ")[0] || session.user?.email}
                  </span>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/achievements"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Trophy className="w-4 h-4" />
                      Achievements
                    </Link>
                    <Link
                      href="/social"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Users className="w-4 h-4" />
                      Social
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base active:scale-95"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Improved spacing */}
        {session && (
          <nav className="lg:hidden mt-3 pt-3 border-t dark:border-gray-700">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {navigationItems.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs text-center">{item.label}</span>
                </Link>
              ))}
              {/* Pricing on separate row on mobile */}
              <div className="col-span-3 sm:col-span-4 pt-2">
                <Link
                  href="/pricing"
                  className="flex flex-col items-center gap-1 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                >
                  <Crown className="w-5 h-5" />
                  <span className="text-xs text-center">Pricing</span>
                </Link>
              </div>
            </div>

            {/* Mobile Mood Indicator */}
            <div className="mt-3 pt-3 border-t dark:border-gray-700 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Learning in</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {currentMood.name}
                </span>
                <span>{currentMood.emoji}</span>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
