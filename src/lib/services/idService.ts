/**
 * Centralized ID management service for study plan system
 * Ensures consistent ID formats across the application
 */
export class IdService {
  /**
   * Create a standardized step ID from a PhaseStep ID
   */
  static createStepId(phaseStepId: string): string {
    return `step-${phaseStepId}`;
  }

  /**
   * Extract PhaseStep ID from a step ID
   */
  static parseStepId(stepId: string): string | null {
    const match = stepId.match(/^step-(.+)$/);
    return match ? match[1] : null;
  }

  /**
   * Check if a step ID is in the correct format
   */
  static isValidStepId(stepId: string): boolean {
    return /^step-[a-z0-9]+$/i.test(stepId);
  }

  /**
   * Convert legacy content-based IDs to step IDs
   * @param contentId Format like "tutorial-html-basics" or "quiz-html-basics-quiz"
   * @param allPhaseSteps All phase steps to search through
   */
  static async convertContentIdToStepId(
    contentId: string,
    allPhaseSteps: Array<{ id: string; contentType: string; contentSlug: string }>
  ): Promise<string> {
    // If already in correct format, return as-is
    if (this.isValidStepId(contentId)) {
      return contentId;
    }

    // Handle content-based IDs
    if (contentId.includes('-')) {
      const [contentType, ...slugParts] = contentId.split('-');
      const contentSlug = slugParts.join('-');

      if (['tutorial', 'quiz', 'challenge', 'project'].includes(contentType)) {
        // Find matching phase step
        const matchingStep = allPhaseSteps.find((step) => {
          return step.contentType === contentType && step.contentSlug === contentSlug;
        });

        if (matchingStep) {
          return this.createStepId(matchingStep.id);
        }
      }
    }

    // If it looks like a raw ID, assume it's a phaseStep ID
    if (/^[a-z0-9]+$/i.test(contentId)) {
      return this.createStepId(contentId);
    }

    // Return original if we can't convert it
    console.warn(`Unable to convert content ID to step ID: ${contentId}`);
    return contentId;
  }

  /**
   * Validate and clean a list of step IDs
   */
  static validateAndCleanStepIds(stepIds: string[]): string[] {
    return stepIds.filter(stepId => {
      const isValid = this.isValidStepId(stepId);
      if (!isValid) {
        console.warn(`Removing invalid step ID: ${stepId}`);
      }
      return isValid;
    });
  }

  /**
   * Convert an array of mixed format IDs to proper step IDs
   */
  static async normalizePrerequisites(
    prerequisites: string[],
    allPhaseSteps: Array<{ id: string; contentType: string; contentSlug: string }>
  ): Promise<string[]> {
    const normalized = await Promise.all(
      prerequisites.map(prereq => 
        this.convertContentIdToStepId(prereq, allPhaseSteps)
      )
    );

    return this.validateAndCleanStepIds(normalized);
  }
}