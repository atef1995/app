import { FC } from "react";
import Link from "next/link";
import { ContributionProject } from "@/lib/types/contribution";

interface ProjectCardProps {
  project: ContributionProject;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium rounded-full">
            {project.category}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Difficulty:
            </span>
            <div className="ml-2 flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full mx-0.5 ${
                    i < project.difficulty
                      ? "bg-yellow-400"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              XP Reward:
            </span>
            <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
              {project.xpReward}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Est. Time:
            </span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {project.estimatedHours}h
            </span>
          </div>
          <Link
            href={`/contributions/projects/${project.slug}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
