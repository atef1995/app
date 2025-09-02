import { prisma } from "@/lib/prisma";
import { IdService } from "./idService";

/**
 * Service for migrating and fixing inconsistent data formats
 */
export class DataMigrationService {
  /**
   * Fix prerequisite formats in all PhaseSteps
   */
  static async fixPrerequisiteFormats(): Promise<void> {
    console.log("🔧 Starting prerequisite format migration...");

    try {
      // Get all phase steps
      const allPhaseSteps = await prisma.phaseStep.findMany({
        orderBy: { createdAt: 'asc' }
      });

      console.log(`Found ${allPhaseSteps.length} phase steps to check`);

      let updatedCount = 0;

      for (const step of allPhaseSteps) {
        if (step.prerequisites.length === 0) continue;

        console.log(`Checking step ${step.id} (${step.contentType}:${step.contentSlug})`);
        console.log(`Current prerequisites: ${JSON.stringify(step.prerequisites)}`);

        // Normalize prerequisites using IdService
        const fixedPrerequisites = await IdService.normalizePrerequisites(
          step.prerequisites,
          allPhaseSteps
        );

        // Check if any changes are needed
        const hasChanges = JSON.stringify(step.prerequisites.sort()) !== 
                          JSON.stringify(fixedPrerequisites.sort());

        if (hasChanges) {
          console.log(`Updating prerequisites from:`, step.prerequisites);
          console.log(`                            to:`, fixedPrerequisites);

          await prisma.phaseStep.update({
            where: { id: step.id },
            data: { prerequisites: fixedPrerequisites }
          });

          updatedCount++;
        } else {
          console.log(`No changes needed for step ${step.id}`);
        }
      }

      console.log(`✅ Migration completed! Updated ${updatedCount} phase steps.`);
    } catch (error) {
      console.error("❌ Migration failed:", error);
      throw error;
    }
  }

  /**
   * Clean up user study progress to remove invalid step IDs
   */
  static async cleanUserStudyProgress(): Promise<void> {
    console.log("🧹 Cleaning user study progress...");

    try {
      const allProgress = await prisma.userStudyProgress.findMany();

      let updatedCount = 0;

      for (const progress of allProgress) {
        const cleanedSteps = IdService.validateAndCleanStepIds(progress.completedSteps);
        
        if (cleanedSteps.length !== progress.completedSteps.length) {
          console.log(`Cleaning progress for user ${progress.userId}`);
          console.log(`Removed ${progress.completedSteps.length - cleanedSteps.length} invalid step IDs`);

          await prisma.userStudyProgress.update({
            where: { id: progress.id },
            data: { 
              completedSteps: cleanedSteps,
              // Recalculate percentage based on cleaned steps
              totalProgressPercentage: Math.round((cleanedSteps.length / Math.max(progress.completedSteps.length, 1)) * progress.totalProgressPercentage)
            }
          });

          updatedCount++;
        }
      }

      console.log(`✅ Cleaned ${updatedCount} user progress records.`);
    } catch (error) {
      console.error("❌ Progress cleanup failed:", error);
      throw error;
    }
  }

  /**
   * Validate current data integrity
   */
  static async validateDataIntegrity(): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    console.log("🔍 Validating data integrity...");

    const issues: string[] = [];

    try {
      // Check PhaseStep prerequisites
      const phaseSteps = await prisma.phaseStep.findMany();
      
      for (const step of phaseSteps) {
        for (const prereq of step.prerequisites) {
          if (!IdService.isValidStepId(prereq)) {
            issues.push(`PhaseStep ${step.id} has invalid prerequisite format: ${prereq}`);
          } else {
            // Check if prerequisite step actually exists
            const prereqStepId = IdService.parseStepId(prereq);
            if (prereqStepId) {
              const prereqExists = phaseSteps.some(ps => ps.id === prereqStepId);
              if (!prereqExists) {
                issues.push(`PhaseStep ${step.id} references non-existent prerequisite: ${prereq}`);
              }
            }
          }
        }
      }

      // Check UserStudyProgress
      const userProgress = await prisma.userStudyProgress.findMany();
      
      for (const progress of userProgress) {
        for (const stepId of progress.completedSteps) {
          if (!IdService.isValidStepId(stepId)) {
            issues.push(`User ${progress.userId} has invalid completed step ID: ${stepId}`);
          }
        }

        if (!IdService.isValidStepId(progress.currentStepId) && progress.currentStepId !== "completed") {
          issues.push(`User ${progress.userId} has invalid current step ID: ${progress.currentStepId}`);
        }
      }

      const isValid = issues.length === 0;
      
      if (isValid) {
        console.log("✅ Data integrity validation passed!");
      } else {
        console.log(`❌ Data integrity validation found ${issues.length} issues:`);
        issues.forEach(issue => console.log(`  - ${issue}`));
      }

      return { valid: isValid, issues };
    } catch (error) {
      console.error("❌ Validation failed:", error);
      throw error;
    }
  }

  /**
   * Run complete data migration and validation
   */
  static async runCompleteMigration(): Promise<void> {
    console.log("🚀 Starting complete data migration...");

    try {
      // Step 1: Fix prerequisite formats
      await this.fixPrerequisiteFormats();

      // Step 2: Clean user progress
      await this.cleanUserStudyProgress();

      // Step 3: Validate everything
      const validation = await this.validateDataIntegrity();

      if (validation.valid) {
        console.log("🎉 Migration completed successfully! Data is now consistent.");
      } else {
        console.log("⚠️ Migration completed but some issues remain:");
        validation.issues.forEach(issue => console.log(`  - ${issue}`));
      }
    } catch (error) {
      console.error("💥 Migration failed:", error);
      throw error;
    }
  }
}