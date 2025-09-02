"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjectQueries";
import { useCategories } from "@/hooks/useTutorialQueries";
import ProjectCard from "@/components/ui/ProjectCard";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { useMood } from "@/components/providers/MoodProvider";
import {
  Code,
  Filter,
  Grid,
  List,
  BookOpen,
  Trophy,
  Users,
  Sparkles,
} from "lucide-react";

export default function ProjectsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const projectsQuery = useProjects(selectedCategory || undefined);
  const categoriesQuery = useCategories(1, 100); // Get all categories in one page

  if (!session) {
    return (
      <PageLayout
        title="Projects"
        subtitle="Build real applications and get peer feedback"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please sign in to access projects.
            </p>
            <Link
              href="/auth/signin"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (projectsQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <PageLayout
        title="Projects"
        subtitle="Build real applications and get peer feedback"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (projectsQuery.error) {
    return (
      <PageLayout
        title="Projects"
        subtitle="Build real applications and get peer feedback"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading projects. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const projects = projectsQuery.data || [];
  const categories = categoriesQuery.data?.data || [];

  // Group projects by category for stats
  const projectsByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <PageLayout
      title="Build & Share Projects"
      subtitle={`Apply your skills in real-world projects • ${currentMood.name} mode`}
    >
      {/* Mood Info Card */}
      <MoodInfoCard className="mb-8" />

      {/* Hero Section */}
      <div className="mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Code className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            From Learning to Building
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Complete hands-on projects after finishing each learning module. Get
            constructive feedback from your peers and showcase your work.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Real-world applications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Peer code reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Public showcase
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Category:
            </span>
          </div>
          <select
            title={selectedCategory as string}
            value={selectedCategory || ""}
            onChange={(e) => {
              e.preventDefault();
              setSelectedCategory(e.target.value || null);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div> */}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Projects Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {selectedCategory
              ? `No projects found in the ${selectedCategory} category.`
              : "Projects are coming soon! Complete tutorials to unlock project assignments."}
          </p>
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Explore Tutorials
          </Link>
        </div>
      ) : (
        <ContentGrid className={viewMode === "list" ? "grid-cols-1" : ""}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showCategory={!selectedCategory}
            />
          ))}
        </ContentGrid>
      )}

      {/* Quick Stats */}
      {projects.length > 0 && (
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Project Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projects.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {projects.filter((p) => !p.isPremium).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Free Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.keys(projectsByCategory).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {projects.reduce(
                  (sum, p) => sum + (p._count?.submissions || 0),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Submissions
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
