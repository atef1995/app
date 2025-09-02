#!/usr/bin/env node

/**
 * Data validation script to check study plan integrity
 * Run with: node scripts/validate-data.js
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function isValidStepId(stepId) {
  return /^step-[a-z0-9]+$/i.test(stepId);
}

async function main() {
  console.log('🔍 Validating study plan data integrity...');
  
  const issues = [];
  
  try {
    // Check PhaseStep prerequisites
    console.log('Checking PhaseStep prerequisites...');
    const phaseSteps = await prisma.phaseStep.findMany();
    
    for (const step of phaseSteps) {
      for (const prereq of step.prerequisites) {
        if (!isValidStepId(prereq)) {
          issues.push(`PhaseStep ${step.id} (${step.contentType}:${step.contentSlug}) has invalid prerequisite format: ${prereq}`);
        } else {
          // Check if prerequisite step actually exists
          const prereqStepId = prereq.replace('step-', '');
          const prereqExists = phaseSteps.some(ps => ps.id === prereqStepId);
          if (!prereqExists) {
            issues.push(`PhaseStep ${step.id} references non-existent prerequisite: ${prereq}`);
          }
        }
      }
    }

    // Check UserStudyProgress
    console.log('Checking UserStudyProgress...');
    const userProgress = await prisma.userStudyProgress.findMany();
    
    for (const progress of userProgress) {
      // Check completed steps
      for (const stepId of progress.completedSteps) {
        if (!isValidStepId(stepId)) {
          issues.push(`User ${progress.userId} has invalid completed step ID: ${stepId}`);
        }
      }

      // Check current step
      if (!isValidStepId(progress.currentStepId) && progress.currentStepId !== "completed") {
        issues.push(`User ${progress.userId} has invalid current step ID: ${progress.currentStepId}`);
      }

      // Check for duplicate completed steps
      const uniqueSteps = [...new Set(progress.completedSteps)];
      if (uniqueSteps.length !== progress.completedSteps.length) {
        const duplicateCount = progress.completedSteps.length - uniqueSteps.length;
        issues.push(`User ${progress.userId} has ${duplicateCount} duplicate completed steps`);
      }
    }

    // Check for orphaned prerequisites
    console.log('Checking for orphaned prerequisites...');
    const allStepIds = new Set(phaseSteps.map(step => `step-${step.id}`));
    
    for (const step of phaseSteps) {
      for (const prereq of step.prerequisites) {
        if (isValidStepId(prereq) && !allStepIds.has(prereq)) {
          issues.push(`PhaseStep ${step.id} references orphaned prerequisite: ${prereq}`);
        }
      }
    }

    // Check phase step ordering
    console.log('Checking phase step ordering...');
    const phases = await prisma.phase.findMany({
      include: { phaseSteps: true }
    });

    for (const phase of phases) {
      const stepsByOrder = phase.phaseSteps.sort((a, b) => a.order - b.order);
      
      // Check for duplicate orders
      const orders = stepsByOrder.map(s => s.order);
      const uniqueOrders = [...new Set(orders)];
      if (orders.length !== uniqueOrders.length) {
        issues.push(`Phase ${phase.slug} has duplicate step orders`);
      }

      // Check if quiz comes after its tutorial
      for (let i = 0; i < stepsByOrder.length; i++) {
        const step = stepsByOrder[i];
        if (step.contentType === 'quiz') {
          // Find corresponding tutorial
          const tutorialSlug = step.contentSlug.replace('-quiz', '');
          const correspondingTutorial = stepsByOrder.find(s => 
            s.contentType === 'tutorial' && s.contentSlug === tutorialSlug
          );
          
          if (correspondingTutorial && correspondingTutorial.order >= step.order) {
            issues.push(`Quiz ${step.contentSlug} (order ${step.order}) should come after tutorial ${correspondingTutorial.contentSlug} (order ${correspondingTutorial.order})`);
          }
        }
      }
    }

    // Report results
    console.log('\\n' + '='.repeat(60));
    
    if (issues.length === 0) {
      console.log('✅ Data integrity validation PASSED!');
      console.log('No issues found in the study plan data.');
    } else {
      console.log(`❌ Data integrity validation FAILED!`);
      console.log(`Found ${issues.length} issue(s):\\n`);
      
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
      
      console.log(`\\n💡 Run the migration script to fix these issues:`);
      console.log(`   node scripts/migrate-data.js`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});