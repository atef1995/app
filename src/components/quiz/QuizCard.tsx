import { MOODS } from "@/lib/moods";
import Card, { CardAction } from "../ui/Card";
import { ProgressBadge } from "../ProgressComponents";
import { Target } from "lucide-react";
import { Quiz } from "@/app/quizzes/page";
import { useRouter } from "next/navigation";
import { devMode } from "@/lib/services/envService";
import { getMoodIcon } from "@/lib/getMoodIcon";

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
  isPremiumLocked: (content: {
    isPremium?: boolean;
    requiredPlan?: string;
  }) => boolean;
}
const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  index,
  userMood,
  progress,
  premiumHandler,
  isPremiumLocked,
}) => {
  const router = useRouter();
  const moodConfig = MOODS[userMood.toLowerCase()];
  const Icon = getMoodIcon(moodConfig.icon);

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  // Ensure questions is an array and filter based on mood difficulty
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

  if (devMode()) {
    console.log({ questions });

    console.log(moodConfig.quizSettings);
  }

  const questionsToShow = questions.slice(
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
  const isLocked = isPremiumLocked(quiz);

  return (
    <>
      <Card
        isPremium={isLocked}
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
              score={parseInt(progress.bestScore?.toPrecision(2) as string)}
              attempts={progress.quizAttempts}
              type="tutorial"
            />
          </div>
        )}

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 dark:text-gray-500">
                <Icon className="w-5 h-5" />
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

export default QuizCard;
