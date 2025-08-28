"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/ui/PageLayout";
import { ReviewInvitations } from "@/components/project/ReviewInvitations";
import { ActiveReviews } from "@/components/project/ActiveReviews";
import { useReviewAssignments } from "@/hooks/useProjectQueries";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award,
  ArrowLeft,
  Users,
  TrendingUp
} from "lucide-react";

type TabType = "invitations" | "active" | "completed";

export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("invitations");

  const { data: pendingAssignments } = useReviewAssignments(["ASSIGNED"]);
  const { data: activeAssignments } = useReviewAssignments(["ACCEPTED"]);
  const { data: completedAssignments } = useReviewAssignments(["COMPLETED"]);

  if (status === "loading") {
    return (
      <PageLayout
        title="Peer Reviews"
        subtitle="Manage your review assignments"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (!session) {
    return (
      <PageLayout
        title="Peer Reviews"
        subtitle="Manage your review assignments"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to access your review assignments.
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

  const tabs = [
    {
      id: "invitations" as TabType,
      label: "Invitations",
      icon: FileText,
      count: pendingAssignments?.length || 0,
      color: "blue",
    },
    {
      id: "active" as TabType,
      label: "Active",
      icon: CheckCircle2,
      count: activeAssignments?.length || 0,
      color: "green",
    },
    {
      id: "completed" as TabType,
      label: "Completed",
      icon: Award,
      count: completedAssignments?.length || 0,
      color: "purple",
    },
  ];

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? "bg-blue-600 text-white" 
        : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
      green: isActive 
        ? "bg-green-600 text-white" 
        : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
      purple: isActive 
        ? "bg-purple-600 text-white" 
        : "text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <PageLayout
      title="Peer Reviews"
      subtitle="Help your fellow students by reviewing their project submissions"
    >
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {pendingAssignments?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending Invitations
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeAssignments?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Reviews
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedAssignments?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Reviews Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${getTabColorClasses(tab.color, isActive)}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-800 dark:text-${tab.color}-200`
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === "invitations" && <ReviewInvitations />}
          {activeTab === "active" && <ActiveReviews />}
          {activeTab === "completed" && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Completed Reviews</p>
              <p>Your completed review history will appear here.</p>
              {completedAssignments && completedAssignments.length > 0 && (
                <p className="mt-2">You&apos;ve completed {completedAssignments.length} reviews so far!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          How Peer Reviews Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              📨 Receiving Invitations
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You&apos;ll receive invitations to review projects from students at your skill level. 
              Accept those you have time and expertise for.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              ⏰ Review Deadlines
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Most peer reviews have a 7-day deadline. Admin reviews are prioritized with 3-day deadlines.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              🎯 Quality Reviews
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Provide constructive feedback focusing on code quality, functionality, and improvements.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              🚀 Admin Fallback
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              If peer reviewers aren&apos;t available, submissions are automatically assigned to instructors.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}