"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Target,
  BarChart3,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { MOODS } from "@/lib/moods";
import { useMood } from "@/components/providers/MoodProvider";
import { ProgressBadge } from "@/components/ProgressComponents";
import Card, { CardAction } from "@/components/ui/Card";
import PremiumModal from "@/components/ui/PremiumModal";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { usePremiumContentHandler } from "@/hooks/usePremiumContentHandler";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useTutorialProgress } from "@/hooks/useProgress";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

// Types for database quiz data
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  slug: string;
  questions: Question[];
  isPremium: boolean;
  requiredPlan: string;
}

interface QuizCardProps {
  quiz: Quiz;
  index: number;
  userMood: string;
  progress?: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    bestScore?: number;
    quizAttempts?: number;
  };
  // Premium content handler passed from parent
  premiumHandler: {
    handlePremiumContent: (
      content: {
        title: string;
        isPremium?: boolean;
        requiredPlan?: string;
        type: "tutorial" | "challenge" | "quiz";
      },
      onAccess: () => void
    ) => void;
  };
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  index,
  userMood,
  progress,
  premiumHandler,
}) => {
  const router = useRouter();
  const moodConfig = MOODS[userMood.toLowerCase()];

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  // Ensure questions is an array and filter based on mood difficulty
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const filteredQuestions = questions.filter((q) => {
    if (moodConfig.quizSettings.difficulty === "easy") {
      return q.difficulty === "easy";
    } else if (moodConfig.quizSettings.difficulty === "medium") {
      return q.difficulty === "easy" || q.difficulty === "medium";
    }
    return true; // hard mode includes all questions
  });

  const questionsToShow = filteredQuestions.slice(
    0,
    moodConfig.quizSettings.questionsPerTutorial
  );

  const estimatedTime = moodConfig.quizSettings.timeLimit || 10;

  const handleQuizClick = () => {
    premiumHandler.handlePremiumContent(
      {
        title: quiz.title,
        isPremium: quiz.isPremium,
        requiredPlan: quiz.requiredPlan,
        type: "quiz" as const,
      },
      () => {
        router.push(`/quiz/${quiz.slug}`);
      }
    );
  };

  return (
    <>
      <Card
        isPremium={quiz.isPremium}
        requiredPlan={quiz.requiredPlan as "VIBED" | "CRACKED"}
        onPremiumClick={() =>
          premiumHandler.handlePremiumContent(
            {
              title: quiz.title,
              isPremium: quiz.isPremium,
              requiredPlan: quiz.requiredPlan,
              type: "quiz" as const,
            },
            () => {}
          )
        }
        onClick={handleQuizClick}
        title={quiz.title}
        description={`${questionsToShow.length} questions`}
        actions={
          <div className="flex items-center justify-between w-full">
            <CardAction.TimeInfo time={`${estimatedTime} min`} />
            <CardAction.Primary onClick={handleQuizClick}>
              Start Quiz
            </CardAction.Primary>
          </div>
        }
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-12 min-w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {quiz.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {questionsToShow.length} questions
              </p>
            </div>
          </div>
          <div
            className={`text-pretty w-10 px-2 py-1 rounded-md text-xs font-medium ${
              difficultyColors[moodConfig.quizSettings.difficulty]
            }`}
          >
            <span>
              {moodConfig.quizSettings.difficulty.charAt(0).toUpperCase() +
                moodConfig.quizSettings.difficulty.slice(1)}{" "}
              Mode
            </span>
          </div>
        </div>

        {/* Progress Badge */}
        {progress && (
          <div className="mb-4">
            <ProgressBadge
              status={progress.status}
              score={progress.bestScore}
              attempts={progress.quizAttempts}
              type="tutorial"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 dark:text-gray-500">
                {moodConfig.emoji}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {moodConfig.name} Mode
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {moodConfig.quizSettings.difficulty === "easy"
                  ? "Beginner"
                  : moodConfig.quizSettings.difficulty === "medium"
                  ? "Intermediate"
                  : "Advanced"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Question Preview:
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {questionsToShow[0]?.question ||
                "No questions available for this difficulty level"}
            </p>
          </div>
        </div>
      </Card>
    </>
  );
};

export default function QuizzesPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const router = useRouter();

  // Use TanStack Query hooks
  const {
    data: quizzes = [],
    isLoading: loadingQuizzes,
    error: quizzesError,
    isError: hasQuizzesError,
    refetch: refetchQuizzes,
  } = useQuizzes();

  const { data: tutorialProgress = {}, isLoading: loadingProgress } =
    useTutorialProgress(session?.user?.id);

  // Pagination hook
  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData: paginatedQuizzes,
    goToPage,
    setPageSize,
  } = usePagination(quizzes, {
    initialPage: 1,
    initialPageSize: 9, // 3x3 grid
    totalItems: quizzes.length,
  });

  // Premium content handler at parent level
  const {
    handlePremiumContent,
    selectedPremiumContent,
    showPremiumModal,
    setShowPremiumModal,
  } = usePremiumContentHandler();

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to access quizzes.
          </p>
        </div>
      </div>
    );
  }

  // Handle quiz loading error
  if (hasQuizzesError) {
    return (
      <PageLayout
        title="JavaScript Quizzes"
        subtitle="Test your knowledge and track your progress"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading quizzes: {quizzesError?.message || "Unknown error"}
            </p>
            <button
              onClick={() => refetchQuizzes()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];

  return (
    <PageLayout
      title="JavaScript Quizzes"
      subtitle="Test your knowledge and track your progress"
    >
      {/* Progress Summary */}
      {!loadingProgress && (
        <div className="mb-6">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
            <BarChart3 className="w-4 h-4" />
            <span>Progress:</span>
            <span>
              {
                Object.values(tutorialProgress).filter(
                  (p) => p.status === "COMPLETED"
                ).length
              }{" "}
              completed
            </span>
            <span>•</span>
            <span>
              {
                Object.values(tutorialProgress).filter(
                  (p) => p.status === "IN_PROGRESS"
                ).length
              }{" "}
              in progress
            </span>
            <span>•</span>
            <span>
              {totalItems - Object.keys(tutorialProgress).length} not started
            </span>
            <span>•</span>
            <span className="font-medium">{totalItems} total quizzes</span>
          </div>
        </div>
      )}

      {/* Mood Info Card */}
      <MoodInfoCard showQuizSettings={true} className="mb-12" />

      {/* Quizzes Grid */}
      {loadingProgress || loadingQuizzes ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading quiz progress...
          </p>
        </div>
      ) : (
        <>
          <ContentGrid columns="3" className="mb-8">
            {paginatedQuizzes.map((quiz: Quiz, index: number) => {
              // Calculate the actual index based on current page
              const actualIndex = (currentPage - 1) * pageSize + index;
              // The tutorialId in progress matches the quiz ID from the route parameter
              const quizProgress = tutorialProgress[quiz.id.toString()];
              return (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  index={actualIndex}
                  userMood={currentMood.id}
                  progress={quizProgress}
                  premiumHandler={{ handlePremiumContent }}
                />
              );
            })}
          </ContentGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mb-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                onPageChange={goToPage}
                showInfo={true}
                showSizeSelector={true}
                sizeOptions={[6, 9, 12, 18]}
                onSizeChange={setPageSize}
                className="justify-center"
              />
            </div>
          )}
        </>
      )}

      {/* Footer Section */}
      <div className="text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Quiz Tips
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="text-left">
              <div className="flex items-center mb-1">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Current Mode:
                </span>
              </div>
              <div>
                {currentMoodConfig.quizSettings.difficulty === "easy"
                  ? "Focus on fundamental concepts and basic syntax"
                  : currentMoodConfig.quizSettings.difficulty === "medium"
                  ? "Mix of basic and intermediate concepts"
                  : "Challenging questions covering advanced topics"}
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center mb-1">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Time Management:
                </span>
              </div>
              <div>
                {currentMoodConfig.quizSettings.timeLimit
                  ? `You have ${currentMoodConfig.quizSettings.timeLimit} minutes per quiz`
                  : "Take your time - no pressure!"}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Link
              href="/tutorials"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Review tutorials before taking quizzes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {selectedPremiumContent && (
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          requiredPlan={
            selectedPremiumContent.requiredPlan as "VIBED" | "CRACKED"
          }
          contentType={selectedPremiumContent.type}
          contentTitle={selectedPremiumContent.title}
        />
      )}
    </PageLayout>
  );
}
