"use client";

import { useState, useEffect, useCallback } from "react";
import { useToastContext } from "@/components/providers/ToastProvider";
import { submitQuizAction } from "@/lib/actions";
import {
  Quiz,
  QuizState,
  UnlockedAchievement,
  TutorialNavigation,
  Question,
} from "@/types/quiz";
import { MOODS } from "@/lib/moods";
import { devMode } from "@/lib/services/envService";

const debugMode = devMode();

// Fisher-Yates shuffle algorithm for randomizing array order
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface UseQuizProps {
  slug: string;
  currentMoodId: string;
}

export function useQuiz({ slug, currentMoodId }: UseQuizProps) {
  const toast = useToastContext();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [tutorialNavigation, setTutorialNavigation] =
    useState<TutorialNavigation | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    startTime: Date.now(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/slug/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data.quiz);

          if (data.quiz?.tutorialId) {
            const navResponse = await fetch(
              `/api/tutorials/navigation?tutorialId=${data.quiz.tutorialId}`
            );
            if (navResponse.ok) {
              const navData = await navResponse.json();
              if (navData.success) {
                setTutorialNavigation(navData.data);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, [slug]);

  // Shuffle questions when quiz loads or mood changes
  useEffect(() => {
    if (!quiz) return;

    const currentMoodConfig = MOODS[currentMoodId.toLowerCase()];
    const filteredQuestions = quiz.questions.filter((q) => {
      // If questions don't have difficulty property, include all questions
      if (!q.difficulty) return true;

      if (currentMoodConfig.quizSettings.difficulty === "easy") {
        return q.difficulty === "easy";
      } else if (currentMoodConfig.quizSettings.difficulty === "medium") {
        return q.difficulty === "easy" || q.difficulty === "medium";
      }
      return true;
    });

    const shuffled = shuffleArray(filteredQuestions);
    const questionsToShow = shuffled.slice(
      0,
      currentMoodConfig.quizSettings.questionsPerTutorial
    );

    setShuffledQuestions(questionsToShow);

    // Reset quiz state when questions change
    setQuizState({
      currentQuestion: 0,
      answers: [],
      showResults: false,
      startTime: Date.now(),
    });
  }, [quiz, currentMoodId]);

  const calculateScore = useCallback(() => {
    if (!shuffledQuestions.length) return { correct: 0, total: 0 };

    let correct = 0;
    quizState.answers.forEach((answer, index) => {
      if (
        shuffledQuestions[index] &&
        answer === shuffledQuestions[index].correct
      ) {
        correct++;
      }
    });
    return { correct, total: shuffledQuestions.length };
  }, [shuffledQuestions, quizState.answers]);

  const handleQuizComplete = useCallback(async () => {
    if (!quiz || !shuffledQuestions.length) return;

    const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitQuizAction(
        quiz.tutorialId,
        quizState.answers,
        timeTaken,
        {
          questions: quiz.questions,
          passingScore: 70,
          uiQuestions: shuffledQuestions,
        }
      );

      if (result.success) {
        if (debugMode) {
          console.log("Quiz submitted successfully:", result);
        }
        toast.success(
          "Quiz submitted successfully!",
          `Score: ${result.score.toPrecision(4)}% - ${
            result.passed ? "Passed!" : "Try again for 70%+"
          }`
        );

        if (result.achievements && result.achievements.length > 0) {
          result.achievements.forEach((achievement: UnlockedAchievement) => {
            toast.achievement(
              `🏆 Achievement Unlocked!`,
              `${achievement.achievement.icon} ${achievement.achievement.title} - ${achievement.achievement.description}`
            );
          });
        }

        setQuizState((prev) => ({
          ...prev,
          showResults: true,
          submissionResult: {
            passed: result.passed,
            score: result.score,
            status: result.passed ? "COMPLETED" : "IN_PROGRESS",
          },
        }));
        return;
      } else {
        const errorMsg = result.error || "Failed to submit quiz";
        console.error("Failed to submit quiz:", errorMsg);
        setSubmitError(errorMsg);
        toast.error("Quiz Submission Failed", errorMsg);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSubmitError(errorMsg);
      toast.error("Quiz Submission Error", errorMsg);
    } finally {
      setSubmitting(false);
    }

    if (!submitError) {
      setQuizState((prev) => ({
        ...prev,
        showResults: true,
      }));
    }
  }, [
    quiz,
    shuffledQuestions,
    quizState.startTime,
    quizState.answers,
    toast,
    submitError,
  ]);

  const handleAnswerSelect = useCallback(
    (answerIndex: number) => {
      const newAnswers = [...quizState.answers];
      newAnswers[quizState.currentQuestion] = answerIndex;
      setQuizState((prev) => ({ ...prev, answers: newAnswers }));
    },
    [quizState.answers, quizState.currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (quizState.currentQuestion < shuffledQuestions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      handleQuizComplete();
    }
  }, [shuffledQuestions.length, quizState.currentQuestion, handleQuizComplete]);

  const handlePreviousQuestion = useCallback(() => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  }, []);

  return {
    quiz,
    loadingQuiz,
    tutorialNavigation,
    quizState,
    setQuizState,
    submitting,
    submitError,
    shuffledQuestions,
    calculateScore,
    handleQuizComplete,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
  };
}
