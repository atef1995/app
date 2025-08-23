import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch tutorial statistics
    const tutorialProgress = await prisma.tutorialProgress.findMany({
      where: { userId },
      select: {
        completedAt: true,
        timeSpent: true,
        isCompleted: true,
      },
    });

    const completedTutorials = tutorialProgress.filter(p => p.isCompleted);
    const tutorialThisWeek = completedTutorials.filter(p => 
      p.completedAt && p.completedAt >= oneWeekAgo
    ).length;
    const tutorialThisMonth = completedTutorials.filter(p => 
      p.completedAt && p.completedAt >= oneMonthAgo
    ).length;

    // Calculate tutorial streak
    let tutorialStreak = 0;
    const sortedCompletedTutorials = completedTutorials
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    let currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedCompletedTutorials.length; i++) {
      const completedDate = new Date(sortedCompletedTutorials[i].completedAt!);
      completedDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === tutorialStreak) {
        tutorialStreak++;
        currentDate = new Date(completedDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    // Fetch challenge statistics
    const challengeAttempts = await prisma.challengeAttempt.findMany({
      where: { userId },
      select: {
        isCorrect: true,
        submittedAt: true,
        challengeId: true,
      },
    });

    const uniqueChallengesSolved = new Set(
      challengeAttempts.filter(a => a.isCorrect).map(a => a.challengeId)
    ).size;

    const challengeSuccessRate = challengeAttempts.length > 0 
      ? (challengeAttempts.filter(a => a.isCorrect).length / challengeAttempts.length) * 100 
      : 0;

    // Fetch quiz statistics
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      select: {
        score: true,
        totalQuestions: true,
        submittedAt: true,
      },
    });

    const completedQuizzes = quizAttempts.length;
    const averageQuizScore = quizAttempts.length > 0 
      ? (quizAttempts.reduce((sum, attempt) => 
          sum + (attempt.score / attempt.totalQuestions) * 100, 0
        ) / quizAttempts.length) 
      : 0;

    const perfectQuizScores = quizAttempts.filter(attempt => 
      attempt.score === attempt.totalQuestions
    ).length;

    // Fetch project statistics (mock data since project model might not exist yet)
    const projectsCompleted = 0;
    const projectsShowcased = 0;
    const averageProjectRating = 0;

    // Calculate time statistics
    const totalTimeSpent = tutorialProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const totalDays = Math.max(1, Math.floor((now.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAverage = totalTimeSpent / totalDays;
    const weeklyAverage = dailyAverage * 7;

    // Find longest session (mock data)
    const longestSession = Math.max(...tutorialProgress.map(p => p.timeSpent || 0), 0);

    // Fetch recent achievements (mock data since achievements model might not exist yet)
    const recentAchievements: Array<{
      id: string;
      title: string;
      description: string;
      earnedAt: string;
    }> = [];

    // Get total available content counts
    const totalTutorials = await prisma.tutorial.count();

    const usageData = {
      tutorials: {
        completed: completedTutorials.length,
        total: totalTutorials,
        thisWeek: tutorialThisWeek,
        thisMonth: tutorialThisMonth,
        streak: tutorialStreak,
      },
      challenges: {
        completed: challengeAttempts.length,
        total: await prisma.challenge.count(),
        solved: uniqueChallengesSolved,
        attempted: challengeAttempts.length,
        successRate: challengeSuccessRate,
      },
      quizzes: {
        completed: completedQuizzes,
        averageScore: averageQuizScore,
        totalAttempts: quizAttempts.length,
        perfectScores: perfectQuizScores,
      },
      projects: {
        completed: projectsCompleted,
        total: 0, // await prisma.project.count() when model exists
        averageRating: averageProjectRating,
        showcased: projectsShowcased,
      },
      timeStats: {
        totalMinutes: Math.round(totalTimeSpent),
        dailyAverage: Math.round(dailyAverage),
        weeklyAverage: Math.round(weeklyAverage),
        longestSession: Math.round(longestSession),
      },
      achievements: {
        total: recentAchievements.length,
        recent: recentAchievements,
      },
    };

    return NextResponse.json({
      success: true,
      data: usageData,
    });

  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to fetch usage statistics" },
      },
      { status: 500 }
    );
  }
}