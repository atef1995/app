"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { ContributionProject } from "@/lib/types/contribution";
import { ProjectHeader } from "@/components/contributions/ProjectHeader";
import { FeatureList } from "@/components/contributions/FeatureList";
import { SubmissionForm } from "@/components/contributions/SubmissionForm";
import { ProjectDetailSkeleton } from "@/components/contributions/LoadingSkeleton";
import { ArrowLeft, AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { ProjectApiResponse, SubmissionApiResponse } from "@/lib/types/api";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { data: session } = useSession();
  const [project, setProject] = useState<ContributionProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { slug } = use(params);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/contributions/projects/${slug}`);
      const data = (await response.json()) as ProjectApiResponse;

      if (data.success && data.project) {
        setProject(data.project);
      } else {
        throw new Error(data.error || "Failed to fetch project details");
      }
    } catch (err) {
      setError((err as Error).message || "Failed to load project details");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleSubmitPR = async (prUrl: string) => {
    if (!session?.user?.id || !activeFeature) {
      throw new Error("You must be logged in to submit a PR");
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/contributions/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project?.id,
          featureId: activeFeature,
          prUrl,
        }),
      });

      const data = (await response.json()) as SubmissionApiResponse;

      if (!data.success) {
        throw new Error(data.error || "Failed to submit PR");
      }

      // Reset active feature and refresh project data
      setActiveFeature(null);
      await fetchProject();
    } catch (err) {
      throw new Error((err as Error).message || "Failed to submit PR");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Error Loading Project</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "Project not found"}
            </p>
            <div className="flex space-x-4">
              <Link
                href="/contributions"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Link>
              <button
                onClick={() => {
                  setRetryCount((count) => count + 1);
                  fetchProject();
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <ProjectHeader project={project} />

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <FeatureList features={project.features} />
          </div>

          {session?.user ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Submit Your Solution
              </h2>
              {project.features.map((feature) => (
                <div key={feature.id} className="mb-6 last:mb-0">
                  {activeFeature === feature.id ? (
                    <SubmissionForm
                      feature={feature}
                      onSubmit={handleSubmitPR}
                      submitting={submitting}
                    />
                  ) : (
                    <button
                      onClick={() => setActiveFeature(feature.id)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Click to submit a PR for this feature
                      </p>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-blue-800 dark:text-blue-200">
                Please sign in to submit your solutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
