import { DynamicStudyPlan, DynamicStudyPlanPhase, DynamicStudyPlanStep } from "@/lib/services/studyPlanService";

/**
 * Centralized utilities for study plan calculations
 * This ensures consistent logic across all components
 */

export interface CurrentStepInfo {
  currentPhase: DynamicStudyPlanPhase | null;
  currentStep: DynamicStudyPlanStep | null;
  nextStep: DynamicStudyPlanStep | null;
}

/**
 * Get current phase, current step, and next step based on user progress
 * Uses the backend-provided currentStepId as the source of truth
 */
export function getCurrentStepInfo(
  studyPlan: DynamicStudyPlan, 
  completedSteps: string[],
  currentStepId?: string
): CurrentStepInfo {
  // If we have a currentStepId from backend, use it as source of truth
  if (currentStepId) {
    for (const phase of studyPlan.phases) {
      const allSteps = [...phase.steps, ...phase.projects];
      const currentStep = allSteps.find(step => step.id === currentStepId);
      
      if (currentStep) {
        const nextStep = findNextAvailableStep(studyPlan, completedSteps, currentStep);
        return {
          currentPhase: phase,
          currentStep,
          nextStep
        };
      }
    }
  }

  // Fallback: Find the first incomplete step with prerequisites met
  const nextStep = findNextAvailableStep(studyPlan, completedSteps);
  const currentPhase = nextStep ? findPhaseForStep(studyPlan, nextStep) : studyPlan.phases[0];
  
  return {
    currentPhase,
    currentStep: nextStep,
    nextStep
  };
}

/**
 * Find the next available step that the user can start
 */
export function findNextAvailableStep(
  studyPlan: DynamicStudyPlan, 
  completedSteps: string[],
  afterStep?: DynamicStudyPlanStep
): DynamicStudyPlanStep | null {
  const allSteps = studyPlan.phases.flatMap(phase => [...phase.steps, ...phase.projects]);
  
  // If afterStep is provided, start searching after that step
  let startIndex = 0;
  if (afterStep) {
    const afterIndex = allSteps.findIndex(step => step.id === afterStep.id);
    startIndex = afterIndex + 1;
  }
  
  // Find the first step that:
  // 1. Is not completed
  // 2. Has all prerequisites met
  for (let i = startIndex; i < allSteps.length; i++) {
    const step = allSteps[i];
    
    if (completedSteps.includes(step.id)) continue;
    
    const prerequisitesMet = step.prerequisites.every(prereq => 
      completedSteps.includes(prereq)
    );
    
    if (prerequisitesMet) {
      return step;
    }
  }
  
  return null;
}

/**
 * Find which phase a step belongs to
 */
export function findPhaseForStep(studyPlan: DynamicStudyPlan, step: DynamicStudyPlanStep): DynamicStudyPlanPhase | null {
  for (const phase of studyPlan.phases) {
    const allSteps = [...phase.steps, ...phase.projects];
    if (allSteps.some(s => s.id === step.id)) {
      return phase;
    }
  }
  return null;
}

/**
 * Calculate phase progress percentage
 */
export function getPhaseProgress(phase: DynamicStudyPlanPhase, completedSteps: string[]): number {
  const allPhaseSteps = [...phase.steps, ...phase.projects];
  const completedInPhase = allPhaseSteps.filter((step) =>
    completedSteps.includes(step.id)
  ).length;
  return allPhaseSteps.length > 0
    ? (completedInPhase / allPhaseSteps.length) * 100
    : 0;
}

/**
 * Calculate overall study plan progress
 */
export function getOverallProgress(studyPlan: DynamicStudyPlan, completedSteps: string[]): number {
  const totalSteps = studyPlan.phases.reduce(
    (sum, phase) => sum + phase.steps.length + phase.projects.length, 0
  );
  return totalSteps > 0 
    ? Math.round((completedSteps.length / totalSteps) * 100) 
    : 0;
}

/**
 * Get all skills learned from completed steps
 */
export function getSkillsLearned(studyPlan: DynamicStudyPlan, completedSteps: string[]): string[] {
  return Array.from(new Set(
    studyPlan.phases
      .flatMap(phase => [...phase.steps, ...phase.projects])
      .filter(step => completedSteps.includes(step.id))
      .flatMap(step => step.skills)
  ));
}