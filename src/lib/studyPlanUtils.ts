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
 */
export function getCurrentStepInfo(
  studyPlan: DynamicStudyPlan, 
  completedSteps: string[],
  currentStepId?: string
): CurrentStepInfo {
  // Find the first incomplete step with prerequisites met
  const nextStep = findNextAvailableStep(studyPlan, completedSteps);
  
  // If we have a currentStepId, find its phase for current context
  let currentPhase: DynamicStudyPlanPhase | null = null;
  let currentStep: DynamicStudyPlanStep | null = null;
  
  if (currentStepId) {
    for (const phase of studyPlan.phases) {
      const allSteps = [...phase.steps, ...phase.projects];
      const step = allSteps.find(step => step.id === currentStepId);
      if (step) {
        currentPhase = phase;
        currentStep = step;
        break;
      }
    }
  }
  
  // If no current step or phase found, use the phase containing the next step
  if (!currentPhase && nextStep) {
    currentPhase = findPhaseForStep(studyPlan, nextStep);
  }
  
  // Default to first phase if still no phase found
  if (!currentPhase) {
    currentPhase = studyPlan.phases[0];
  }
  
  return {
    currentPhase,
    currentStep,
    nextStep
  };
}

/**
 * Find the next available step that the user can start
 * Searches through phases in order, then steps within each phase
 */
export function findNextAvailableStep(
  studyPlan: DynamicStudyPlan, 
  completedSteps: string[]
): DynamicStudyPlanStep | null {
  // Go through phases in order
  for (const phase of studyPlan.phases) {
    const allSteps = [...phase.steps, ...phase.projects].sort((a, b) => a.order - b.order);
    
    // Find first incomplete step with prerequisites met
    for (const step of allSteps) {
      // Skip if already completed
      if (completedSteps.includes(step.id)) continue;
      
      // Check if all prerequisites are met
      const prerequisitesMet = step.prerequisites.every(prereq => 
        completedSteps.includes(prereq)
      );
      
      if (prerequisitesMet) {
        return step;
      }
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