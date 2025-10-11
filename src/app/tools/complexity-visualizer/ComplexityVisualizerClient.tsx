"use client";

import React, { useState } from "react";
import { ComplexityChart } from "./components/ComplexityChart";
import { AlgorithmComparison } from "./components/AlgorithmComparison";
import { ComplexityCalculator } from "./components/ComplexityCalculator";
import { PerformanceBenchmark } from "./components/PerformanceBenchmark";
import { FeaturePreviewCard, FeatureBadge } from "./components/FeaturePreviewCard";
import {
  LineChart,
  BarChart3,
  Calculator,
  TrendingUp,
  BookOpen,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

/**
 * ComplexityVisualizerClient Component
 *
 * Main client-side page for the Complexity Visualizer tool
 *
 * Features:
 * - Tabbed interface with 4 main tools
 * - Access control based on subscription plan
 * - Responsive design
 * - FOMO elements for FREE users
 */

interface ComplexityVisualizerClientProps {
  plan: "FREE" | "VIBED" | "CRACKED";
}

type TabId = "chart" | "comparison" | "calculator" | "benchmark";

interface Tab {
  id: TabId;
  name: string;
  icon: React.ElementType;
  description: string;
  locked: boolean;
}

export function ComplexityVisualizerClient({ plan }: ComplexityVisualizerClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("chart");

  const isCracked = plan === "CRACKED";

  /**
   * Define tabs with lock status
   */
  const tabs: Tab[] = [
    {
      id: "chart",
      name: "Growth Visualization",
      icon: LineChart,
      description: "Compare complexity curves",
      locked: false, // Always available (preview mode)
    },
    {
      id: "comparison",
      name: "Algorithm Comparison",
      icon: BarChart3,
      description: "Compare real algorithms",
      locked: false, // Always available (preview mode)
    },
    {
      id: "calculator",
      name: "Complexity Calculator",
      icon: Calculator,
      description: "Analyze your code",
      locked: false, // Always available (preview mode)
    },
    {
      id: "benchmark",
      name: "Performance Benchmark",
      icon: TrendingUp,
      description: "Run real benchmarks",
      locked: false, // Always available (preview mode)
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                Complexity Visualizer
                {!isCracked && <FeatureBadge locked={true} text="PREVIEW" size="lg" />}
                {isCracked && <FeatureBadge locked={false} text="CRACKED" size="lg" />}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isCracked
                  ? "Master Big O notation with interactive tools and real-time analysis"
                  : "Explore Big O notation with limited previews. Upgrade to CRACKED for full access!"}
              </p>
            </div>

            {/* Upgrade CTA (FREE/VIBED only) */}
            {!isCracked && (
              <Link
                href="/subscription/upgrade"
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Unlock Full Access
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex -mb-px space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? "border-purple-500 text-purple-600 dark:text-purple-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>

                  {/* Preview badge for non-CRACKED users */}
                  {!isCracked && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded-full font-semibold">
                      Preview
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Description */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {tabs.find((t) => t.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === "chart" && <ComplexityChart plan={plan} />}
          {activeTab === "comparison" && <AlgorithmComparison plan={plan} />}
          {activeTab === "calculator" && <ComplexityCalculator plan={plan} />}
          {activeTab === "benchmark" && <PerformanceBenchmark plan={plan} />}
        </div>

        {/* Bottom CTA Section (FREE/VIBED only) */}
        {!isCracked && (
          <div className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Master Big O Notation?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upgrade to CRACKED for unlimited access to all complexity tools
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <FeaturePreviewCard
                icon={LineChart}
                title="Custom Visualizations"
                description="Adjust input sizes, toggle curves, and see exact values for any algorithm"
                benefits={[
                  "Input sizes from 10 to 10,000",
                  "Toggle any complexity curve",
                  "Export data as CSV",
                ]}
              />
              <FeaturePreviewCard
                icon={Calculator}
                title="Code Analysis"
                description="Paste your code and get instant Big O analysis with explanations"
                benefits={[
                  "Analyze any code snippet",
                  "Step-by-step breakdown",
                  "Interview-ready explanations",
                ]}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/subscription/upgrade"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg"
              >
                Start 7-Day FREE Trial
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Compare Plans →
              </Link>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>
        )}

        {/* Related Resources */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Related Learning Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/tutorials/data-structures/00-time-complexity-big-o"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Big O Notation Tutorial
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn the fundamentals of time and space complexity
              </p>
            </Link>
            <Link
              href="/tutorials/data-structures/02-two-pointer-technique"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Two-Pointer Technique
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Master O(n) algorithms for array problems
              </p>
            </Link>
            <Link
              href="/challenges"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Practice Challenges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Apply what you learned with real coding problems
              </p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Part of the <strong>Vibed to Cracked</strong> learning platform.{" "}
            {!isCracked && (
              <Link href="/subscription/upgrade" className="text-purple-600 dark:text-purple-400 hover:underline">
                Upgrade to CRACKED
              </Link>
            )}{" "}
            for full access.
          </p>
        </div>
      </footer>
    </div>
  );
}
