#!/usr/bin/env node

/**
 * Data migration script to fix study plan inconsistencies
 * Run with: node scripts/migrate-data.js
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting data migration...');
  
  try {
    // Get all phase steps to check for issues
    const phaseStepsWithIssues = await prisma.phaseStep.findMany();

    const hasIssues = phaseStepsWithIssues.some(step => 
      step.prerequisites.some(prereq => !prereq.startsWith('step-'))
    );

    if (!hasIssues) {
      console.log('✅ No migration needed - prerequisites are already in correct format');
    } else {
      console.log('🔧 Migration needed - fixing prerequisite formats...');
    }

    // Get all phase steps
    const allPhaseSteps = await prisma.phaseStep.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${allPhaseSteps.length} phase steps to process`);

    let updatedCount = 0;
    const updatePromises = [];

    for (const step of allPhaseSteps) {
      if (step.prerequisites.length === 0) continue;

      const fixedPrerequisites = [];
      let hasChanges = false;

      for (const prereq of step.prerequisites) {
        let fixedPrereq = prereq;

        // Convert different formats to step-{id} format
        if (!prereq.startsWith('step-')) {
          if (prereq.startsWith('tutorial-') || prereq.startsWith('quiz-') || 
              prereq.startsWith('challenge-') || prereq.startsWith('project-')) {
            // Extract content slug and find matching step
            const contentSlug = prereq.split('-').slice(1).join('-');
            const contentType = prereq.split('-')[0];
            
            const matchingStep = allPhaseSteps.find(ps => 
              ps.contentType === contentType && ps.contentSlug === contentSlug
            );
            
            if (matchingStep) {
              fixedPrereq = `step-${matchingStep.id}`;
              hasChanges = true;
              console.log(`    Converted ${prereq} -> ${fixedPrereq}`);
            } else {
              console.warn(`    Warning: Could not find matching step for ${prereq}`);
            }
          } else if (/^[a-z0-9]+$/i.test(prereq)) {
            // Assume it's a raw step ID
            fixedPrereq = `step-${prereq}`;
            hasChanges = true;
            console.log(`    Converted raw ID ${prereq} -> ${fixedPrereq}`);
          }
        }

        fixedPrerequisites.push(fixedPrereq);
      }

      if (hasChanges) {
        console.log(`Updating step ${step.id}:`);
        console.log(`  From: [${step.prerequisites.join(', ')}]`);
        console.log(`  To:   [${fixedPrerequisites.join(', ')}]`);

        updatePromises.push(
          prisma.phaseStep.update({
            where: { id: step.id },
            data: { prerequisites: fixedPrerequisites }
          })
        );
        
        updatedCount++;
      }
    }

    // Execute all updates
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`✅ Updated ${updatedCount} phase steps`);
    }

    // Clean user study progress
    console.log('🧹 Cleaning user study progress...');
    
    const userProgress = await prisma.userStudyProgress.findMany();
    const progressUpdatePromises = [];
    let cleanedProgressCount = 0;

    for (const progress of userProgress) {
      const cleanedSteps = progress.completedSteps.filter(stepId => 
        /^step-[a-z0-9]+$/i.test(stepId)
      );

      if (cleanedSteps.length !== progress.completedSteps.length) {
        const removedCount = progress.completedSteps.length - cleanedSteps.length;
        console.log(`Cleaning progress for user ${progress.userId}: removed ${removedCount} invalid step IDs`);

        progressUpdatePromises.push(
          prisma.userStudyProgress.update({
            where: { id: progress.id },
            data: { 
              completedSteps: cleanedSteps,
              totalProgressPercentage: Math.round(
                (cleanedSteps.length / Math.max(progress.completedSteps.length, 1)) * 
                progress.totalProgressPercentage
              )
            }
          })
        );
        
        cleanedProgressCount++;
      }
    }

    if (progressUpdatePromises.length > 0) {
      await Promise.all(progressUpdatePromises);
      console.log(`✅ Cleaned ${cleanedProgressCount} user progress records`);
    }

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});