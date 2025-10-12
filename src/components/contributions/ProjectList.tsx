import { FC } from "react";
import { ContributionProject } from "@/lib/types/contribution";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: ContributionProject[];
}

export const ProjectList: FC<ProjectListProps> = ({ projects }) => {
  if (!projects.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No contribution projects available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
