import { prisma } from "@/lib/prisma";
import { TutorialService } from "@/lib/tutorialService";
import { ProjectService, ProjectWithCount } from "@/lib/projectService";
import { ProgressService, CompletionStatus } from "@/lib/progressService";
import { getAllChallenges, ChallengeWithTests } from "@/lib/challengeService";
import { SkillService } from "@/lib/services/skillService";
import { Tutorial, Category, Quiz } from "@prisma/client";

// Types for tutorials with their relationships
type TutorialWithCategory = Tutorial & {
  category: Category;
  quiz?: Quiz;
};

export interface DynamicStudyPlanStep {
  id: string;
  title: string;
  description: string | null;
  type: "tutorial" | "challenge" | "quiz" | "project";
  resourceId: string;
  slug?: string;
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  prerequisites: string[];
  skills: string[];
  isOptional: boolean;
  order: number;
  isPremium: boolean;
  requiredPlan: string;
}

export interface DynamicStudyPlanPhase {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  estimatedWeeks: number;
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
   * Get dynamic study plan for web development based on database content
   */
  static async getWebDevelopmentStudyPlan(): Promise<DynamicStudyPlan> {
    try {
      // Fetch all content from database
      const [tutorials, challenges, projects] = await Promise.all([
        TutorialService.getAllTutorials(),
        getAllChallenges(),
        ProjectService.getAllProjects(),
      ]);

      // Define phase structure with content mapping
      const phases = await this.buildWebDevelopmentPhases(
        tutorials,
        challenges,
        projects
      );

      const totalHours = phases.reduce(
        (sum, phase) =>
          sum +
          phase.steps.reduce(
            (stepSum, step) => stepSum + step.estimatedHours,
            0
          ),
        0
      );

      return {
        id: "web-development-dynamic-path",
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
      console.error("Error generating dynamic study plan:", error);
      throw new Error("Failed to generate study plan");
    }
  }

  /**
   * Build web development learning phases with actual database content
   */
  private static async buildWebDevelopmentPhases(
    tutorials: TutorialWithCategory[],
    challenges: ChallengeWithTests[],
    projects: ProjectWithCount[]
  ): Promise<DynamicStudyPlanPhase[]> {
    // Phase 0: HTML Foundations (prerequisite for JavaScript)
    const htmlPhase = await this.buildPhase(
      "html-foundations",
      "HTML Foundations",
      "Learn the building blocks of web development with HTML",
      "from-orange-400 to-red-500",
      "Globe",
      2,
      "html",
      tutorials,
      challenges,
      projects,
      ["html", "elements", "structure", "semantic", "forms"]
    );

    // Phase 1:
    const cssPhase = await this.buildPhase(
      "css-foundations",
      "CSS Foundations",
      "Learn CSS",
      "from-blue-400 to-purple-500",
      "Palette",
      2,
      "css",
      tutorials,
      challenges,
      projects,
      ["css"]
    );

    // Phase 2: JavaScript Fundamentals
    const fundamentalPhase = await this.buildPhase(
      "foundations",
      "JavaScript Fundamentals",
      "Master the core concepts and syntax of JavaScript",
      "from-green-400 to-blue-500",
      "Sprout",
      4,
      "fundamentals",
      tutorials,
      challenges,
      projects,
      ["variables", "functions", "arrays", "objects", "control"]
    );

    // Phase 3: DOM & Interactivity
    const domPhase = await this.buildPhase(
      "dom-interactive",
      "DOM Manipulation & Interactivity",
      "Learn to make web pages interactive and dynamic",
      "from-purple-400 to-pink-500",
      "MousePointer",
      3,
      "dom",
      tutorials,
      challenges,
      projects,
      ["dom", "event", "interactive"]
    );

    // Phase 4: Object-Oriented Programming
    const oopPhase = await this.buildPhase(
      "oop-concepts",
      "Object-Oriented Programming",
      "Master classes, inheritance, and OOP principles",
      "from-orange-400 to-red-500",
      "Building",
      3,
      "oop",
      tutorials,
      challenges,
      projects,
      ["class", "object", "inheritance", "encapsulation"]
    );

    // Phase 5: Asynchronous Programming
    const asyncPhase = await this.buildPhase(
      "async-programming",
      "Asynchronous JavaScript",
      "Master promises, async/await, and API integration",
      "from-yellow-400 to-orange-500",
      "Zap",
      4,
      "async",
      tutorials,
      challenges,
      projects,
      ["async", "promise", "api", "fetch"]
    );

    // Phase 6: Advanced Concepts
    const advancedPhase = await this.buildPhase(
      "advanced-concepts",
      "Advanced JavaScript",
      "Deep dive into advanced concepts and patterns",
      "from-red-400 to-purple-600",
      "Flame",
      5,
      "advanced",
      tutorials,
      challenges,
      projects,
      ["advanced", "pattern", "performance", "testing"]
    );

    // Phase 7: Data Structures & Algorithms
    const dataStructuresPhase = await this.buildPhase(
      "data-structures",
      "Data Structures & Algorithms",
      "Master computer science fundamentals",
      "from-blue-400 to-indigo-600",
      "Database",
      4,
      "data-structures",
      tutorials,
      challenges,
      projects,
      ["algorithm", "data", "structure", "sorting", "search"]
    );

    return [
      htmlPhase,
      cssPhase,
      fundamentalPhase,
      domPhase,
      oopPhase,
      asyncPhase,
      advancedPhase,
      dataStructuresPhase,
    ];
  }

  /**
   * Build a phase with content from database
   */
  private static async buildPhase(
    id: string,
    title: string,
    description: string,
    color: string,
    icon: string,
    estimatedWeeks: number,
    category: string,
    tutorials: TutorialWithCategory[],
    challenges: ChallengeWithTests[],
    projects: ProjectWithCount[],
    keywords: string[]
  ): Promise<DynamicStudyPlanPhase> {
    const steps: DynamicStudyPlanStep[] = [];
    let order = 1;

    // Filter content by category first (strict category matching)
    const phaseTutorials = tutorials
      .filter((t) => t.category.slug === category)
      .sort((a, b) => a.order - b.order);

    // For challenges, filter by keywords but ensure they're relevant to the phase
    const phaseChallenges = challenges.filter((c) => {
      // For HTML phase, only include challenges that specifically mention HTML
      if (category === "html") {
        return (
          c.title.toLowerCase().includes("html") ||
          c.description.toLowerCase().includes("html")
        );
      }
      // For other phases, use keyword matching
      return keywords.some(
        (keyword) =>
          c.title.toLowerCase().includes(keyword) ||
          c.description.toLowerCase().includes(keyword)
      );
    });

    // For projects, filter by category first, then by keywords as secondary
    const phaseProjects = projects
      .filter((p) => {
        // First try exact category match
        if (p.category === category) return true;

        // For HTML phase, only include projects that specifically mention HTML
        if (category === "html") {
          return (
            p.title.toLowerCase().includes("html") ||
            (p.description && p.description.toLowerCase().includes("html"))
          );
        }

        // For other phases, use keyword matching as fallback
        return keywords.some(
          (keyword) =>
            p.title.toLowerCase().includes(keyword) ||
            (p.description && p.description.toLowerCase().includes(keyword))
        );
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Add tutorials as steps
    for (const tutorial of phaseTutorials) {
      steps.push({
        id: `tutorial-${tutorial.slug}`,
        title: tutorial.title,
        description: tutorial.description,
        type: "tutorial",
        resourceId: tutorial.slug,
        slug: tutorial.slug,
        estimatedHours: this.estimateHours(tutorial.difficulty, "tutorial"),
        difficulty: this.mapDifficulty(tutorial.difficulty),
        category: tutorial.category.slug,
        prerequisites: order === 1 ? [] : [steps[steps.length - 1]?.id],
        skills: await SkillService.extractSkillsFromContent(
          tutorial.title,
          tutorial.description,
          tutorial.category.slug
        ),
        isOptional: false,
        order: order++,
        isPremium: tutorial.isPremium,
        requiredPlan: tutorial.requiredPlan,
      });

      // Add quiz after tutorial if it exists
      if (tutorial.quiz) {
        steps.push({
          id: `quiz-${tutorial.quiz.slug}`,
          title: tutorial.quiz.title,
          description: `Test your understanding of ${tutorial.title}`,
          type: "quiz",
          resourceId: tutorial.quiz.slug,
          slug: tutorial.quiz.slug,
          estimatedHours: 0.5,
          difficulty: this.mapDifficulty(tutorial.difficulty),
          category: tutorial.category.slug,
          prerequisites: [`tutorial-${tutorial.slug}`],
          skills: await SkillService.extractSkillsFromContent(
            tutorial.title,
            tutorial.description,
            tutorial.category.slug
          ),
          isOptional: false,
          order: order++,
          isPremium: tutorial.quiz.isPremium,
          requiredPlan: tutorial.quiz.requiredPlan,
        });
      }
    }

    // Add challenges as steps (only if there are relevant challenges)
    for (const challenge of phaseChallenges.slice(0, 3)) {
      // Limit to 3 challenges per phase
      steps.push({
        id: `challenge-${challenge.slug}`,
        title: challenge.title,
        description: challenge.description,
        type: "challenge",
        resourceId: challenge.slug,
        slug: challenge.slug,
        estimatedHours: this.estimateHours(challenge.difficulty, "challenge"),
        difficulty: challenge.difficulty as
          | "beginner"
          | "intermediate"
          | "advanced",
        category: category,
        prerequisites: steps.length > 0 ? [steps[steps.length - 1]?.id] : [],
        skills: await SkillService.extractSkillsFromContent(
          challenge.title,
          challenge.description,
          category
        ),
        isOptional: false,
        order: order++,
        isPremium: challenge.isPremium || false,
        requiredPlan: challenge.requiredPlan || "FREE",
      });
    }

    // Phase projects (separate from steps)
    const phaseProjectSteps = await Promise.all(
      phaseProjects.slice(0, 2).map(async (project, index) => ({
        id: `project-${project.slug}`,
        title: project.title,
        description: project.description || "",
        type: "project" as const,
        resourceId: project.slug,
        slug: project.slug,
        estimatedHours: project.estimatedHours || 8,
        difficulty: this.mapDifficulty(project.difficulty || 1),
        category: project.category || category,
        prerequisites: steps.length > 0 ? [steps[steps.length - 1]?.id] : [],
        skills: await SkillService.extractSkillsFromContent(
          project.title,
          project.description || "",
          project.category || category
        ),
        isOptional: false,
        order: index + 1,
        isPremium: project.isPremium || false,
        requiredPlan: project.requiredPlan || "FREE",
      }))
    );

    return {
      id,
      title,
      description,
      color,
      icon,
      estimatedWeeks,
      steps,
      projects: phaseProjectSteps,
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
            const stepId = `tutorial-${progress.tutorial.slug}`;
            
            const stepExists = studyPlan.phases.some((p) => 
              p.steps.some((s) => s.id === stepId)
            );
            
            if (stepExists && !completedSteps.includes(stepId)) {
              completedSteps.push(stepId);
            }
          }
        }
      }

      // Check completed challenges
      if (Array.isArray(challengeProgress)) {
        for (const progress of challengeProgress) {
          if (progress.status === "COMPLETED") {
            const stepId = `challenge-${progress.challenge.slug}`;
            if (
              studyPlan.phases.some((p) => p.steps.some((s) => s.id === stepId))
            ) {
              completedSteps.push(stepId);
            }
          }
        }
      }

      // Check completed projects
      if (Array.isArray(projectProgress)) {
        for (const progress of projectProgress) {
          if (progress.status === "COMPLETED") {
            const stepId = `project-${progress.project.slug}`;
            if (
              studyPlan.phases.some((p) =>
                p.projects.some((s) => s.id === stepId)
              )
            ) {
              completedSteps.push(stepId);
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
      let currentPhaseId = studyPlan.phases[0].id;
      let currentStepId = studyPlan.phases[0].steps[0]?.id || "";

      for (const phase of studyPlan.phases) {
        for (const step of phase.steps) {
          if (!completedSteps.includes(step.id)) {
            // Check prerequisites
            const prerequisitesMet = step.prerequisites.every((prereq) =>
              completedSteps.includes(prereq)
            );

            if (prerequisitesMet) {
              currentPhaseId = phase.id;
              currentStepId = step.id;
              break;
            }
          }
        }
        if (currentStepId !== studyPlan.phases[0].steps[0]?.id) break;
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
