import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight,
  Layers,
  Zap,
  Globe,
  Cpu
} from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";

interface CategoryCardProps {
  category: string;
  tutorialCount: number;
  completedCount?: number;
  totalDuration?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  topics?: string[];
  onClick: () => void;
  className?: string;
}

const categoryIcons = {
  fundamentals: <Layers className="w-8 h-8" />,
  oop: <Users className="w-8 h-8" />,
  async: <Zap className="w-8 h-8" />,
  dom: <Globe className="w-8 h-8" />,
  advanced: <Cpu className="w-8 h-8" />,
} as const;

const difficultyStyles = {
  beginner: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    accent: "bg-green-500",
    text: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
  },
  intermediate: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    accent: "bg-yellow-500",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: "text-yellow-600 dark:text-yellow-400",
  },
  advanced: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    accent: "bg-red-500",
    text: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400",
  },
};

export default function CategoryCard({
  category,
  tutorialCount,
  completedCount = 0,
  totalDuration,
  difficulty,
  description,
  topics = [],
  onClick,
  className = "",
}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentMood } = useMood();
  const styles = difficultyStyles[difficulty];
  const progressPercentage = tutorialCount > 0 ? (completedCount / tutorialCount) * 100 : 0;

  // Get category icon or fallback
  const categoryIcon = categoryIcons[category as keyof typeof categoryIcons] || 
                      <BookOpen className="w-8 h-8" />;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
        ${styles.bg} ${styles.border}
        hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <div 
          className={`h-full ${styles.accent} transition-all duration-500`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${styles.icon} flex-shrink-0`}>
              {categoryIcon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <p className={`text-sm font-medium capitalize ${styles.text}`}>
                {difficulty} Level
              </p>
            </div>
          </div>
          
          <ChevronRight 
            className={`
              w-5 h-5 text-gray-400 transition-transform duration-300
              ${isHovered ? 'translate-x-1' : ''}
            `} 
          />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tutorials</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {tutorialCount}
              </p>
            </div>
          </div>
          
          {totalDuration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {totalDuration}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        {completedCount > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {completedCount}/{tutorialCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${styles.accent} transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Topics */}
        {topics.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Key Topics:
            </p>
            <div className="flex flex-wrap gap-1">
              {topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md font-medium border border-gray-200 dark:border-gray-600"
                >
                  {topic}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mood-specific enhancement */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="text-lg">{currentMood.emoji}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Optimized for {currentMood.name.toLowerCase()} mode
            </p>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br from-white/10 to-transparent 
          transition-opacity duration-300 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `} 
      />
    </div>
  );
}