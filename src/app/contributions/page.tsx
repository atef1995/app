"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProjectList } from "@/components/contributions/ProjectList";
import { ProjectFilters } from "@/components/contributions/ProjectFilters";
import { ContributionProject } from "@/lib/types/contribution";
import { GitPullRequest, Trophy, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";

export default function ContributionsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ContributionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    premium: "",
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.set("category", filters.category);
      if (filters.difficulty) queryParams.set("difficulty", filters.difficulty);
      if (filters.premium) queryParams.set("premium", filters.premium);

      const response = await fetch(
        `/api/contributions/projects?${queryParams.toString()}`
      );
      const data = await response.json();

      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.error || "Failed to fetch projects");
      }
    } catch (err) {
      setError("Failed to load contribution projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <GitPullRequest className="h-10 w-10 text-cyan-600 dark:text-cyan-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Contribution Projects
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Choose a project to contribute to, earn XP, and build your portfolio with real-world experience.
          </p>

          {/* Quick Navigation Cards */}
          {session && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link
                href="/contributions/dashboard"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600 group"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      My Dashboard
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      View your submissions and stats
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/contributions/reviews"
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600 group"
              >
                <div className="flex items-center gap-3">
                  <ListChecks className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Review Queue
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Review others' contributions
                    </p>
                  </div>
                </div>
              </Link>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4 shadow-md border-2 border-yellow-300 dark:border-yellow-600">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Level {session.user.level || 1}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.user.xp || 0} XP earned
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <ProjectFilters
          category={filters.category}
          difficulty={filters.difficulty}
          isPremium={filters.premium}
          onFilterChange={handleFilterChange}
        />

        {/* Error Display */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-4 mb-8">
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
        ) : null}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading projects...</p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  );
}
