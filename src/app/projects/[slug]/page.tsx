"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProject, useUserSubmission } from "@/hooks/useProjectQueries";
import { usePremiumContentHandler } from "@/hooks/usePremiumContentHandler";
import ProjectSubmissionForm from "@/components/ui/ProjectSubmissionForm";
import PremiumModal from "@/components/ui/PremiumModal";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { useMood } from "@/components/providers/MoodProvider";
import {
  ArrowLeft,
  Clock,
  Users,
  AlertCircle,
  Code,
  Link as LinkIcon,
  FileText,
  BookOpen,
  Target,
  Trophy,
  Eye,
} from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: session } = useSession();
  const { currentMood } = useMood();

  const {
    handlePremiumContent,
    isPremiumLocked,
    selectedPremiumContent,
    showPremiumModal,
    setShowPremiumModal,
  } = usePremiumContentHandler();

  const projectQuery = useProject(slug);
  const submissionQuery = useUserSubmission(slug);

  if (projectQuery.isLoading || submissionQuery.isLoading) {
    return (
      <PageLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (projectQuery.error || !projectQuery.data) {
    return (
      <PageLayout title="Project Not Found" subtitle="The requested project could not be found">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Project Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const project = projectQuery.data;
  const submission = submissionQuery.data;
  const isLocked = isPremiumLocked(project);

  const getSubmissionTypeIcon = (type: string) => {
    switch (type) {
      case "CODE":
        return Code;
      case "LINK":
        return LinkIcon;
      case "FILE":
        return FileText;
      default:
        return Code;
    }
  };

  const getSubmissionTypeLabel = (type: string) => {
    switch (type) {
      case "CODE":
        return "Code Submission";
      case "LINK":
        return "External Link";
      case "FILE":
        return "File Upload";
      default:
        return "Code Submission";
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900";
    if (difficulty <= 2) return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900";
    return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 1) return "Beginner";
    if (difficulty <= 2) return "Intermediate";
    return "Advanced";
  };

  const SubmissionIcon = getSubmissionTypeIcon(project.submissionType);

  const handleProjectAccess = () => {
    handlePremiumContent(
      {
        title: project.title,
        isPremium: project.isPremium,
        requiredPlan: project.requiredPlan,
        type: "project",
      },
      () => {
        // Content is already accessible, no need to navigate
      }
    );
  };

  return (
    <PageLayout
      title={project.title}
      subtitle={`${project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project • ${currentMood.name} Mode`}
    >
      {/* Mood Info Card */}
      <MoodInfoCard className="mb-8" />

      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium capitalize">
                    {project.category}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyColor(project.difficulty)}`}>
                    {getDifficultyLabel(project.difficulty)}
                  </span>
                  {project.isPremium && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium">
                      {project.requiredPlan}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {project.title}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Project Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~{project.estimatedHours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <SubmissionIcon className="w-4 h-4" />
                <span>{getSubmissionTypeLabel(project.submissionType)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{project._count?.submissions || 0} submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{project.minReviews} peer reviews required</span>
              </div>
            </div>
          </div>

          {/* Submission Status */}
          {submission && (
            <div className="lg:w-80">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Your Submission
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`text-sm font-medium ${
                      submission.status === "APPROVED" ? "text-green-600 dark:text-green-400" :
                      submission.status === "REVIEWED" ? "text-blue-600 dark:text-blue-400" :
                      submission.status === "UNDER_REVIEW" ? "text-yellow-600 dark:text-yellow-400" :
                      submission.status === "SUBMITTED" ? "text-purple-600 dark:text-purple-400" :
                      "text-gray-600 dark:text-gray-400"
                    }`}>
                      {submission.status.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                  
                  {submission.grade && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Grade:</span>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {submission.grade.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reviews:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {submission._count?.reviews || 0} / {project.minReviews}
                    </span>
                  </div>

                  {submission.submittedAt && (
                    <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                      Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLocked ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Premium Project
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This project requires a {project.requiredPlan} subscription to access.
            </p>
            <button
              onClick={handleProjectAccess}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
            >
              Upgrade to {project.requiredPlan}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Requirements Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Project Requirements
              </h2>
            </div>

            <div className="grid gap-4">
              {project.requirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      requirement.priority === "MUST_HAVE" ? "bg-red-500" :
                      requirement.priority === "SHOULD_HAVE" ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {requirement.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        requirement.type === "FEATURE" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" :
                        requirement.type === "TECHNICAL" ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400" :
                        requirement.type === "DESIGN" ? "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400" :
                        "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      }`}>
                        {requirement.type.toLowerCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        requirement.priority === "MUST_HAVE" ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400" :
                        requirement.priority === "SHOULD_HAVE" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400" :
                        "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      }`}>
                        {requirement.priority.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {requirement.description}
                    </p>
                  </div>
                  {requirement.points && (
                    <div className="flex-shrink-0 text-right">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {requirement.points} pts
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          {project.resources && project.resources.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Helpful Resources
                </h2>
              </div>

              <div className="grid gap-3">
                {project.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      resource.type === "DOCUMENTATION" ? "bg-blue-500" :
                      resource.type === "TUTORIAL" ? "bg-green-500" :
                      resource.type === "EXAMPLE" ? "bg-purple-500" :
                      "bg-yellow-500"
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {resource.title}
                      </h4>
                      {resource.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      resource.type === "DOCUMENTATION" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" :
                      resource.type === "TUTORIAL" ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" :
                      resource.type === "EXAMPLE" ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400" :
                      "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                    }`}>
                      {resource.type.toLowerCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submission Form */}
          {session && (
            <ProjectSubmissionForm
              project={project}
              existingSubmission={submission}
              onSubmissionUpdate={() => {
                submissionQuery.refetch();
              }}
            />
          )}
        </>
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        requiredPlan={selectedPremiumContent?.requiredPlan || "VIBED"}
        contentType={selectedPremiumContent?.type || "project"}
        contentTitle={selectedPremiumContent?.title}
      />
    </PageLayout>
  );
}