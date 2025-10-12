import { FC } from "react";
import Link from "next/link";
import { ContributionProject } from "@/lib/types/contribution";

interface ProjectHeaderProps {
  project: ContributionProject;
}

export const ProjectHeader: FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link
            href="/contributions"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full font-medium">
            {project.category}
          </span>
          {project.isPremium && (
            <span className="px-4 py-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full font-medium">
              Premium
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
        {project.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Difficulty
          </h3>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full mx-0.5 ${
                  i < project.difficulty
                    ? "bg-yellow-400"
                    : "bg-gray-200 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Estimated Time
          </h3>
          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            {project.estimatedHours} hours
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total XP
          </h3>
          <p className="mt-1 text-lg font-medium text-green-600 dark:text-green-400">
            {project.xpReward} XP
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Submissions
          </h3>
          <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            {project.totalSubmissions || 0}
          </p>
        </div>
      </div>

      {project.githubRepoUrl && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href={project.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </div>
      )}
    </div>
  );
};
