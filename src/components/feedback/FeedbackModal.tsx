"use client";

import { useState, useEffect } from "react";
import {
  X,
  Check,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import { getMoodIcon } from "@/lib/getMoodIcon";
import {
  FeedbackFormData,
  FeedbackRating,
  IMPROVEMENT_AREAS,
  POSITIVE_ASPECTS,
  QUICK_TAGS,
  type FeedbackDifficulty,
} from "@/types/feedback";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialId: string;
  tutorialTitle: string;
  quizId?: string;
  onSubmit: (data: FeedbackFormData) => Promise<void>;
}

const RATING_EMOJIS: Record<FeedbackRating, { emoji: string; label: string }> =
  {
    1: { emoji: "😞", label: "Poor" },
    2: { emoji: "😐", label: "Fair" },
    3: { emoji: "😊", label: "Good" },
    4: { emoji: "😃", label: "Great" },
    5: { emoji: "😍", label: "Excellent" },
  };

export function FeedbackModal({
  isOpen,
  onClose,
  tutorialId,
  tutorialTitle,
  quizId,
  onSubmit,
}: FeedbackModalProps) {
  const { currentMood } = useMood();
  const moodConfig = MOODS[currentMood.id.toLowerCase()];
  const Icon = getMoodIcon(moodConfig.icon);

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: null,
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ rating: null });
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isSubmitting, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleRatingSelect = (rating: FeedbackRating) => {
    setFormData({ ...formData, rating });
    // Automatically move to next step after selection
    setTimeout(() => setStep(2), 300);
  };

  const handleImprovementToggle = (area: string) => {
    const current = formData.improvementAreas || [];
    const updated = current.includes(area)
      ? current.filter((a) => a !== area)
      : [...current, area];
    setFormData({ ...formData, improvementAreas: updated });
  };

  const handlePositiveToggle = (aspect: string) => {
    const current = formData.positiveAspects || [];
    const updated = current.includes(aspect)
      ? current.filter((a) => a !== aspect)
      : [...current, aspect];
    setFormData({ ...formData, positiveAspects: updated });
  };

  const handleTagToggle = (tag: string) => {
    const current = formData.tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setFormData({ ...formData, tags: updated });
  };

  const handleSubmit = async () => {
    if (!formData.rating) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setStep(4); // Show thank you step
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedFromStep2 = () => {
    if (!formData.rating) return false;
    if (formData.rating <= 2) {
      return (formData.improvementAreas?.length || 0) > 0;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-2xl max-w-md w-full md:mr-4 md:mb-4 overflow-hidden animate-slide-up md:animate-fade-in"
        style={{
          maxHeight: "90vh",
          borderColor: moodConfig.theme.primary,
          borderWidth: "2px",
          borderBottomWidth: 0,
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700"
          style={{ backgroundColor: moodConfig.theme.background }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon className="w-6 h-6" />
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: moodConfig.theme.text }}
                >
                  Help Us Improve
                </h3>
                <p
                  className="text-sm opacity-80"
                  style={{ color: moodConfig.theme.text }}
                >
                  {tutorialTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              aria-label="Close feedback modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-1 mt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor:
                    step >= s ? moodConfig.theme.primary : "rgba(0,0,0,0.1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          {/* Step 1: Rating */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  How was this tutorial?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your honest feedback helps us create better content
                </p>
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                {([1, 2, 3, 4, 5] as FeedbackRating[]).map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingSelect(rating)}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      formData.rating === rating
                        ? "ring-2 shadow-lg"
                        : "hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    style={{
                      borderColor:
                        formData.rating === rating
                          ? moodConfig.theme.primary
                          : "#e5e7eb",
                      backgroundColor:
                        formData.rating === rating
                          ? `${moodConfig.theme.primary}10`
                          : "transparent",
                    }}
                  >
                    <span className="text-4xl mb-1">
                      {RATING_EMOJIS[rating].emoji}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {RATING_EMOJIS[rating].label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Follow-up questions */}
          {step === 2 && formData.rating && (
            <div className="space-y-4 animate-fade-in">
              {/* Low ratings: Improvement areas */}
              {formData.rating <= 2 && (
                <>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      What made this difficult?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select all that apply
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {IMPROVEMENT_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => handleImprovementToggle(area.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.improvementAreas?.includes(area.id)
                            ? "ring-2 shadow-md"
                            : "hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        style={{
                          borderColor: formData.improvementAreas?.includes(
                            area.id
                          )
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                          backgroundColor: formData.improvementAreas?.includes(
                            area.id
                          )
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {area.emoji && <span>{area.emoji}</span>}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {area.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Medium ratings: General question */}
              {formData.rating === 3 && (
                <>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      How can we improve?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select areas for improvement
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {IMPROVEMENT_AREAS.slice(4).map((area) => (
                      <button
                        key={area.id}
                        onClick={() => handleImprovementToggle(area.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.improvementAreas?.includes(area.id)
                            ? "ring-2 shadow-md"
                            : "hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        style={{
                          borderColor: formData.improvementAreas?.includes(
                            area.id
                          )
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                          backgroundColor: formData.improvementAreas?.includes(
                            area.id
                          )
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {area.emoji && <span>{area.emoji}</span>}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {area.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* High ratings: What they loved */}
              {formData.rating >= 4 && (
                <>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      What did you love? ❤️
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select all that apply
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {POSITIVE_ASPECTS.map((aspect) => (
                      <button
                        key={aspect.id}
                        onClick={() => handlePositiveToggle(aspect.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.positiveAspects?.includes(aspect.id)
                            ? "ring-2 shadow-md"
                            : "hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        style={{
                          borderColor: formData.positiveAspects?.includes(
                            aspect.id
                          )
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                          backgroundColor: formData.positiveAspects?.includes(
                            aspect.id
                          )
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {aspect.emoji && <span>{aspect.emoji}</span>}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {aspect.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Quiz feedback (if quiz exists) */}
              {quizId && formData.rating >= 3 && (
                <div className="mt-4">
                  <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Was the quiz helpful?
                  </h5>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFormData({ ...formData, quizHelpful: true })
                      }
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.quizHelpful === true ? "ring-2" : ""
                      }`}
                      style={{
                        borderColor:
                          formData.quizHelpful === true
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                        backgroundColor:
                          formData.quizHelpful === true
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                      }}
                    >
                      <ThumbsUp className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">Yes</span>
                    </button>
                    <button
                      onClick={() =>
                        setFormData({ ...formData, quizHelpful: false })
                      }
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.quizHelpful === false ? "ring-2" : ""
                      }`}
                      style={{
                        borderColor:
                          formData.quizHelpful === false
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                        backgroundColor:
                          formData.quizHelpful === false
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                      }}
                    >
                      <ThumbsDown className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">No</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Difficulty rating */}
              <div className="mt-4">
                <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Difficulty level?
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      "too-easy",
                      "just-right",
                      "too-hard",
                    ] as FeedbackDifficulty[]
                  ).map((diff) => (
                    <button
                      key={diff}
                      onClick={() =>
                        setFormData({ ...formData, difficulty: diff })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.difficulty === diff ? "ring-2" : ""
                      }`}
                      style={{
                        borderColor:
                          formData.difficulty === diff
                            ? moodConfig.theme.primary
                            : "#e5e7eb",
                        backgroundColor:
                          formData.difficulty === diff
                            ? `${moodConfig.theme.primary}10`
                            : "transparent",
                      }}
                    >
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {diff.replace("-", " ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedFromStep2() || isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 transition-all"
                  style={{ backgroundColor: moodConfig.theme.primary }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Optional text feedback */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Any suggestions?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optional - Your detailed feedback helps us improve
                </p>
              </div>

              <textarea
                value={formData.feedback || ""}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                placeholder="Share your thoughts, suggestions, or what could be better..."
                className="w-full p-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:outline-none"
                style={{ borderColor: moodConfig.theme.primary }}
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {formData.feedback?.length || 0}/500 characters
              </div>

              {/* Quick tags */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Quick tags (optional)
                </h5>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm border-2 transition-all ${
                        formData.tags?.includes(tag.id) ? "ring-1" : ""
                      }`}
                      style={{
                        borderColor: formData.tags?.includes(tag.id)
                          ? moodConfig.theme.primary
                          : "#e5e7eb",
                        backgroundColor: formData.tags?.includes(tag.id)
                          ? `${moodConfig.theme.primary}20`
                          : "transparent",
                        color: formData.tags?.includes(tag.id)
                          ? moodConfig.theme.primary
                          : undefined,
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                  style={{ backgroundColor: moodConfig.theme.primary }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Thank you */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in text-center py-6">
              <div className="flex justify-center">
                <Sparkles
                  className="w-16 h-16"
                  style={{ color: moodConfig.theme.primary }}
                />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Thank You! 🎉
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Your feedback helps us create better learning experiences
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${moodConfig.theme.primary}10` }}
              >
                <p
                  className="text-sm"
                  style={{ color: moodConfig.theme.primary }}
                >
                  <strong>+10 XP</strong> for helping improve our content!
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: moodConfig.theme.primary }}
              >
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
