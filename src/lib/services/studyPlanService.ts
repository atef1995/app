import { prisma } from "@/lib/prisma";
import { CompletionStatus } from "@/lib/progressService";
import { PhaseService, PhaseWithSteps } from "@/lib/services/phaseService";
import { SkillService } from "@/lib/services/skillService";
import { IdService } from "@/lib/services/idService";
import { Skill, PhaseStep } from "@prisma/client";

// Updated types to work with Phase schema

// Type for phase steps used in ID service
type PhaseStepForIdService = Pick<
  PhaseStep,
  "id" | "contentType" | "contentSlug"
>;

export interface DynamicStudyPlanStep {
  id: string; // Format: "step-{phaseStepId}"
  phaseStepId: string; // Actual PhaseStep ID
  title: string;
  description: string | null;
  type: "tutorial" | "challenge" | "quiz" | "project";
  resourceId: string; // Content ID
  slug: string;
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category?: string;
  prerequisites: string[]; // Array of step IDs that must be completed first
  skills: string[];
  isOptional: boolean;
  order: number;
  isPremium: boolean;
  requiredPlan: string;
}

export interface DynamicStudyPlanPhase {
  id: string; // Actual Phase ID from database
  slug: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  estimatedWeeks: number;
  prerequisites: string[]; // Array of phase slugs that must be completed first
  steps: DynamicStudyPlanStep[];
  projects: DynamicStudyPlanStep[];
}

export interface DynamicStudyPlan {
  id: string;
  language: string;
  title: string;
  description: string;
  totalHours: number;
  totalWeeks: number;
  skillLevel:
    | "beginner-to-expert"
    | "intermediate-to-expert"
    | "advanced-to-expert";
  phases: DynamicStudyPlanPhase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyPlanProgress {
  userId: string;
  studyPlanId: string;
  currentPhaseId: string;
  currentStepId: string;
  completedSteps: string[];
  completedPhases: string[];
  totalProgressPercentage: number;
  hoursSpent: number;
  startedAt: Date;
  estimatedCompletionDate: Date;
  lastActivityAt: Date;
}

/**
 * Service for dynamically generating study plans from database content
 */
export class StudyPlanService {
  /**
   * Get dynamic study plan for web development from database phases
   */
  static async getWebDevelopmentStudyPlan(): Promise<DynamicStudyPlan> {
    try {
      // Fetch all phases with their content from database
      const phasesWithContent = await PhaseService.getAllPhases();

      // Pre-fetch skills for optimization
      const allSkills = await SkillService.getAllSkills();

      // Convert database phases to study plan format
      const phases = await Promise.all(
        phasesWithContent.map((phase) =>
          this.convertPhaseToStudyPlanPhase(phase, allSkills, phasesWithContent)
        )
      );

      // Calculate total hours
      const totalHours = phases.reduce(
        (sum, phase) =>
          sum +
          phase.steps.reduce(
            (stepSum, step) => stepSum + step.estimatedHours,
            0
          ) +
          phase.projects.reduce(
            (projectSum, project) => projectSum + project.estimatedHours,
            0
          ),
        0
      );

      return {
        id: "web-development-database-driven",
        language: "web-development",
        title: "Web Development: Zero to Expert",
        description:
          "A comprehensive journey from HTML foundations to expert full-stack web developer, covering web fundamentals, modern syntax, advanced concepts, and real-world applications.",
        totalHours,
        totalWeeks: Math.ceil(totalHours / 8), // Assuming 8 hours per week
        skillLevel: "beginner-to-expert",
        phases,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error generating study plan from database:", error);
      throw new Error("Failed to generate study plan");
    }
  }

  /**
   * Convert database phase with content to study plan phase format
   */
  private static async convertPhaseToStudyPlanPhase(
    phase: PhaseWithSteps,
    allSkills: Skill[],
    allPhases?: PhaseWithSteps[]
  ): Promise<DynamicStudyPlanPhase> {
    const steps: DynamicStudyPlanStep[] = [];
    const projects: DynamicStudyPlanStep[] = [];

    // Process each phase step
    for (const phaseStep of phase.phaseSteps) {
      const content = PhaseService.getContentFromStep(phaseStep);

      if (!content) continue;

      // Use IdService for consistent step ID creation
      const stepId = IdService.createStepId(phaseStep.id);

      // Get all phase steps for prerequisite resolution
      const allPhaseSteps: PhaseStepForIdService[] = allPhases
        ? allPhases.flatMap((p) =>
            p.phaseSteps.map((ps) => ({
              id: ps.id,
              contentType: ps.contentType,
              contentSlug: ps.contentSlug,
            }))
          )
        : [
            {
              id: phaseStep.id,
              contentType: phaseStep.contentType,
              contentSlug: phaseStep.contentSlug,
            },
          ];

      const stepData: DynamicStudyPlanStep = {
        id: stepId,
        phaseStepId: phaseStep.id,
        title: content.title,
        description: content.description,
        type: phaseStep.contentType as
          | "tutorial"
          | "challenge"
          | "quiz"
          | "project",
        resourceId: content.id,
        slug: content.slug,
        estimatedHours: phaseStep.estimatedHours,
        difficulty: this.mapDifficulty(content.difficulty),
        category: content.category,
        // Use IdService for consistent prerequisite handling
        prerequisites: await IdService.normalizePrerequisites(
          phaseStep.prerequisites,
          allPhaseSteps
        ),
        skills: this.extractSkillsFromContent(
          content.title,
          content.description,
          content.category,
          allSkills
        ),
        isOptional: phaseStep.isOptional,
        order: phaseStep.order,
        isPremium: content.isPremium,
        requiredPlan: content.requiredPlan,
      };

      // Validate step data in development
      if (process.env.NODE_ENV === "development") {
        this.validateStepData(stepData);
      }

      // Separate projects from regular steps
      if (phaseStep.contentType === "project") {
        projects.push(stepData);
      } else {
        steps.push(stepData);
      }
    }

    // Sort steps and projects by order, then by type to ensure quizzes come after tutorials
    const sortedSteps = steps.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      // If same order, tutorials come before quizzes
      const typeOrder: Record<string, number> = {
        tutorial: 1,
        quiz: 2,
        challenge: 3,
        project: 4,
      };
      return (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
    });

    const sortedProjects = projects.sort((a, b) => a.order - b.order);

    return {
      id: phase.id,
      slug: phase.slug,
      title: phase.title,
      description: phase.description,
      color: phase.color,
      icon: phase.icon,
      estimatedWeeks: phase.estimatedWeeks,
      prerequisites: phase.prerequisites,
      steps: sortedSteps,
      projects: sortedProjects,
    };
  }

  /**
   * Map numeric difficulty to string
   */
  private static mapDifficulty(
    difficulty: number | string
  ): "beginner" | "intermediate" | "advanced" {
    if (typeof difficulty === "string") {
      return difficulty.toLowerCase() as
        | "beginner"
        | "intermediate"
        | "advanced";
    }

    if (difficulty <= 2) return "beginner";
    if (difficulty <= 4) return "intermediate";
    return "advanced";
  }

  /**
   * Extract skills from content without making additional DB calls
   */
  private static extractSkillsFromContent(
    title: string,
    description: string | null,
    category: string | undefined,
    allSkills: Skill[]
  ): string[] {
    const categorySkills = category
      ? allSkills.filter((skill) => skill.category === category)
      : allSkills;
    const text = `${title} ${description || ""}`.toLowerCase();
    const matchedSkills: string[] = [];

    for (const skill of categorySkills) {
      const keywordMatch = skill.keywords.some((keyword: string) =>
        text.includes(keyword.toLowerCase())
      );
      const nameMatch = text.includes(skill.name.toLowerCase());

      if (keywordMatch || nameMatch) {
        matchedSkills.push(skill.name);
      }
    }

    return matchedSkills;
  }

  /**
   * Validate step data for consistency (development only)
   */
  private static validateStepData(step: DynamicStudyPlanStep): void {
    // Validate step ID format
    if (!IdService.isValidStepId(step.id)) {
      console.error(`Invalid step ID format: ${step.id}`);
      throw new Error(`Invalid step ID format: ${step.id}`);
    }

    // Validate prerequisites
    step.prerequisites.forEach((prereq) => {
      if (!IdService.isValidStepId(prereq)) {
        console.error(
          `Invalid prerequisite format: ${prereq} for step ${step.id}`
        );
        throw new Error(`Invalid prerequisite format: ${prereq}`);
      }
    });

    console.log(`✅ Step validation passed for: ${step.id} (${step.title})`);
  }

  /**
   * Update study plan progress when content is completed
   */
  static async updateStudyPlanProgressOnCompletion(
    userId: string,
    contentType: "tutorial" | "quiz" | "challenge" | "project" | "exercise",
    contentSlug: string
  ): Promise<void> {
    try {
      // Get current study plan progress
      const studyProgress = await prisma.userStudyProgress.findFirst({
        where: { userId },
      });

      if (!studyProgress) return;

      // Find the corresponding phase step
      const phaseStep = await prisma.phaseStep.findFirst({
        where: {
          contentType,
          contentSlug,
        },
      });

      if (!phaseStep) return;

      // Use IdService for consistent step ID creation
      const stepId = IdService.createStepId(phaseStep.id);
      const completedSteps = [...studyProgress.completedSteps];

      // Add step if not already completed
      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId);

        // Check if phase is now complete
        const phase = await prisma.phase.findUnique({
          where: { id: phaseStep.phaseId },
          include: { phaseSteps: true },
        });

        const completedPhases = [...studyProgress.completedPhases];

        if (phase) {
          const requiredSteps = phase.phaseSteps.filter((s) => !s.isOptional);
          const completedRequiredSteps = requiredSteps.filter((s) =>
            completedSteps.includes(`step-${s.id}`)
          );

          // Mark phase as complete if all required steps are done
          if (
            completedRequiredSteps.length === requiredSteps.length &&
            !completedPhases.includes(phase.id)
          ) {
            completedPhases.push(phase.id);
          }
        }

        // Calculate new current step after completion
        let newCurrentStepId = studyProgress.currentStepId;
        let newCurrentPhaseId = studyProgress.currentPhaseId;

        // Get the study plan to find the next step
        const studyPlan = await StudyPlanService.getWebDevelopmentStudyPlan();

        // Find first incomplete step with met prerequisites
        outerLoop: for (const phase of studyPlan.phases) {
          for (const step of [...phase.steps, ...phase.projects]) {
            if (!completedSteps.includes(step.id)) {
              // Check if prerequisites are met
              const prerequisitesMet = step.prerequisites.every((prereq) =>
                completedSteps.includes(prereq)
              );

              if (prerequisitesMet) {
                newCurrentPhaseId = phase.id;
                newCurrentStepId = step.id;
                break outerLoop;
              }
            }
          }
        }

        // If no incomplete step found, user completed everything
        if (newCurrentStepId === studyProgress.currentStepId) {
          // Check if current step is now completed
          if (completedSteps.includes(studyProgress.currentStepId)) {
            newCurrentStepId = "completed";
          }
        }

        // Calculate total progress percentage
        const totalSteps = studyPlan.phases.reduce(
          (sum, phase) => sum + phase.steps.length + phase.projects.length,
          0
        );
        const totalProgressPercentage =
          totalSteps > 0
            ? Math.round((completedSteps.length / totalSteps) * 100)
            : 0;

        // Find the completed step to get its estimated hours
        const completedStep = studyPlan.phases
          .flatMap((p) => [...p.steps, ...p.projects])
          .find((s) => s.id === stepId);

        const hoursToAdd = completedStep?.estimatedHours || 0;
        const newHoursSpent = Math.max(
          studyProgress.hoursSpent + hoursToAdd,
          0
        );

        // Update progress with new current step and hours
        await prisma.userStudyProgress.update({
          where: { id: studyProgress.id },
          data: {
            completedSteps,
            completedPhases,
            currentStepId: newCurrentStepId,
            currentPhaseId: newCurrentPhaseId,
            totalProgressPercentage,
            hoursSpent: newHoursSpent,
            lastActivityAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error("Error updating study plan progress:", error);
    }
  }

  /**
   * Get user's study plan progress
   */
  static async getUserStudyPlanProgress(
    userId: string,
    studyPlanId: string
  ): Promise<StudyPlanProgress | null> {
    try {
      const progress = await prisma.userStudyProgress.findFirst({
        where: {
          userId,
          studyPlanId,
        },
      });

      if (!progress) return null;

      return {
        userId: progress.userId,
        studyPlanId: progress.studyPlanId,
        currentPhaseId: progress.currentPhaseId,
        currentStepId: progress.currentStepId,
        completedSteps: progress.completedSteps,
        completedPhases: progress.completedPhases,
        totalProgressPercentage: progress.totalProgressPercentage,
        hoursSpent: progress.hoursSpent,
        startedAt: progress.startedAt,
        estimatedCompletionDate: progress.estimatedCompletionDate,
        lastActivityAt: progress.lastActivityAt,
      };
    } catch (error) {
      console.error("Error fetching user study plan progress:", error);
      return null;
    }
  }

  /**
   * Sync user's existing progress with study plan
   */
  static async syncUserProgressWithStudyPlan(
    userId: string,
    studyPlan: DynamicStudyPlan
  ): Promise<StudyPlanProgress> {
    try {
      // Get existing completed items from database using proper status checking
      const [
        tutorialProgress,
        challengeProgress,
        projectProgress,
        quizAttempts,
      ] = await Promise.all([
        prisma.tutorialProgress.findMany({
          where: {
            userId,
            OR: [{ status: CompletionStatus.COMPLETED }, { quizPassed: true }],
          },
          include: { tutorial: true },
        }),
        prisma.challengeProgress.findMany({
          where: {
            userId,
            status: CompletionStatus.COMPLETED,
          },
          include: { challenge: true },
        }),
        prisma.projectProgress.findMany({
          where: {
            userId,
            status: CompletionStatus.COMPLETED,
          },
          include: { project: true },
        }),
        prisma.quizAttempt.findMany({
          where: { userId, passed: true },
          include: { quiz: true },
        }),
      ]);

      // Build completed steps from actual database progress
      const completedSteps: string[] = [];

      // Process completed tutorials
      for (const progress of tutorialProgress) {
        const matchingStep = studyPlan.phases
          .flatMap((p) => p.steps)
          .find(
            (s) => s.slug === progress.tutorial.slug && s.type === "tutorial"
          );

        if (matchingStep) {
          completedSteps.push(matchingStep.id);
        }
      }

      // Process completed challenges
      for (const progress of challengeProgress) {
        const matchingStep = studyPlan.phases
          .flatMap((p) => p.steps)
          .find(
            (s) => s.slug === progress.challenge.slug && s.type === "challenge"
          );

        if (matchingStep) {
          completedSteps.push(matchingStep.id);
        }
      }

      // Process completed projects
      for (const progress of projectProgress) {
        const matchingStep = studyPlan.phases
          .flatMap((p) => [...p.steps, ...p.projects])
          .find(
            (s) => s.slug === progress.project.slug && s.type === "project"
          );

        if (matchingStep) {
          completedSteps.push(matchingStep.id);
        }
      }

      // Process completed quizzes
      for (const attempt of quizAttempts) {
        if (attempt.quiz?.slug) {
          const matchingStep = studyPlan.phases
            .flatMap((p) => p.steps)
            .find((s) => s.slug === attempt.quiz.slug && s.type === "quiz");

          if (matchingStep) {
            completedSteps.push(matchingStep.id);
          }
        }
      }

      // Use IdService to clean and validate completed steps
      const uniqueCompletedSteps = IdService.validateAndCleanStepIds([
        ...new Set(completedSteps),
      ]);

      // Calculate completed phases
      const completedPhases: string[] = [];
      for (const phase of studyPlan.phases) {
        const allPhaseSteps = [...phase.steps, ...phase.projects];
        const requiredSteps = allPhaseSteps.filter((step) => !step.isOptional);

        if (requiredSteps.length > 0) {
          const completedRequiredSteps = requiredSteps.filter((step) =>
            uniqueCompletedSteps.includes(step.id)
          );

          // Mark phase as complete if all required steps are done
          if (completedRequiredSteps.length === requiredSteps.length) {
            completedPhases.push(phase.id);
          }
        }
      }

      // Calculate progress percentage
      const totalSteps = studyPlan.phases.reduce(
        (sum, phase) => sum + phase.steps.length + phase.projects.length,
        0
      );
      const progressPercentage =
        totalSteps > 0
          ? Math.round((uniqueCompletedSteps.length / totalSteps) * 100)
          : 0;

      // Find current phase and step
      let currentPhaseId = studyPlan.phases[0]?.id || "";
      let currentStepId = "";

      // Find first incomplete phase and step
      for (const phase of studyPlan.phases) {
        if (!completedPhases.includes(phase.id)) {
          currentPhaseId = phase.id;

          // Find first incomplete step in this phase
          for (const step of [...phase.steps, ...phase.projects]) {
            if (!uniqueCompletedSteps.includes(step.id)) {
              // Check if prerequisites are met
              const prerequisitesMet = step.prerequisites.every((prereq) =>
                uniqueCompletedSteps.includes(prereq)
              );

              if (prerequisitesMet) {
                currentStepId = step.id;
                break;
              }
            }
          }
          break;
        }
      }

      // If no current step found, user has completed everything
      if (
        !currentStepId &&
        completedPhases.length === studyPlan.phases.length
      ) {
        currentStepId = "completed";
      }

      // Create or update progress record
      const userProgress = await prisma.userStudyProgress.upsert({
        where: {
          userId_studyPlanId: {
            userId,
            studyPlanId: studyPlan.id,
          },
        },
        update: {
          currentPhaseId,
          currentStepId,
          completedSteps: uniqueCompletedSteps,
          completedPhases,
          totalProgressPercentage: progressPercentage,
          lastActivityAt: new Date(),
        },
        create: {
          userId,
          studyPlanId: studyPlan.id,
          currentPhaseId,
          currentStepId,
          completedSteps: uniqueCompletedSteps,
          completedPhases,
          totalProgressPercentage: progressPercentage,
          hoursSpent: 0,
          startedAt: new Date(),
          estimatedCompletionDate: new Date(
            Date.now() +
              Math.max(studyPlan.totalWeeks, 1) * 7 * 24 * 60 * 60 * 1000
          ),
          lastActivityAt: new Date(),
        },
      });

      return {
        userId: userProgress.userId,
        studyPlanId: userProgress.studyPlanId,
        currentPhaseId: userProgress.currentPhaseId,
        currentStepId: userProgress.currentStepId,
        completedSteps: userProgress.completedSteps,
        completedPhases: userProgress.completedPhases,
        totalProgressPercentage: userProgress.totalProgressPercentage,
        hoursSpent: userProgress.hoursSpent,
        startedAt: userProgress.startedAt,
        estimatedCompletionDate: userProgress.estimatedCompletionDate,
        lastActivityAt: userProgress.lastActivityAt,
      };
    } catch (error) {
      console.error("Error syncing user progress with study plan:", error);
      throw new Error("Failed to sync progress");
    }
  }
}
