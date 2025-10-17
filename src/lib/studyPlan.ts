import { Tutorial, Challenge } from "@prisma/client";

export interface StudyPlanStep {
  id: string;
  title: string;
  description: string;
  type: "tutorial" | "challenge" | "quiz" | "project" | "milestone";
  resourceId?: string; // ID of tutorial, challenge, etc.
  estimatedHours: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[]; // IDs of previous steps
  skills: string[]; // Skills learned in this step
  isOptional: boolean;
  order: number;
}

export interface StudyPlanPhase {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  estimatedWeeks: number;
  steps: StudyPlanStep[];
  milestoneProject?: {
    title: string;
    description: string;
    requirements: string[];
  };
}

export interface StudyPlan {
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
  phases: StudyPlanPhase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStudyProgress {
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

// Helper functions
export function calculateTotalSteps(studyPlan: StudyPlan): number {
  return studyPlan.phases.reduce(
    (total, phase) => total + phase.steps.length,
    0
  );
}

export function calculateCompletedSteps(
  studyPlan: StudyPlan,
  completedSteps: string[]
): number {
  return completedSteps.length;
}

export function calculateProgressPercentage(
  studyPlan: StudyPlan,
  completedSteps: string[]
): number {
  const totalSteps = calculateTotalSteps(studyPlan);
  const completed = calculateCompletedSteps(studyPlan, completedSteps);
  return totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0;
}

export function getCurrentPhase(
  studyPlan: StudyPlan,
  completedSteps: string[]
): StudyPlanPhase | null {
  for (const phase of studyPlan.phases) {
    const phaseSteps = phase.steps.map((s) => s.id);
    const completedInPhase = phaseSteps.filter((stepId) =>
      completedSteps.includes(stepId)
    );

    if (completedInPhase.length < phaseSteps.length) {
      return phase;
    }
  }

  // All phases completed
  return studyPlan.phases[studyPlan.phases.length - 1];
}

export function getNextStep(
  studyPlan: StudyPlan,
  completedSteps: string[]
): StudyPlanStep | null {
  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (!completedSteps.includes(step.id)) {
        // Check if prerequisites are met
        const prerequisitesMet = step.prerequisites.every((prereq) =>
          completedSteps.includes(prereq)
        );

        if (prerequisitesMet) {
          return step;
        }
      }
    }
  }

  return null; // All steps completed
}

export function getSkillsLearned(
  studyPlan: StudyPlan,
  completedSteps: string[]
): string[] {
  const skills = new Set<string>();

  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (completedSteps.includes(step.id)) {
        step.skills.forEach((skill) => skills.add(skill));
      }
    }
  }

  return Array.from(skills);
}

export function estimateCompletionDate(
  studyPlan: StudyPlan,
  completedSteps: string[],
  hoursPerWeek: number = 10
): Date {
  let remainingHours = 0;

  for (const phase of studyPlan.phases) {
    for (const step of phase.steps) {
      if (!completedSteps.includes(step.id)) {
        remainingHours += step.estimatedHours;
      }
    }
  }

  const remainingWeeks = Math.ceil(remainingHours / hoursPerWeek);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + remainingWeeks * 7);

  return completionDate;
}
