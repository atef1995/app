import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StudyPlanService } from "@/lib/services/studyPlanService";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { stepId, completed, hoursSpent } = body;

    if (!stepId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current dynamic study plan
    const studyPlan = await StudyPlanService.getWebDevelopmentStudyPlan();

    // Get current progress
    let userProgress = await StudyPlanService.getUserStudyPlanProgress(
      session.user.id,
      studyPlan.id
    );

    if (!userProgress) {
      return NextResponse.json(
        { error: "Study plan progress not found" },
        { status: 404 }
      );
    }

    // Update completed steps
    let completedSteps = [...userProgress.completedSteps];
    
    if (completed && !completedSteps.includes(stepId)) {
      completedSteps.push(stepId);
    } else if (!completed && completedSteps.includes(stepId)) {
      completedSteps = completedSteps.filter(id => id !== stepId);
    }

    // Calculate new progress
    const totalSteps = studyPlan.phases.reduce(
      (sum, phase) => sum + phase.steps.length + phase.projects.length, 
      0
    );
    const totalProgressPercentage = totalSteps > 0 
      ? Math.round((completedSteps.length / totalSteps) * 100) 
      : 0;

    // Find current phase and next step
    let currentPhaseId = userProgress.currentPhaseId;
    let currentStepId = userProgress.currentStepId;

    for (const phase of studyPlan.phases) {
      for (const step of [...phase.steps, ...phase.projects]) {
        if (!completedSteps.includes(step.id)) {
          const prerequisitesMet = step.prerequisites.every(prereq => 
            completedSteps.includes(prereq)
          );
          
          if (prerequisitesMet) {
            currentPhaseId = phase.id;
            currentStepId = step.id;
            break;
          }
        }
      }
    }

    const newHoursSpent = Math.max(userProgress.hoursSpent + (hoursSpent || 0), 0);

    // Update progress in database
    const updatedProgress = await prisma.userStudyProgress.update({
      where: {
        userId_studyPlanId: {
          userId: session.user.id,
          studyPlanId: studyPlan.id,
        },
      },
      data: {
        completedSteps,
        totalProgressPercentage,
        currentPhaseId,
        currentStepId,
        hoursSpent: newHoursSpent,
        lastActivityAt: new Date(),
      },
    });

    // Update existing progress tracking for integration with achievements
    if (completed) {
      const step = studyPlan.phases
        .flatMap(p => [...p.steps, ...p.projects])
        .find(s => s.id === stepId);

      if (step?.slug && step.type === "tutorial") {
        // Mark tutorial progress for achievements
        try {
          await prisma.progress.upsert({
            where: {
              userId_tutorialId: {
                userId: session.user.id,
                tutorialId: step.slug,
              },
            },
            update: {
              completed: true,
            },
            create: {
              userId: session.user.id,
              tutorialId: step.slug,
              completed: true,
              timeSpent: (hoursSpent || 1) * 60, // Convert to minutes
            },
          });
        } catch (error) {
          console.warn("Failed to log tutorial progress:", error);
        }
      }
    }

    userProgress = {
      userId: updatedProgress.userId,
      studyPlanId: updatedProgress.studyPlanId,
      currentPhaseId: updatedProgress.currentPhaseId,
      currentStepId: updatedProgress.currentStepId,
      completedSteps: updatedProgress.completedSteps,
      completedPhases: updatedProgress.completedPhases,
      totalProgressPercentage: updatedProgress.totalProgressPercentage,
      hoursSpent: updatedProgress.hoursSpent,
      startedAt: updatedProgress.startedAt,
      estimatedCompletionDate: updatedProgress.estimatedCompletionDate,
      lastActivityAt: updatedProgress.lastActivityAt,
    };

    return NextResponse.json({
      userProgress,
      message: completed ? "Step completed!" : "Step progress updated",
    });
  } catch (error) {
    console.error("Error updating study plan progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studyPlan = await StudyPlanService.getWebDevelopmentStudyPlan();
    const userProgress = await StudyPlanService.getUserStudyPlanProgress(
      session.user.id,
      studyPlan.id
    );

    if (!userProgress) {
      return NextResponse.json(
        { error: "Study plan progress not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ userProgress });
  } catch (error) {
    console.error("Error fetching study plan progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}