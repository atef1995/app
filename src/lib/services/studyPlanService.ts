import { prisma } from "@/lib/prisma";
import { ProgressService, CompletionStatus } from "@/lib/progressService";
import { PhaseService, PhaseWithSteps, ContentItem } from "@/lib/services/phaseService";
import { SkillService } from "@/lib/services/skillService";
import { Phase, PhaseStep, Skill } from "@prisma/client";

// Updated types to work with Phase schema

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
        phasesWithContent.map(phase => this.convertPhaseToStudyPlanPhase(phase, allSkills))
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
          "A comprehensive journey from HTML foundations to expert JavaScript developer, covering web fundamentals, modern syntax, advanced concepts, and real-world applications.",
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
    allSkills: Skill[]
  ): Promise<DynamicStudyPlanPhase> {
    const steps: DynamicStudyPlanStep[] = [];
    const projects: DynamicStudyPlanStep[] = [];

    // Local function to extract skills without DB calls
    const extractSkillsFromContent = (title: string, description: string | null, category?: string): string[] => {
      const categorySkills = category 
        ? allSkills.filter(skill => skill.category === category)
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
    };

    // Process each phase step
    for (const phaseStep of phase.phaseSteps) {
      const content = PhaseService.getContentFromStep(phaseStep);
      
      if (!content) continue;

      const stepData: DynamicStudyPlanStep = {
        id: `step-${phaseStep.id}`,
        phaseStepId: phaseStep.id,
        title: content.title,
        description: content.description,
        type: phaseStep.contentType as "tutorial" | "challenge" | "quiz" | "project",
        resourceId: content.id,
        slug: content.slug,
        estimatedHours: phaseStep.estimatedHours,
        difficulty: this.mapDifficulty(content.difficulty),
        category: content.category,
        prerequisites: phaseStep.prerequisites,
        skills: extractSkillsFromContent(content.title, content.description, content.category),
        isOptional: phaseStep.isOptional,
        order: phaseStep.order,
        isPremium: content.isPremium,
        requiredPlan: content.requiredPlan,
      };

      // Separate projects from regular steps
      if (phaseStep.contentType === "project") {
        projects.push(stepData);
      } else {
        steps.push(stepData);
      }
    }

    return {
      id: phase.id,
      slug: phase.slug,
      title: phase.title,
      description: phase.description,
      color: phase.color,
      icon: phase.icon,
      estimatedWeeks: phase.estimatedWeeks,
      prerequisites: phase.prerequisites,
      steps: steps.sort((a, b) => a.order - b.order),
      projects: projects.sort((a, b) => a.order - b.order),
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
   * Estimate hours based on content type and difficulty
   */
  private static estimateHours(
    difficulty: number | string,
    type: string
  ): number {
    const difficultyMultiplier =
      typeof difficulty === "number"
        ? difficulty
        : difficulty === "easy"
        ? 1
        : difficulty === "medium"
        ? 2
        : 3;

    const baseHours = {
      tutorial: 3,
      challenge: 2,
      quiz: 0.5,
      project: 8,
    };

    return (
      (baseHours[type as keyof typeof baseHours] || 3) * difficultyMultiplier
    );
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
      // Get existing progress from different tables
      const [tutorialProgress, challengeProgress, projectProgress] =
        await Promise.all([
          ProgressService.getTutorialProgress(userId),
          ProgressService.getChallengeProgress(userId),
          ProgressService.getProjectProgress(userId),
        ]);

      // Map existing progress to study plan steps
      // Start with existing completed steps from UserStudyProgress
      const completedSteps: string[] = [...studyPlan.phases.reduce((steps: string[], phase) => {
        return [...steps, ...phase.steps.map(s => s.id), ...phase.projects.map(p => p.id)];
      }, [])].filter(stepId => {
        // Keep only steps that exist in UserStudyProgress (already synced)
        return false; // For now, rebuild from individual progress
      });

      // Check completed tutorials
      if (Array.isArray(tutorialProgress)) {
        for (const progress of tutorialProgress) {
          // Check for both COMPLETED status and successful quiz completion
          const isCompleted = progress.status === "COMPLETED" || 
                            progress.status === CompletionStatus.COMPLETED;
          const isQuizPassed = progress.quizPassed === true;
          
          if (isCompleted || isQuizPassed) {
            // Find matching tutorial step by slug
            const matchingStep = studyPlan.phases
              .flatMap(p => p.steps)
              .find(s => s.slug === progress.tutorial.slug && s.type === "tutorial");
            
            if (matchingStep && !completedSteps.includes(matchingStep.id)) {
              completedSteps.push(matchingStep.id);
            }
          }
        }
      }

      // Check completed challenges
      if (Array.isArray(challengeProgress)) {
        for (const progress of challengeProgress) {
          if (progress.status === "COMPLETED") {
            // Find matching challenge step by slug
            const matchingStep = studyPlan.phases
              .flatMap(p => p.steps)
              .find(s => s.slug === progress.challenge.slug && s.type === "challenge");
            
            if (matchingStep && !completedSteps.includes(matchingStep.id)) {
              completedSteps.push(matchingStep.id);
            }
          }
        }
      }

      // Check completed projects
      if (Array.isArray(projectProgress)) {
        for (const progress of projectProgress) {
          if (progress.status === "COMPLETED") {
            // Find matching project step by slug
            const matchingStep = studyPlan.phases
              .flatMap(p => p.projects)
              .find(s => s.slug === progress.project.slug && s.type === "project");
            
            if (matchingStep && !completedSteps.includes(matchingStep.id)) {
              completedSteps.push(matchingStep.id);
            }
          }
        }
      }

      // Calculate progress
      const totalSteps = studyPlan.phases.reduce(
        (sum, phase) => sum + phase.steps.length + phase.projects.length,
        0
      );
      const progressPercentage =
        totalSteps > 0
          ? Math.round((completedSteps.length / totalSteps) * 100)
          : 0;

      // Find current phase and step
      let currentPhaseId = studyPlan.phases[0].slug; // Use slug for phase ID
      let currentStepId = studyPlan.phases[0].steps[0]?.id || "";

      // Find first incomplete step with met prerequisites
      outerLoop: for (const phase of studyPlan.phases) {
        for (const step of phase.steps) {
          if (!completedSteps.includes(step.id)) {
            // Check prerequisites
            const prerequisitesMet = step.prerequisites.every((prereq) =>
              completedSteps.includes(prereq)
            );

            if (prerequisitesMet) {
              currentPhaseId = phase.slug; // Use phase slug
              currentStepId = step.id;
              break outerLoop;
            }
          }
        }
      }

      // Create or update progress record
      const progressData = {
        userId,
        studyPlanId: studyPlan.id,
        currentPhaseId,
        currentStepId,
        completedSteps,
        completedPhases: [],
        totalProgressPercentage: progressPercentage,
        hoursSpent: 0,
        estimatedCompletionDate: new Date(
          Date.now() + 24 * 7 * 24 * 60 * 60 * 1000
        ),
      };

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
          completedSteps,
          completedPhases: [],
          totalProgressPercentage: progressData.totalProgressPercentage,
          lastActivityAt: new Date(),
        },
        create: {
          ...progressData,
          startedAt: new Date(),
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
