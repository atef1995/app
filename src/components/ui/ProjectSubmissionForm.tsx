"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProjectWithDetails, ProjectSubmissionWithDetails } from "@/lib/projectService";
import { useSubmitProject } from "@/hooks/useProjectQueries";
import { useMood } from "@/components/providers/MoodProvider";
import { 
  Save, 
  Send, 
  Code, 
  Link as LinkIcon, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";

interface ProjectSubmissionFormProps {
  project: ProjectWithDetails;
  existingSubmission?: ProjectSubmissionWithDetails | null;
  onSubmissionUpdate?: (submission: ProjectSubmissionWithDetails) => void;
}

export default function ProjectSubmissionForm({
  project,
  existingSubmission,
  onSubmissionUpdate,
}: ProjectSubmissionFormProps) {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const submitProject = useSubmitProject();

  const [formData, setFormData] = useState({
    title: existingSubmission?.title || "",
    description: existingSubmission?.description || "",
    submissionUrl: existingSubmission?.submissionUrl || "",
    sourceCode: existingSubmission?.sourceCode || "",
    notes: existingSubmission?.notes || "",
  });

  const [activeTab, setActiveTab] = useState<string>(
    project.submissionType === "CODE" ? "code" : 
    project.submissionType === "LINK" ? "link" : "file"
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (existingSubmission) {
      setFormData({
        title: existingSubmission.title || "",
        description: existingSubmission.description || "",
        submissionUrl: existingSubmission.submissionUrl || "",
        sourceCode: existingSubmission.sourceCode || "",
        notes: existingSubmission.notes || "",
      });
    }
  }, [existingSubmission]);

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          accent: "border-orange-500 ring-orange-500",
          button: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
        };
      case "grind":
        return {
          accent: "border-blue-500 ring-blue-500",
          button: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
        };
      default:
        return {
          accent: "border-purple-500 ring-purple-500",
          button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        };
    }
  };

  const moodColors = getMoodColors();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (isSubmitting: boolean = false) => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (activeTab === "code" && !formData.sourceCode.trim()) {
      newErrors.sourceCode = "Source code is required for code submissions";
    }

    if (activeTab === "link" && !formData.submissionUrl.trim()) {
      newErrors.submissionUrl = "Submission URL is required for link submissions";
    }

    if (activeTab === "link" && formData.submissionUrl.trim()) {
      try {
        new URL(formData.submissionUrl);
      } catch {
        newErrors.submissionUrl = "Please enter a valid URL";
      }
    }

    if (isSubmitting && !formData.description.trim()) {
      newErrors.description = "Project description is required for submission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "DRAFT" | "SUBMITTED") => {
    if (!validateForm(status === "SUBMITTED")) {
      return;
    }

    try {
      const submission = await submitProject.mutateAsync({
        slug: project.slug,
        data: {
          ...formData,
          status,
        },
      });

      onSubmissionUpdate?.(submission);
      setIsDirty(false);
      
      // Show success message based on status
      if (status === "SUBMITTED") {
        alert("Project submitted successfully! It will now be assigned for peer review.");
      } else {
        alert("Draft saved successfully!");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project. Please try again.");
    }
  };

  const canSubmit = existingSubmission?.status !== "SUBMITTED" && 
                   existingSubmission?.status !== "UNDER_REVIEW" &&
                   existingSubmission?.status !== "REVIEWED" &&
                   existingSubmission?.status !== "APPROVED";

  const isReadOnly = !canSubmit;

  if (!session) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sign In Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You need to be signed in to submit projects.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {isReadOnly ? "View Submission" : "Submit Your Project"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {isReadOnly 
                ? `Status: ${existingSubmission?.status?.replace(/_/g, ' ').toLowerCase()}`
                : "Share your work and get feedback from peers"
              }
            </p>
          </div>

          {existingSubmission?.status && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm">
                {existingSubmission.status === "APPROVED" && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Approved</span>
                  </>
                )}
                {existingSubmission.status === "UNDER_REVIEW" && (
                  <>
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400">Under Review</span>
                  </>
                )}
                {existingSubmission.status === "REVIEWED" && (
                  <>
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400">Reviewed</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submission Type Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("code")}
            disabled={isReadOnly}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "code"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            } ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("link")}
            disabled={isReadOnly}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "link"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            } ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <LinkIcon className="w-4 h-4" />
            Link
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              readOnly={isReadOnly}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:${moodColors.accent}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}
                ${errors.title ? "border-red-500" : ""}`}
              placeholder="Give your project a descriptive title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Description {!isReadOnly && "*"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              readOnly={isReadOnly}
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:${moodColors.accent}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400 resize-none
                ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}
                ${errors.description ? "border-red-500" : ""}`}
              placeholder="Describe what you built, what challenges you faced, and what you learned"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Submission Content */}
          {activeTab === "code" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source Code *
              </label>
              <textarea
                value={formData.sourceCode}
                onChange={(e) => handleInputChange("sourceCode", e.target.value)}
                readOnly={isReadOnly}
                rows={12}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:${moodColors.accent}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm resize-none
                  ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}
                  ${errors.sourceCode ? "border-red-500" : ""}`}
                placeholder="Paste your JavaScript code here..."
              />
              {errors.sourceCode && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sourceCode}</p>
              )}
            </div>
          )}

          {activeTab === "link" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project URL *
              </label>
              <input
                type="url"
                value={formData.submissionUrl}
                onChange={(e) => handleInputChange("submissionUrl", e.target.value)}
                readOnly={isReadOnly}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:${moodColors.accent}
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400
                  ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}
                  ${errors.submissionUrl ? "border-red-500" : ""}`}
                placeholder="https://github.com/username/project or https://codepen.io/username/pen/..."
              />
              {errors.submissionUrl && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.submissionUrl}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Link to your GitHub repository, CodePen, or live demo
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              readOnly={isReadOnly}
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:outline-none focus:ring-2 focus:${moodColors.accent}
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400 resize-none
                ${isReadOnly ? "cursor-not-allowed opacity-60" : ""}`}
              placeholder="Any additional notes for reviewers (optional)"
            />
          </div>
        </div>

        {/* Actions */}
        {!isReadOnly && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isDirty ? "You have unsaved changes" : "All changes saved"}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit("DRAFT")}
                disabled={submitProject.isPending}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              <button
                onClick={() => handleSubmit("SUBMITTED")}
                disabled={submitProject.isPending}
                className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${moodColors.button}`}
              >
                <Send className="w-4 h-4" />
                {submitProject.isPending ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        )}

        {isReadOnly && existingSubmission?.submittedAt && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submitted on {new Date(existingSubmission.submittedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}