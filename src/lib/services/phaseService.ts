import { prisma } from "@/lib/prisma";
import {
  Phase,
  PhaseStep,
  Tutorial,
  Quiz,
  Challenge,
  Project,
  Category,
} from "@prisma/client";

// Extended types for phases with their content
export type PhaseWithSteps = Phase & {
  phaseSteps: (PhaseStep & {
    tutorial?: (Tutorial & { category?: Category }) | null;
    challenge?: Challenge | null;
    project?: Project | null;
    quiz?: (Quiz & { tutorial?: Tutorial }) | null;
  })[];
};

export type ContentItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  difficulty: number | string;
  estimatedTime?: number; // for tutorials
  estimatedHours?: number; // for projects
  isPremium: boolean;
  requiredPlan: string;
  category?: string;
};

/**
 * Service for managing learning phases from database
 */
export class PhaseService {
  /**
   * Get all published phases with their steps and content
   */
  static async getAllPhases(): Promise<PhaseWithSteps[]> {
    try {
      const phases = await prisma.phase.findMany({
        where: { published: true },
        include: {
          phaseSteps: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      });

      // Fetch content for each phase step
      const phasesWithContent = await Promise.all(
        phases.map(async (phase) => {
          const stepsWithContent = await Promise.all(
            phase.phaseSteps.map(async (step) => {
              let content = null;

              switch (step.contentType) {
                case "tutorial":
                  content = await prisma.tutorial.findUnique({
                    where: { id: step.contentId },
                    include: {
                      category: true,
                    },
                  });
                  return { ...step, tutorial: content };

                case "challenge":
                  content = await prisma.challenge.findUnique({
                    where: { id: step.contentId },
                  });
                  return { ...step, challenge: content };

                case "project":
                  content = await prisma.project.findUnique({
                    where: { id: step.contentId },
                  });
                  return { ...step, project: content };

                case "quiz":
                  content = await prisma.quiz.findUnique({
                    where: { id: step.contentId },
                    include: { tutorial: true },
                  });
                  return { ...step, quiz: content };

                default:
                  return step;
              }
            })
          );

          return {
            ...phase,
            phaseSteps: stepsWithContent,
          };
        })
      );

      return phasesWithContent;
    } catch (error) {
      console.error("Error fetching phases:", error);
      throw new Error("Failed to fetch phases");
    }
  }

  /**
   * Get a specific phase by slug with its content
   */
  static async getPhaseBySlug(slug: string): Promise<PhaseWithSteps | null> {
    try {
      const phase = await prisma.phase.findUnique({
        where: { slug, published: true },
        include: {
          phaseSteps: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!phase) return null;

      // Fetch content for each phase step
      const stepsWithContent = await Promise.all(
        phase.phaseSteps.map(async (step) => {
          let content = null;

          switch (step.contentType) {
            case "tutorial":
              content = await prisma.tutorial.findUnique({
                where: { id: step.contentId },
                include: {
                  category: true,
                },
              });
              return { ...step, tutorial: content };

            case "challenge":
              content = await prisma.challenge.findUnique({
                where: { id: step.contentId },
              });
              return { ...step, challenge: content };

            case "project":
              content = await prisma.project.findUnique({
                where: { id: step.contentId },
              });
              return { ...step, project: content };

            case "quiz":
              content = await prisma.quiz.findUnique({
                where: { id: step.contentId },
                include: { tutorial: true },
              });
              return { ...step, quiz: content };

            default:
              return step;
          }
        })
      );

      return {
        ...phase,
        phaseSteps: stepsWithContent,
      };
    } catch (error) {
      console.error(`Error fetching phase ${slug}:`, error);
      return null;
    }
  }

  /**
   * Get phase prerequisites - phases that must be completed first
   */
  static async getPhasePrerequisites(phaseSlug: string): Promise<Phase[]> {
    try {
      const phase = await prisma.phase.findUnique({
        where: { slug: phaseSlug },
      });

      if (!phase || !phase.prerequisites.length) {
        return [];
      }

      const prerequisites = await prisma.phase.findMany({
        where: {
          slug: { in: phase.prerequisites },
          published: true,
        },
        orderBy: { order: "asc" },
      });

      return prerequisites;
    } catch (error) {
      console.error(
        `Error fetching prerequisites for phase ${phaseSlug}:`,
        error
      );
      return [];
    }
  }

  /**
   * Check if user can access a phase based on completed prerequisites
   */
  static async canUserAccessPhase(
    userId: string,
    phaseSlug: string,
    completedPhases: string[]
  ): Promise<boolean> {
    try {
      const prerequisites = await this.getPhasePrerequisites(phaseSlug);

      // Check if all prerequisite phases are completed
      return prerequisites.every((prereq) =>
        completedPhases.includes(prereq.slug)
      );
    } catch (error) {
      console.error(`Error checking phase access for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Get content item details for a phase step
   */
  static getContentFromStep(
    step: PhaseWithSteps["phaseSteps"][0]
  ): ContentItem | null {
    switch (step.contentType) {
      case "tutorial":
        if (!step.tutorial) return null;
        return {
          id: step.tutorial.id,
          slug: step.tutorial.slug,
          title: step.tutorial.title,
          description: step.tutorial.description,
          difficulty: step.tutorial.difficulty,
          estimatedTime: step.tutorial.estimatedTime,
          isPremium: step.tutorial.isPremium,
          requiredPlan: step.tutorial.requiredPlan,
          category: step.tutorial.category?.slug,
        };

      case "challenge":
        if (!step.challenge) return null;
        return {
          id: step.challenge.id,
          slug: step.challenge.slug,
          title: step.challenge.title,
          description: step.challenge.description,
          difficulty: step.challenge.difficulty,
          isPremium: step.challenge.isPremium,
          requiredPlan: step.challenge.requiredPlan,
        };

      case "project":
        if (!step.project) return null;
        return {
          id: step.project.id,
          slug: step.project.slug,
          title: step.project.title,
          description: step.project.description,
          difficulty: step.project.difficulty,
          estimatedHours: step.project.estimatedHours,
          isPremium: step.project.isPremium,
          requiredPlan: step.project.requiredPlan,
          category: step.project.category,
        };

      case "quiz":
        if (!step.quiz) return null;
        return {
          id: step.quiz.id,
          slug: step.quiz.slug,
          title: step.quiz.title,
          description: `Test your understanding of ${
            step.quiz.tutorial?.title || "concepts"
          }`,
          difficulty: step.quiz.tutorial?.difficulty || 1,
          isPremium: step.quiz.isPremium,
          requiredPlan: step.quiz.requiredPlan,
        };

      default:
        return null;
    }
  }

  /**
   * Calculate total hours for a phase
   */
  static calculatePhaseHours(phase: PhaseWithSteps): number {
    return phase.phaseSteps.reduce((total, step) => {
      return total + step.estimatedHours;
    }, 0);
  }

  /**
   * Get next available phase for user
   */
  static async getNextAvailablePhase(
    userId: string,
    completedPhases: string[]
  ): Promise<Phase | null> {
    try {
      const allPhases = await prisma.phase.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });

      for (const phase of allPhases) {
        if (!completedPhases.includes(phase.slug)) {
          const canAccess = await this.canUserAccessPhase(
            userId,
            phase.slug,
            completedPhases
          );

          if (canAccess) {
            return phase;
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`Error finding next phase for user ${userId}:`, error);
      return null;
    }
  }
}
