"use client";

import { useState, useEffect } from "react";
import { Bug, Send, AlertTriangle } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import { useToastContext } from "@/components/providers/ToastProvider";
import getMoodColors from "@/lib/getMoodColors";

export default function BugReportPage() {
  const { currentMood } = useMood();
  const { addToast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    url: "",
  });

  useEffect(() => {
    // Get the current URL from referrer or current location
    if (typeof window !== "undefined") {
      setFormData((prev) => ({ ...prev, url: document.referrer || "" }));
    }
  }, []);

  const moodColors = getMoodColors(currentMood.id);

  const severityOptions = [
    {
      value: "low",
      label: "Low",
      emoji: "🐛",
      color: "text-green-600",
      description: "Minor issue, doesn't affect functionality",
    },
    {
      value: "medium",
      label: "Medium",
      emoji: "⚠️",
      color: "text-yellow-600",
      description: "Affects functionality but has workaround",
    },
    {
      value: "high",
      label: "High",
      emoji: "🚨",
      color: "text-orange-600",
      description: "Significantly impacts user experience",
    },
    {
      value: "critical",
      label: "Critical",
      emoji: "🔥",
      color: "text-red-600",
      description: "Breaks core functionality or security issue",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "title",
      "description",
      "stepsToReproduce",
      "expectedBehavior",
      "actualBehavior",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      addToast({
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        addToast({
          type: "success",
          title: "Bug Report Submitted!",
          message:
            "Thank you for helping us improve. We'll investigate this issue.",
        });
        setFormData({
          title: "",
          description: "",
          stepsToReproduce: "",
          expectedBehavior: "",
          actualBehavior: "",
          severity: "medium",
          url: "",
        });
      } else {
        throw new Error(data.error || "Failed to submit bug report");
      }
    } catch (error) {
      console.error("Bug report error:", error);
      addToast({
        type: "error",
        title: "Submission Failed",
        message:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} py-12`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className={`${moodColors.accent} p-4 rounded-full shadow-lg`}>
              <Bug className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Report a Bug
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Found something that&apos;s not working correctly? Help us fix it by
            providing detailed information about the issue.
          </p>
        </div>

        {/* Bug Report Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <p className="text-gray-600 dark:text-gray-300">
              The more details you provide, the faster we can fix the issue!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bug Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors`}
                placeholder="Brief description of the bug"
              />
            </div>

            {/* Severity */}
            <div>
              <label
                htmlFor="severity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Severity Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {severityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      formData.severity === option.value
                        ? `${moodColors.border} bg-purple-50 dark:bg-purple-900/20`
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={option.value}
                      checked={formData.severity === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className={`font-medium ${option.color}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bug Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors resize-vertical`}
                placeholder="Describe the bug in detail..."
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label
                htmlFor="stepsToReproduce"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Steps to Reproduce *
              </label>
              <textarea
                id="stepsToReproduce"
                name="stepsToReproduce"
                value={formData.stepsToReproduce}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors resize-vertical`}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Expected Behavior */}
              <div>
                <label
                  htmlFor="expectedBehavior"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Expected Behavior *
                </label>
                <textarea
                  id="expectedBehavior"
                  name="expectedBehavior"
                  value={formData.expectedBehavior}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors resize-vertical`}
                  placeholder="What should happen?"
                />
              </div>

              {/* Actual Behavior */}
              <div>
                <label
                  htmlFor="actualBehavior"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Actual Behavior *
                </label>
                <textarea
                  id="actualBehavior"
                  name="actualBehavior"
                  value={formData.actualBehavior}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors resize-vertical`}
                  placeholder="What actually happens?"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Page URL (Optional)
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors`}
                placeholder="https://example.com/page-where-bug-occurred"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${moodColors.accent} text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Bug Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Tips for Better Bug Reports
          </h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be as specific as possible in your descriptions</li>
            <li>• Include screenshots if they help explain the issue</li>
            <li>
              • Mention your browser and device if the issue seems related
            </li>
            <li>• Test if the bug happens consistently or just occasionally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
