"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Eye,
  FileText,
  Loader,
  Search,
  Lock,
  Crown,
} from "lucide-react";
import { PageLayout } from "@/components/ui/PageLayout";
import { ContentGrid } from "@/components/ui/ContentGrid";
import Pagination from "@/components/ui/Pagination";
import Card from "@/components/ui/Card";
import { useMood } from "@/components/providers/MoodProvider";
import { useMoodColors } from "@/hooks/useMoodColors";
import {
  MoodImpactIndicator,
  QuickMoodSwitcher,
} from "@/components/ui/MoodImpactIndicator";

interface CheatSheet {
  id: string;
  title: string;
  topic: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  fileSize: string;
  fileFormat: "PDF" | "PNG" | "SVG";
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
  requiredPlan?: "VIBED" | "CRACKED";
  isPremium?: boolean;
}

export default function CheatSheetsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const moodColors = useMoodColors();
  const router = useRouter();

  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [premiumModalId, setPremiumModalId] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch cheat sheets from database
  useEffect(() => {
    const fetchCheatSheets = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          search: searchTerm,
          category: selectedCategory || "",
          difficulty: selectedDifficulty || "",
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        const response = await fetch(`/api/cheat-sheets?${params}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch cheat sheets");

        const data = await response.json();
        setCheatSheets(data.data);
        setTotalItems(data.pagination.total);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.data.map((sheet: CheatSheet) => sheet.category))
        ) as string[];
        setCategories(uniqueCategories.sort());
      } catch (err) {
        console.error("Error fetching cheat sheets:", err);
        setError("Failed to load cheat sheets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheatSheets();
  }, [
    searchTerm,
    selectedDifficulty,
    selectedCategory,
    currentPage,
    itemsPerPage,
  ]);

  const handleDownload = async (sheet: CheatSheet) => {
    try {
      // Check subscription for premium content
      if (sheet.isPremium && session?.user?.subscription === "FREE") {
        router.push("/pricing");
        return;
      }

      // Call download tracking API
      const response = await fetch("/api/cheat-sheets/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheetId: sheet.id }),
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const data = await response.json();

      // Trigger download
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download cheat sheet");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDifficulty(null);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  if (!session) {
    return (
      <PageLayout title="Cheat Sheets" subtitle="Sign up to access">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Access Cheat Sheets</h2>
          <p className="text-gray-600 mb-6">
            Sign up to download our comprehensive cheat sheets for programming
            concepts
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600"
          >
            Sign Up Now
          </Link>
        </div>
      </PageLayout>
    );
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <PageLayout title="📚 Cheat Sheets" subtitle="Quick reference guides">
      {/* Header with Mood Section */}
      <div
        className={`mb-8 rounded-lg border p-6 transition-colors duration-300 ${moodColors.border} ${moodColors.gradient}`}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <MoodImpactIndicator />
          <QuickMoodSwitcher />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cheat sheets..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty || ""}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value || null);
              setCurrentPage(1);
            }}
            title="Filter by difficulty level"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setCurrentPage(1);
            }}
            title="Filter by category"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Items Per Page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            title="Items per page"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value={3}>3 per page</option>
            <option value={6}>6 per page</option>
            <option value={9}>9 per page</option>
            <option value={12}>12 per page</option>
          </select>

          {/* Clear Filters Button */}
          {(searchTerm || selectedDifficulty || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Cheat Sheets Grid */}
      {!loading && cheatSheets.length > 0 && (
        <>
          <ContentGrid columns="3">
            {cheatSheets.map((sheet) => (
              <Card
                description={sheet.description}
                key={sheet.id}
                isPremium={sheet.isPremium}
                requiredPlan={sheet.requiredPlan}
                onPremiumClick={() => {
                  if (
                    sheet.isPremium &&
                    session?.user?.subscription === "FREE"
                  ) {
                    setPremiumModalId(sheet.id);
                  }
                }}
              >
                <div className="space-y-4">
                  {/* Difficulty Badge */}
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-block rounded px-3 py-1 text-xs font-semibold text-white ${
                        sheet.difficulty === "beginner"
                          ? "bg-green-500"
                          : sheet.difficulty === "intermediate"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {sheet.difficulty.charAt(0).toUpperCase() +
                        sheet.difficulty.slice(1)}
                    </span>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Title & Topic */}
                  <div>
                    <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                      {sheet.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sheet.topic}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sheet.description}
                  </p>

                  {/* Tags */}
                  {sheet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sheet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      {sheet.fileFormat} • {sheet.fileSize}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                    {sheet.isPremium &&
                    session?.user?.subscription === "FREE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPremiumModalId(sheet.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 py-2 font-medium text-white hover:from-yellow-500 hover:to-orange-600"
                      >
                        <Crown className="h-4 w-4" />
                        Unlock Premium
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setPreviewingId(sheet.id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(sheet)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </ContentGrid>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Empty State */}
      {!loading && cheatSheets.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-12 dark:border-gray-600">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            No cheat sheets found
          </p>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search term
          </p>
          {(searchTerm || selectedDifficulty || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Premium Lock Modal */}
      {premiumModalId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setPremiumModalId(null)}
        >
          <div
            className={`w-full max-w-md rounded-lg bg-white p-8 dark:bg-gray-800 shadow-2xl border-2 ${moodColors.border}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lock Icon */}
            <div className={`flex justify-center mb-6`}>
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${moodColors.gradient} text-white shadow-lg`}
              >
                <Lock className="w-10 h-10" />
              </div>
            </div>

            {/* Cheat Sheet Title */}
            <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {cheatSheets.find((s) => s.id === premiumModalId)?.title}
            </h3>

            {/* Premium Required Text */}
            <p className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {cheatSheets.find((s) => s.id === premiumModalId)?.requiredPlan}{" "}
              Content
            </p>

            {/* Description */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {cheatSheets.find((s) => s.id === premiumModalId)?.description}
            </p>

            {/* Mood-based message */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              {currentMood.id === "rush" && "🔥 Unlock all premium resources!"}
              {currentMood.id === "grind" &&
                "💪 Level up with premium content!"}
              {currentMood.id === "chill" && "✨ Explore premium content!"}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPremiumModalId(null)}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setPremiumModalId(null);
                  router.push("/subscription/upgrade");
                }}
                className={`flex-1 rounded-lg bg-gradient-to-r ${moodColors.gradient} px-4 py-3 font-medium text-white hover:shadow-lg transition-all`}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setPreviewingId(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold dark:text-white">
                {cheatSheets.find((s) => s.id === previewingId)?.title}
              </h2>
              <button
                onClick={() => setPreviewingId(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            <div className="mb-6 aspect-video rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <FileText className="mb-2 h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-500 dark:text-gray-400">
                  Preview image will appear here
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const sheet = cheatSheets.find((s) => s.id === previewingId);
                if (sheet) {
                  handleDownload(sheet);
                  setPreviewingId(null);
                }
              }}
              className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white hover:bg-blue-600"
            >
              Download Now
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
