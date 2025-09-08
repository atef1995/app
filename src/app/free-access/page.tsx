"use client";

import { useState, useEffect } from "react";
import { Send, Heart, Shield, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { useToast } from "@/hooks/useToast";
import getMoodColors from "@/lib/getMoodColors";

export default function FreeAccessPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const { success, error, warning } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    age: "",
    occupation: "",
    experience: "",
    reason: "",
    goals: "",
    timeCommitment: "",
    hasTriedOtherPlatforms: "",
    financialSituation: "",
    howFoundUs: "",
  });

  // Prefill user data if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const moodColors = getMoodColors(currentMood.id);

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

    // Basic validation
    const requiredFields = ["name", "email", "country", "reason", "goals"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      warning(
        "Missing Required Fields",
        "Please fill in all required fields before submitting."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/free-access-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        success(
          "Request Submitted! 🎉",
          "Thank you for your request. We'll review it personally and get back to you within 48 hours."
        );

        // Reset form but preserve user info if logged in
        setFormData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          country: "",
          age: "",
          occupation: "",
          experience: "",
          reason: "",
          goals: "",
          timeCommitment: "",
          hasTriedOtherPlatforms: "",
          financialSituation: "",
          howFoundUs: "",
        });
      } else {
        // Handle specific error messages from the API
        if (response.status === 429) {
          error(
            "Request Limit Reached",
            data.error ||
              "You can only submit one request per day. Please try again later."
          );
        } else if (response.status === 400) {
          warning(
            "Invalid Request",
            data.error || "Please check your information and try again."
          );
        } else {
          throw new Error(data.error || "Failed to submit request");
        }
      }
    } catch (err) {
      console.error("Free access request error:", err);
      error(
        "Submission Failed",
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again later."
      );
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
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Request Free Access
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            We believe everyone should have access to quality programming
            education. If you can&apos;t afford our premium plans, we&apos;d
            love to help you learn for free!
          </p>

          {/* Logged in user notice */}
          {session?.user && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-3xl mx-auto mb-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    <strong>
                      Welcome back,{" "}
                      {session.user.name?.split(" ")[0] || "friend"}!
                    </strong>{" "}
                    We&apos;ve prefilled your name and email to save you time.
                    Complete the rest of the form to submit your free access
                    request.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Please be honest and detailed.</strong> We review each
                  request personally and want to help those who genuinely need
                  it. Abuse of this system may result in permanent account
                  restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Country/Region *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Your country or region"
                  />
                </div>

                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Age (Optional)
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="13"
                    max="100"
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Your age"
                  />
                </div>

                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Current Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Student, Unemployed, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Programming Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  >
                    <option value="">Select your level</option>
                    <option value="complete-beginner">Complete beginner</option>
                    <option value="some-basics">Know some basics</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">
                      Advanced (looking to specialize)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Request Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Why are you requesting free access? *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical`}
                    placeholder="Please explain your financial situation and why you need free access to our platform..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="goals"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    What are your learning goals? *
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical`}
                    placeholder="What do you hope to achieve by learning JavaScript? Career change, personal project, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="timeCommitment"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Time Commitment
                  </label>
                  <select
                    id="timeCommitment"
                    name="timeCommitment"
                    value={formData.timeCommitment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  >
                    <option value="">How much time can you dedicate?</option>
                    <option value="1-2-hours-week">1-2 hours per week</option>
                    <option value="3-5-hours-week">3-5 hours per week</option>
                    <option value="6-10-hours-week">6-10 hours per week</option>
                    <option value="more-than-10-hours-week">
                      More than 10 hours per week
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hasTriedOtherPlatforms"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Have you tried other learning platforms?
                  </label>
                  <textarea
                    id="hasTriedOtherPlatforms"
                    name="hasTriedOtherPlatforms"
                    value={formData.hasTriedOtherPlatforms}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical`}
                    placeholder="Which other platforms have you used? What didn't work for you?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="financialSituation"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Financial Situation (Optional but helps us understand)
                  </label>
                  <textarea
                    id="financialSituation"
                    name="financialSituation"
                    value={formData.financialSituation}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical`}
                    placeholder="Feel free to share more about your financial situation - this helps us prioritize requests..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="howFoundUs"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    How did you find Vibed to Cracked?
                  </label>
                  <input
                    type="text"
                    id="howFoundUs"
                    name="howFoundUs"
                    value={formData.howFoundUs}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${moodColors.border} rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    placeholder="Google, friend recommendation, social media, etc."
                  />
                </div>
              </div>
            </div>

            {/* Anti-abuse Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Anti-Abuse Protection
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    This request is monitored for abuse prevention. We collect
                    your IP address and browser information to prevent multiple
                    submissions. Only one request per person is allowed.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${moodColors.accent} text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Free Access Request
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              We review all requests personally and aim to respond within 48
              hours.
              <br />
              Approval is based on genuine need and commitment to learning.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
